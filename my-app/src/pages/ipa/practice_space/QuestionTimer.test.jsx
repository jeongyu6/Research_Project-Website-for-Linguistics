import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import QuestionTimer from './QuestionTimer.jsx'

beforeEach(() => vi.useFakeTimers())
afterEach(() => { cleanup(); vi.useRealTimers() })
const advance = (ms) => act(() => vi.advanceTimersByTime(ms))

it('expires once at 30 seconds and cleans up on unmount', () => {
  const onExpire = vi.fn()
  const { unmount } = render(<QuestionTimer questionId="a" onExpire={onExpire} />)
  advance(29000)
  expect(screen.getByRole('timer')).toHaveTextContent('0:01')
  expect(onExpire).not.toHaveBeenCalled()
  advance(1000)
  expect(screen.getByRole('timer')).toHaveTextContent('Time’s up')
  advance(30000)
  expect(onExpire).toHaveBeenCalledTimes(1)
  unmount()
  expect(vi.getTimerCount()).toBe(0)
})

it('preserves time across navigation and stops after submission', () => {
  const onExpire = vi.fn()
  const { rerender } = render(<QuestionTimer questionId="a" onExpire={onExpire} />)
  advance(10000)
  rerender(<QuestionTimer questionId="b" onExpire={onExpire} />)
  expect(screen.getByRole('timer')).toHaveTextContent('0:30')
  advance(5000)
  rerender(<QuestionTimer questionId="a" onExpire={onExpire} />)
  expect(screen.getByRole('timer')).toHaveTextContent('0:20')
  rerender(<QuestionTimer questionId="a" paused onExpire={onExpire} />)
  advance(60000)
  expect(screen.getByRole('timer')).toHaveTextContent('0:20')
  expect(onExpire).not.toHaveBeenCalled()
})

it('starts a fresh countdown for a restarted session', () => {
  const onExpire = vi.fn()
  const { rerender } = render(<QuestionTimer key="1" questionId="a" onExpire={onExpire} />)
  advance(30000)
  rerender(<QuestionTimer key="2" questionId="a" onExpire={onExpire} />)
  expect(screen.getByRole('timer')).toHaveTextContent('0:30')
  advance(30000)
  expect(onExpire).toHaveBeenCalledTimes(2)
})

it('allows three minutes for a chart attempt', () => {
  const onExpire = vi.fn()
  render(<QuestionTimer questionId="chart" duration={180} onExpire={onExpire} />)
  expect(screen.getByRole('timer')).toHaveTextContent('3:00')
  advance(30000)
  expect(screen.getByRole('timer')).toHaveTextContent('2:30')
  expect(onExpire).not.toHaveBeenCalled()
  advance(150000)
  expect(onExpire).toHaveBeenCalledTimes(1)
})
