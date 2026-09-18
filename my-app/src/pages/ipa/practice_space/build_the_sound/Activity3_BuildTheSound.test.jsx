import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
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
it('keeps the consonant quiz and its summary as a standalone activity', () => {
  render(<Activity3BuildTheSound initialQuestions={questions.slice(0, 1)} />)
  expect(screen.queryByRole('button', { name: /Level 2/ })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: '/p/' }))
  fireEvent.click(screen.getByRole('button', { name: 'Check answer' }))
  fireEvent.click(screen.getByRole('button', { name: 'View summary' }))
  expect(screen.getByRole('heading', { name: 'Build the Sound Summary' })).toBeInTheDocument()
})
