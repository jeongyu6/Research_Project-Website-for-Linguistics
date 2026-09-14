import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import Level3 from './Level3WordMatch.jsx'

afterEach(cleanup)
const key = {"psychology": "p", "lamb": "b", "two": "t", "Wednesday": "d", "chemistry": "k", "ghost": "g", "phone": "f", "view": "v", "theory": "θ", "those": "ð", "city": "s", "xylophone": "z", "chef": "ʃ", "genre": "ʒ", "question": "tʃ", "giant": "dʒ", "mnemonic": "m", "knee": "n", "who": "h", "write": "ɹ", "university": "j", "one": "w", "llama": "l", "singer": "ŋ"}
it('shows the complete consonant chart and grades all 24 matches from the supplied key', () => {
  render(<Level3 />)
  const bank = screen.getByRole('group', { name: 'Student word bank' })
  expect(within(bank).getAllByRole('button')).toHaveLength(24)
  expect(screen.getByRole('columnheader', { name: 'Bilabial' })).toBeInTheDocument()
  expect(screen.getByText('/ŋ/', { selector: 'span' })).toBeInTheDocument()
  for (const [word, symbol] of Object.entries(key)) {
    fireEvent.click(within(bank).getByRole('button', { name: word, exact: true }))
    fireEvent.click(screen.getByRole('button', { name: `Match word to /${symbol}/`, exact: true }))
  }
  fireEvent.click(screen.getByRole('button', { name: 'Check chart' }))
  expect(screen.getByRole('status')).toHaveTextContent('24/24 (100%)')
  expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled()
}, 15000)
it('accepts drag-and-drop and reverses a wrong placement with Undo', () => {
  render(<Level3 />)
  const data = new Map()
  fireEvent.dragStart(screen.getByRole('button', { name: 'write', exact: true }), { dataTransfer: { setData: (key, value) => data.set(key, value) } })
  const target = screen.getByRole('button', { name: 'Match word to /w/', exact: true })
  fireEvent.drop(target, { dataTransfer: { getData: (key) => data.get(key) } })
  expect(target).toHaveTextContent('write')
  fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
  expect(target).toHaveTextContent('Drop word')
  expect(screen.getByRole('button', { name: 'write', exact: true })).toBeInTheDocument()
})
