import '@testing-library/jest-dom/vitest'
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import Activity1VowelMapDrop from './Activity1_VowelMapDrop.jsx'
import { vowelChartPositions, mapDropSymbols } from '../../sound_listening/vowelChartPositions.js'
const symbols = vowelChartPositions.map(p => p.activitySymbol ?? p.text).filter(s => mapDropSymbols.includes(s))
beforeEach(() => {
  const storage = new Map()
  vi.stubGlobal('localStorage', {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
  })
})
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals() })
function place(correct) {
  const rest = symbols.slice(correct)
  const answers = [...symbols.slice(0, correct), ...rest.slice(1), ...rest.slice(0, 1)]
  answers.forEach((symbol, index) => fireEvent.drop(screen.getByRole('button', { name: `Vowel chart target ${index + 1}`, exact: true }), { dataTransfer: { getData: () => symbol } }))
  fireEvent.click(screen.getByRole('button', { name: 'Check My Answer' }))
}
it.each([[9, false], [10, true]])('requires 70 percent of vowel placements: %i correct', (correct, unlocked) => {
  render(<Activity1VowelMapDrop />)
  const next = screen.getByRole('button', { name: 'Level 2: Match Words to Vowels' })
  expect(next).toBeDisabled()
  place(correct)
  expect(next.disabled).toBe(!unlocked)
  if (unlocked) {
    fireEvent.click(next)
    expect(screen.getByRole('heading', { name: 'Level 2: Match the Words to the Vowels' })).toBeInTheDocument()
    expect(screen.getByRole('timer')).toHaveTextContent('3:00')
    cleanup()
    render(<Activity1VowelMapDrop />)
    expect(screen.getByRole('button', { name: 'Level 2: Match Words to Vowels' })).toBeEnabled()
  }
})
it('preserves placements and pauses time on summary, then combines both level results', () => {
  vi.useFakeTimers()
  render(<Activity1VowelMapDrop />)
  act(() => vi.advanceTimersByTime(5000))
  fireEvent.click(screen.getByRole('button', { name: 'Overall summary' }))
  act(() => vi.advanceTimersByTime(60000))
  fireEvent.click(screen.getByRole('button', { name: 'Level 1: Vowel Map Drop' }))
  expect(screen.getByRole('timer')).toHaveTextContent('2:55')
  place(14)
  fireEvent.click(screen.getByRole('button', { name: 'Continue to Level 2' }))
  act(() => vi.advanceTimersByTime(180000))
  fireEvent.click(screen.getByRole('button', { name: 'View overall summary' }))
  expect(screen.getByText('Overall grade: 14/28 (50%)')).toBeInTheDocument()
  expect(screen.getByText('Total time: 3:05')).toBeInTheDocument()
  expect(within(screen.getByRole('row', { name: /Level 2: Match/ })).getByText('Time expired')).toBeInTheDocument()
})
it('does not use old consonant quiz results to unlock vowel matching', () => {
  window.localStorage.setItem('build-the-sound-level-2-above-70', 'true')
  render(<Activity1VowelMapDrop />)
  expect(screen.getByRole('button', { name: 'Level 2: Match Words to Vowels' })).toBeDisabled()
})
