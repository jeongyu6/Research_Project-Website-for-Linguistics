import '@testing-library/jest-dom/vitest'
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import Level2 from './Level2CompleteChart.jsx'
import { consonantSlots, pulmonicColumns, pulmonicRows } from '../chartData.js'

afterEach(() => { cleanup(); vi.useRealTimers() })
it('starts with blank headings, rejects label-to-symbol placement, and undoes a heading', () => {
  render(<Level2 />)
  const firstColumn = screen.getByRole('columnheader', { name: 'Column 1' })
  expect(firstColumn).not.toHaveTextContent('Bilabial')
  expect(screen.getByRole('rowheader', { name: 'Row 1' })).not.toHaveTextContent('Oral Stop')
  fireEvent.click(within(screen.getByRole('group', { name: 'Place of Articulation labels' })).getByRole('button', { name: 'Bilabial', exact: true }))
  const symbolTarget = screen.getByRole('button', { name: 'Row 1, column 1, position 1', exact: true })
  fireEvent.click(symbolTarget)
  expect(symbolTarget).toHaveTextContent('＋')
  fireEvent.click(within(firstColumn).getByRole('button'))
  expect(firstColumn).toHaveTextContent('Bilabial')
  fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
  expect(firstColumn).toHaveTextContent('Column 1')
  expect(screen.getByRole('button', { name: 'Check chart' })).toBeDisabled()
})
it('grades all 15 headings and 25 consonant placements', () => {
  render(<Level2 />)
  for (const [i, label] of pulmonicColumns.entries()) {
    fireEvent.click(within(screen.getByRole('group', { name: 'Place of Articulation labels' })).getByRole('button', { name: label, exact: true }))
    fireEvent.click(screen.getByRole('button', { name: `Column ${i + 1}`, exact: true }))
  }
  for (const [i, [label]] of pulmonicRows.entries()) {
    fireEvent.click(within(screen.getByRole('group', { name: 'Manner of Articulation labels' })).getByRole('button', { name: label, exact: true }))
    fireEvent.click(screen.getByRole('button', { name: `Row ${i + 1}`, exact: true }))
  }
  for (const { symbol, row, column, position } of consonantSlots) {
    fireEvent.click(within(screen.getByRole('group', { name: 'Consonant bank' })).getAllByRole('button', { name: `/${symbol}/`, exact: true })[0])
    fireEvent.click(screen.getByRole('button', { name: `Row ${row + 1}, column ${column + 1}, position ${position + 1}`, exact: true }))
  }
  fireEvent.click(screen.getByRole('button', { name: 'Check chart' }))
  expect(screen.getByRole('status')).toHaveTextContent('40/40 (100%)')
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
  expect(screen.getByRole('columnheader', { name: 'Column 1' })).toBeInTheDocument()
}, 20000)
it('reviews missing headings and symbols after timeout', () => {
  vi.useFakeTimers()
  render(<Level2 />)
  expect(screen.getByRole('timer')).toHaveTextContent('5:00')
  act(() => vi.advanceTimersByTime(180000))
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
  expect(screen.getByRole('timer')).toHaveTextContent('2:00')
  act(() => vi.advanceTimersByTime(120000))
  expect(screen.getByRole('status')).toHaveTextContent('Time’s up. Score: 0/40')
  expect(screen.getByText('Bilabial — Column 1')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Column 1' })).toBeDisabled()
})
