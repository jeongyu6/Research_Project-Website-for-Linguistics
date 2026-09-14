import '@testing-library/jest-dom/vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import Build from './build_the_sound/Activity1_BuildTheSound.jsx'
import Mystery from './mystery_sound/Activity2_MysterySound.jsx'
import MapDrop from './vowel_map_drop/Activity3_VowelMapDrop.jsx'
import Detective from './vowel_detective/Activity4_VowelDetective.jsx'

beforeEach(() => vi.useFakeTimers())
afterEach(() => { cleanup(); vi.useRealTimers() })
const advance = (ms) => act(() => vi.advanceTimersByTime(ms))

it.each([['Build the Sound', Build], ['Vowel Detective', Detective]])('%s records timeout and starts the next question timer', (_, Component) => {
  render(<Component />)
  advance(30000)
  expect(screen.getByRole('status')).toHaveTextContent('Time’s up. The correct answer is')
  expect(screen.queryByRole('button', { name: 'Check answer' })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Next question' }))
  expect(screen.getByRole('timer')).toHaveTextContent('0:30')
  fireEvent.click(screen.getByRole('button', { name: 'Previous question' }))
  expect(screen.getByRole('timer')).toHaveTextContent('Time’s up')
})

it('ends a mystery without points and resets for the next round', () => {
  render(<Mystery />)
  advance(30000)
  expect(screen.getByRole('status')).toHaveTextContent('Time’s up. The mystery sound was')
  expect(screen.getByText(/Round 1 · Score 0/)).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Next mystery' }))
  expect(screen.getByRole('timer')).toHaveTextContent('0:30')
})

it('gives Map Drop three minutes, shows review at expiry, and resets', () => {
  render(<MapDrop />)
  advance(30000)
  expect(screen.getByRole('timer')).toHaveTextContent('2:30')
  expect(screen.queryByText('Answer Summary')).not.toBeInTheDocument()
  advance(150000)
  expect(screen.getByRole('status')).toHaveTextContent('Time’s up')
  expect(screen.getByText('Answer Summary')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled()
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
  expect(screen.getByRole('timer')).toHaveTextContent('3:00')
  expect(screen.queryByText('Answer Summary')).not.toBeInTheDocument()
})
