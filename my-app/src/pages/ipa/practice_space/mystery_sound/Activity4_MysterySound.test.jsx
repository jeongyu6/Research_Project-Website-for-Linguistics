import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it, vi } from 'vitest'
import Activity4OddSoundOut from './Activity4_MysterySound.jsx'
import { oddSoundOutQuestions } from './questions.js'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

it('keeps shuffled choices stable during navigation and reshuffles on restart', async () => {
  const random = vi.spyOn(Math, 'random').mockReturnValue(0)
  const user = userEvent.setup()
  const initialQuestions = oddSoundOutQuestions.slice(0, 2)
  const originalChoices = initialQuestions.map((question) => [...question.choices])
  render(<Activity4OddSoundOut initialQuestions={initialQuestions} />)
  const getChoices = () => within(screen.getByRole('group', { name: 'Choose the odd sound out' }))
    .getAllByRole('button').map((button) => button.textContent)
  const firstOrder = getChoices()
  expect(firstOrder).not.toEqual(originalChoices[0].map((choice) => `/${choice}/`))
  expect(firstOrder).toEqual(expect.arrayContaining(originalChoices[0].map((choice) => `/${choice}/`)))
  await user.click(screen.getByRole('button', { name: '/v/' }))
  expect(getChoices()).toEqual(firstOrder)
  await user.click(screen.getByRole('button', { name: 'Check answer' }))
  await user.click(screen.getByRole('button', { name: 'Next question' }))
  await user.click(screen.getByRole('button', { name: 'Previous question' }))
  expect(getChoices()).toEqual(firstOrder)
  await user.click(screen.getByRole('button', { name: 'Next question' }))
  await user.click(screen.getByRole('button', { name: '/t/' }))
  await user.click(screen.getByRole('button', { name: 'Check answer' }))
  await user.click(screen.getByRole('button', { name: 'View summary' }))
  expect(screen.getByText('Score: 2/2')).toBeInTheDocument()
  random.mockReturnValue(0.999)
  await user.click(screen.getByRole('button', { name: 'Start a new session' }))
  expect(getChoices()).not.toEqual(firstOrder)
  expect(initialQuestions.map((question) => question.choices)).toEqual(originalChoices)
  expect(screen.getByText('Score: 0/2')).toBeInTheDocument()
})

it('checks an answer and shows the supplied explanation', async () => {
  const user = userEvent.setup()
  render(<Activity4OddSoundOut />)
  expect(screen.getByRole('heading', { name: 'Activity 4: Odd Sound Out' })).toBeInTheDocument()
  expect(screen.getByText('Question 1 of 15')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: '/v/' }))
  await user.click(screen.getByRole('button', { name: 'Check answer' }))
  expect(screen.getByRole('status')).toHaveTextContent('/p t k/ are voiceless plosives. /v/ is a voiced fricative.')
  expect(screen.getByRole('status')).toHaveTextContent('Correct!')
  expect(screen.getByRole('status')).toHaveTextContent('Correct answer: /v/')
  expect(screen.getByText('Score: 1/15')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Next question' }))
  expect(screen.getByText('Question 2 of 15')).toBeInTheDocument()
})

it('shows the vowel section and final summary', async () => {
  const user = userEvent.setup()
  render(<Activity4OddSoundOut initialQuestions={oddSoundOutQuestions.slice(8, 9)} />)
  expect(screen.queryByText('Vowels')).not.toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: '/u/' }))
  await user.click(screen.getByRole('button', { name: 'Check answer' }))
  await user.click(screen.getByRole('button', { name: 'View summary' }))
  expect(screen.getByRole('heading', { name: 'Odd Sound Out Summary' })).toBeInTheDocument()
  expect(screen.getByText('Score: 1/1')).toBeInTheDocument()
})

it.each([4, 6, 11])('emphasizes the feature term in question %i', (index) => {
  render(<Activity4OddSoundOut initialQuestions={[oddSoundOutQuestions[index]]} />)
  const term = index === 4 ? 'place of articulation' : index === 6 ? 'manner of articulation' : 'height'
  expect(screen.getByText(term).tagName).toBe('STRONG')
})
