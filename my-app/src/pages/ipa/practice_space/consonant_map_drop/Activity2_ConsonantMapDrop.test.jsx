import '@testing-library/jest-dom/vitest'
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import ConsonantMapDrop from './Activity2_ConsonantMapDrop.jsx'

afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals() })
const answers = [
  ['Oral Stop', 'Bilabial', ['p', 'b']], ['Oral Stop', 'Alveolar', ['t', 'd']], ['Oral Stop', 'Velar', ['k', 'g']],
  ['Fricative', 'Labiodental', ['f', 'v']], ['Fricative', 'Interdental', ['θ', 'ð']], ['Fricative', 'Alveolar', ['s', 'z']], ['Fricative', 'Alveopalatal', ['ʃ', 'ʒ']], ['Fricative', 'Glottal', ['h']],
  ['Affricate', 'Alveopalatal', ['tʃ', 'dʒ']], ['Nasal', 'Bilabial', ['m']], ['Nasal', 'Alveolar', ['n']], ['Nasal', 'Velar', ['ŋ']],
  ['Retroflex Approximant', 'Alveolar', ['ɹ']], ['Glides', 'Bilabial', ['w']], ['Glides', 'Palatal', ['j']], ['Glides', 'Velar', ['w']], ['Lateral Approximant', 'Alveolar', ['l']],
]
it('starts with a blank chart and grades all consonants including both w positions', () => {
  render(<ConsonantMapDrop />)
  const bank = screen.getByRole('group', { name: 'Consonant bank' })
  expect(within(bank).getAllByRole('button')).toHaveLength(25)
  expect(screen.getByRole('timer')).toHaveTextContent('3:00')
  expect(screen.getByRole('button', { name: 'Check chart' })).toBeDisabled()
  for (const [manner, place, symbols] of answers) {
    symbols.forEach((symbol, i) => {
      fireEvent.click(within(bank).getAllByRole('button', { name: `/${symbol}/`, exact: true })[0])
      fireEvent.click(screen.getByRole('button', { name: `${manner}, ${place}, position ${i + 1}`, exact: true }))
    })
  }
  fireEvent.click(screen.getByRole('button', { name: 'Check chart' }))
  expect(screen.getByRole('status')).toHaveTextContent('25/25 (100%)')
  expect(screen.getByRole('button', { name: 'Level 2: Complete the Chart' })).toBeEnabled()
  expect(screen.getByRole('button', { name: 'Level 3: Match Words' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled()
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
  expect(within(bank).getAllByRole('button')).toHaveLength(25)
  expect(screen.getByRole('timer')).toHaveTextContent('3:00')
}, 15000)
it('supports dragging, replacement, undo, and returning tiles to the bank', () => {
  render(<ConsonantMapDrop />)
  const target = screen.getByRole('button', { name: 'Oral Stop, Bilabial, position 1' })
  const data = new Map()
  fireEvent.dragStart(screen.getByRole('button', { name: '/p/', exact: true }), { dataTransfer: { setData: (key, value) => data.set(key, value) } })
  fireEvent.drop(target, { dataTransfer: { getData: (key) => data.get(key) } })
  expect(target).toHaveTextContent('p')
  fireEvent.click(screen.getByRole('button', { name: '/b/', exact: true }))
  fireEvent.click(target)
  expect(target).toHaveTextContent('b')
  expect(screen.getByRole('button', { name: '/p/', exact: true })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
  expect(target).toHaveTextContent('p')
  fireEvent.click(target)
  expect(target).toHaveTextContent('＋')
  fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
  expect(target).toHaveTextContent('p')
})
it('expires after three minutes and reviews missing and misplaced consonants', () => {
  vi.useFakeTimers()
  render(<ConsonantMapDrop />)
  fireEvent.click(screen.getByRole('button', { name: '/b/', exact: true }))
  const target = screen.getByRole('button', { name: 'Oral Stop, Bilabial, position 1' })
  fireEvent.click(target)
  act(() => vi.advanceTimersByTime(179000))
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
  act(() => vi.advanceTimersByTime(1000))
  expect(screen.getByRole('status')).toHaveTextContent('Time’s up. Score: 0/25')
  expect(target).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled()
  expect(screen.getByText('/p/ — Oral Stop, Bilabial, position 1')).toBeInTheDocument()
})

it('preserves level attempts and pauses timers when switching levels', () => {
  vi.stubGlobal('localStorage', { getItem: (key) => key === 'consonant-map-drop-passing-results' ? JSON.stringify({ 0: { score: 25, total: 25 }, 1: { score: 40, total: 40 } }) : null, setItem: () => {} })
  vi.useFakeTimers()
  render(<ConsonantMapDrop />)
  fireEvent.click(screen.getByRole('button', { name: '/p/', exact: true }))
  fireEvent.click(screen.getByRole('button', { name: 'Oral Stop, Bilabial, position 1' }))
  act(() => vi.advanceTimersByTime(10000))
  fireEvent.click(screen.getByRole('button', { name: 'Level 2: Complete the Chart' }))
  expect(screen.getByRole('timer')).toHaveTextContent('5:00')
  act(() => vi.advanceTimersByTime(20000))
  fireEvent.click(screen.getByRole('button', { name: 'Level 3: Match Words' }))
  expect(screen.getByRole('timer')).toHaveTextContent('3:00')
  fireEvent.click(screen.getByRole('button', { name: 'Level 1: Place Consonants' }))
  expect(screen.getByRole('timer')).toHaveTextContent('2:50')
  expect(screen.getByRole('button', { name: 'Oral Stop, Bilabial, position 1: p' })).toHaveTextContent('p')
})
