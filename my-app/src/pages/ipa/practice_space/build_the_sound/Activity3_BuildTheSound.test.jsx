import '@testing-library/jest-dom/vitest'
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import Activity3BuildTheSound from './Activity3_BuildTheSound.jsx'

beforeEach(() => {
  const storage = new Map()
  vi.stubGlobal('localStorage', {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
  })
})
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals() })
const questions = Array.from({ length: 10 }, (_, i) => ({ id: `q${i}`, features: ['Voiceless', 'Bilabial', 'Plosive'], choices: ['p', 'b'], answer: 'p' }))
it.each([[6, false], [7, true], [8, true], [10, true]])('unlocks Level 2 at 70 percent or above: %i correct', (correct, unlocked) => {
  render(<Activity3BuildTheSound initialQuestions={questions} />)
  const level2 = screen.getByRole('button', { name: 'Level 2: Match Words to Vowels' })
  expect(level2).toBeDisabled()
  for (let i = 0; i < 10; i++) {
    fireEvent.click(screen.getByRole('button', { name: i < correct ? '/p/' : '/b/' }))
    fireEvent.click(screen.getByRole('button', { name: 'Check answer' }))
    if (i < 9) {
      expect(level2).toBeDisabled()
      fireEvent.click(screen.getByRole('button', { name: 'Next question' }))
    }
  }
  expect(level2.disabled).toBe(!unlocked)
  fireEvent.click(screen.getByRole('button', { name: 'View summary' }))
  expect(screen.getByRole('heading', { name: 'Build the Sound Summary' })).toBeInTheDocument()
  if (unlocked) {
    fireEvent.click(screen.getByRole('button', { name: 'Continue to Level 2' }))
    expect(screen.getByRole('heading', { name: 'Level 2: Match the Words to the Vowels' })).toBeInTheDocument()
    expect(screen.getByRole('timer')).toHaveTextContent('3:00')
    cleanup()
    render(<Activity3BuildTheSound initialQuestions={questions} />)
    expect(screen.getByRole('button', { name: 'Level 2: Match Words to Vowels' })).toBeEnabled()
  } else {
    expect(screen.queryByRole('button', { name: 'Continue to Level 2' })).not.toBeInTheDocument()
  }
})

it('summarizes grades and active time, preserves attempts, and saves both levels', () => {
  vi.useFakeTimers()
  render(<Activity3BuildTheSound initialQuestions={questions.slice(0, 2)} />)
  act(() => vi.advanceTimersByTime(5000))
  fireEvent.click(screen.getByRole('button', { name: '/p/' }))
  fireEvent.click(screen.getByRole('button', { name: 'Check answer' }))
  act(() => vi.advanceTimersByTime(30000))
  fireEvent.click(screen.getByRole('button', { name: 'Next question' }))
  act(() => vi.advanceTimersByTime(3000))
  fireEvent.click(screen.getByRole('button', { name: 'Overall summary' }))
  expect(screen.getByText('Complete both levels to see your overall grade.')).toBeInTheDocument()
  act(() => vi.advanceTimersByTime(60000))
  fireEvent.click(screen.getByRole('button', { name: 'Level 1: Build the Sound' }))
  expect(screen.getByText('Question 2 of 2')).toBeInTheDocument()
  expect(screen.getByRole('timer')).toHaveTextContent('0:27')
  act(() => vi.advanceTimersByTime(4000))
  fireEvent.click(screen.getByRole('button', { name: '/p/' }))
  fireEvent.click(screen.getByRole('button', { name: 'Check answer' }))
  fireEvent.click(screen.getByRole('button', { name: 'Level 2: Match Words to Vowels' }))
  act(() => vi.advanceTimersByTime(180000))
  fireEvent.click(screen.getByRole('button', { name: 'View overall summary' }))
  const level1 = screen.getByRole('row', { name: /Level 1: Build the Sound/ })
  expect(within(level1).getByText('100%')).toBeInTheDocument()
  expect(within(level1).getByText('0:12')).toBeInTheDocument()
  const level2 = screen.getByRole('row', { name: /Level 2: Match the Words/ })
  expect(within(level2).getByText('3:00')).toBeInTheDocument()
  expect(within(level2).getByText('Time expired')).toBeInTheDocument()
  expect(screen.getByText('Overall grade: 2/16 (13%)')).toBeInTheDocument()
  expect(screen.getByText('Total time: 3:12')).toBeInTheDocument()
  cleanup()
  render(<Activity3BuildTheSound />)
  fireEvent.click(screen.getByRole('button', { name: 'Overall summary' }))
  expect(screen.getByText('Total time: 3:12')).toBeInTheDocument()
})

it('restores an unlock from a saved score of exactly 70 percent', () => {
  window.localStorage.setItem('build-the-sound-level-2-unlocked', 'true')
  window.localStorage.setItem('build-the-sound-level-results', JSON.stringify({ 1: { score: 7, total: 10 } }))
  render(<Activity3BuildTheSound initialQuestions={questions} />)
  expect(screen.getByRole('button', { name: 'Level 2: Match Words to Vowels' })).toBeEnabled()
})
