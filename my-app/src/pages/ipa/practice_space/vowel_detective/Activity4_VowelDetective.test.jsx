import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import Activity4VowelDetective from './Activity4_VowelDetective.jsx'

describe('Activity4VowelDetective', () => {
  afterEach(cleanup)

  it('renders the Vowel Detective activity', () => {
    render(<Activity4VowelDetective />)
    expect(screen.getByRole('heading', { name: 'Activity 4: Vowel Detective' })).toBeInTheDocument()
  })

  it('checks an answer and displays the score', async () => {
    const user = userEvent.setup()
    const questions = [
      { id: 'test-vowel', features: ['Monophthong', 'High', 'Front', 'Unrounded'], choices: ['i', 'u', 'æ', 'ɑ'], answer: 'i' },
    ]
    render(<Activity4VowelDetective initialQuestions={questions} />)

    await user.click(screen.getByRole('button', { name: '/i/' }))
    await user.click(screen.getByRole('button', { name: 'Check answer' }))

    expect(screen.getByRole('status')).toHaveTextContent('Correct!')
    expect(screen.getByText('Score: 1/1')).toBeInTheDocument()
  })

  it('shows all answers in a summary before restart', async () => {
    const user = userEvent.setup()
    const questions = [
      { id: 'test-vowel', exampleWord: 'beat', features: ['Monophthong', 'High', 'Front', 'Unrounded'], choices: ['i', 'u', 'æ', 'ɑ'], answer: 'i' },
    ]
    render(<Activity4VowelDetective initialQuestions={questions} />)

    await user.click(screen.getByRole('button', { name: '/u/' }))
    await user.click(screen.getByRole('button', { name: 'Check answer' }))
    await user.click(screen.getByRole('button', { name: 'View summary' }))

    expect(screen.getByRole('heading', { name: 'Vowel Detective Summary' })).toBeInTheDocument()
    expect(screen.getByText('Your answer').nextSibling).toHaveTextContent('/u/')
    expect(screen.getByText('Correct answer').nextSibling).toHaveTextContent('/i/')
    expect(screen.getByText('beat')).toBeInTheDocument()
  })
})
