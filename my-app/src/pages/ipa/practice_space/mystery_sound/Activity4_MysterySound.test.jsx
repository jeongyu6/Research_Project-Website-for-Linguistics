import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it } from 'vitest'
import Activity4OddSoundOut from './Activity4_MysterySound.jsx'
import { oddSoundOutQuestions } from './questions.js'

afterEach(cleanup)

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
