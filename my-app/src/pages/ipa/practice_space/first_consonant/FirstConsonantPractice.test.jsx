import '@testing-library/jest-dom/vitest'
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it, vi } from 'vitest'
import PracticeSpace from '../PracticeSpace.jsx'
import FirstConsonantPractice from './FirstConsonantPractice.jsx'
import { firstConsonantQuestions } from './questions.js'

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.useRealTimers() })

it('expires after three minutes, checks answers, and resets on restart', () => {
  vi.useFakeTimers()
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  render(<FirstConsonantPractice />)
  expect(screen.getByRole('timer')).toHaveTextContent('3:00')
  fireEvent.change(screen.getByRole('textbox', { name: 'First consonant for book' }), { target: { value: 'b' } })
  act(() => vi.advanceTimersByTime(179000))
  expect(screen.getByRole('timer')).toHaveTextContent('0:01')
  act(() => vi.advanceTimersByTime(1000))
  expect(screen.getByRole('status')).toHaveTextContent('Time’s up! You scored 1 out of 20.')
  expect(screen.getByRole('combobox', { name: 'Answer choices for book' })).toBeDisabled()
  fireEvent.click(screen.getByRole('button', { name: 'Restart practice' }))
  expect(screen.getByRole('timer')).toHaveTextContent('3:00')
  expect(screen.getByRole('textbox', { name: 'First consonant for book' })).toHaveValue('')
})

it('stops the timer when students check their answers', () => {
  vi.useFakeTimers()
  render(<FirstConsonantPractice />)
  act(() => vi.advanceTimersByTime(30000))
  fireEvent.change(screen.getByRole('textbox', { name: 'First consonant for book' }), { target: { value: 'b' } })
  fireEvent.click(screen.getByRole('button', { name: 'Check answers' }))
  act(() => vi.advanceTimersByTime(180000))
  expect(screen.getByRole('timer')).toHaveTextContent('2:30')
  expect(screen.getByRole('status')).not.toHaveTextContent('Time’s up!')
})

it('reshuffles rows and dropdowns on restart while preserving recordings and choices', async () => {
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  const random = vi.spyOn(Math, 'random').mockReturnValue(0)
  const user = userEvent.setup()
  render(<FirstConsonantPractice />)
  const rowOrder = () => screen.getAllByRole('textbox').map((input) => input.getAttribute('aria-label'))
  const optionOrder = () => within(screen.getByRole('combobox', { name: 'Answer choices for book' })).getAllByRole('option').slice(1).map((option) => option.value)
  const originalRows = rowOrder()
  const originalOptions = optionOrder()
  await user.type(screen.getByRole('textbox', { name: 'First consonant for book' }), 'b')
  expect(rowOrder()).toEqual(originalRows)
  expect(optionOrder()).toEqual(originalOptions)
  random.mockReturnValue(0.999)
  await user.click(screen.getByRole('button', { name: 'Restart practice' }))
  expect(rowOrder()).not.toEqual(originalRows)
  expect(optionOrder()).not.toEqual(originalOptions)
  expect(new Set(optionOrder())).toEqual(new Set(firstConsonantQuestions.map(({ answer }) => answer)))
  for (const { word } of firstConsonantQuestions) {
    expect(screen.getByLabelText(`Listen to ${word}`)).toHaveAttribute('src', expect.stringContaining(`${word}.mp3`))
  }
})

it('lets students select a choice, then edit the same answer by typing', async () => {
  const user = userEvent.setup()
  render(<FirstConsonantPractice />)
  const dropdown = screen.getByRole('combobox', { name: 'Answer choices for book' })
  expect(within(dropdown).getAllByRole('option')).toHaveLength(21)
  const input = screen.getByRole('textbox', { name: 'First consonant for book' })
  await user.selectOptions(dropdown, 'p')
  expect(input).toHaveValue('p')
  await user.clear(input)
  await user.type(input, 'b')
  expect(dropdown).toHaveValue('b')
  await user.click(screen.getByRole('button', { name: 'Check answers' }))
  expect(screen.getByRole('status')).toHaveTextContent('You scored 1 out of 20.')
  expect(dropdown).toBeDisabled()
})

it('opens the exercise with a recording for each word', async () => {
  const user = userEvent.setup()
  render(<PracticeSpace />)
  await user.click(screen.getByRole('tab', { name: 'Activity #6: First Consonant' }))
  expect(screen.getAllByRole('textbox')).toHaveLength(20)
  for (const { word } of firstConsonantQuestions) {
    expect(screen.getByLabelText(`Listen to ${word}`)).toHaveAttribute('src', expect.stringContaining(`${word}.mp3`))
  }
})

it('checks written answers and resets the exercise', async () => {
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  const user = userEvent.setup()
  render(<FirstConsonantPractice />)
  expect(screen.getByRole('button', { name: 'Check answers' })).toBeDisabled()
  for (const { word, answer } of firstConsonantQuestions) {
    await user.type(screen.getByRole('textbox', { name: `First consonant for ${word}` }), `[[${answer}]`)
  }
  await user.click(screen.getByRole('button', { name: 'Check answers' }))
  expect(screen.getByRole('status')).toHaveTextContent('You scored 20 out of 20.')
  await user.click(screen.getByRole('button', { name: 'Restart practice' }))
  expect(screen.getByRole('textbox', { name: 'First consonant for book' })).toHaveValue('')
  expect(screen.getByRole('button', { name: 'Check answers' })).toBeDisabled()
})

it('accepts typed IPA symbols and shows corrections', async () => {
  const user = userEvent.setup()
  render(<FirstConsonantPractice />)
  await user.type(screen.getByRole('textbox', { name: 'First consonant for run' }), 'ɹ')
  await user.click(screen.getByRole('button', { name: 'Check answers' }))
  expect(screen.getByRole('status')).toHaveTextContent('You scored 1 out of 20.')
  expect(screen.getByText('Correct answer: [dʒ]')).toBeInTheDocument()
})
