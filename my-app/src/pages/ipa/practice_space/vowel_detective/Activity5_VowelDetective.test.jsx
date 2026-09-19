import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it } from 'vitest'
import Activity5FindTheSound from './Activity5_VowelDetective.jsx'
import { findTheSoundQuestions } from './questions.js'

afterEach(cleanup)

it('shows the new heading, vowel prompt, and word choices', () => {
  render(<Activity5FindTheSound />)
  expect(screen.getByRole('heading', { name: 'Activity 5: Find the Sound' })).toBeInTheDocument()
  expect(screen.getByText('Question 1 of 15')).toBeInTheDocument()
  expect(screen.getByText('Which word contains', { exact: false })).toHaveTextContent('/i/')
  expect(screen.getByRole('button', { name: 'A. see' })).toBeInTheDocument()
})

it('checks a word answer and shows it in the summary', async () => {
  const user = userEvent.setup()
  render(<Activity5FindTheSound initialQuestions={findTheSoundQuestions.slice(0, 1)} />)
  await user.click(screen.getByRole('button', { name: 'B. cat' }))
  await user.click(screen.getByRole('button', { name: 'Check answer' }))
  expect(screen.getByRole('status')).toHaveTextContent('The correct word is see.')
  await user.click(screen.getByRole('button', { name: 'View summary' }))
  expect(screen.getByRole('heading', { name: 'Find the Sound Summary' })).toBeInTheDocument()
  expect(screen.getByText('Your answer').nextSibling).toHaveTextContent('cat')
  expect(screen.getByText('Correct answer').nextSibling).toHaveTextContent('see')
})
