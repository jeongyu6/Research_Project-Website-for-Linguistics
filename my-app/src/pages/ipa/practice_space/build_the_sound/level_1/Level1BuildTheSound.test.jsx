import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import Level1BuildTheSound from './Level1BuildTheSound.jsx'

const testQuestions = [
  { id: 'first', features: ['Voiceless', 'Fricative', 'Dental'], choices: ['f', 'θ', 'ð', 's'], answer: 'θ' },
  { id: 'second', features: ['Voiced', 'Nasal', 'Velar'], choices: ['m', 'n', 'ŋ', 'ɲ'], answer: 'ŋ' },
]

describe('Level1BuildTheSound', () => {
  afterEach(cleanup)

  it('checks a correct answer and advances to the next question', async () => {
    const user = userEvent.setup()
    render(<Level1BuildTheSound initialQuestions={testQuestions} />)

    expect(screen.getByRole('heading', { name: 'Activity 3: Build the Sound' })).toBeInTheDocument()
    expect(screen.getByText('Voiceless')).toBeInTheDocument()
    expect(screen.getByText('Fricative')).toBeInTheDocument()
    expect(screen.getByText('Dental')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '/θ/' }))
    await user.click(screen.getByRole('button', { name: 'Check answer' }))

    expect(screen.getByRole('status')).toHaveTextContent('Correct!')
    expect(screen.getByText('Score: 1/2')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next question' }))
    expect(screen.getByText('Voiced')).toBeInTheDocument()
    expect(screen.getByText('Nasal')).toBeInTheDocument()
    expect(screen.getByText('Velar')).toBeInTheDocument()
  })

  it('reveals the correct symbol after an incorrect answer', async () => {
    const user = userEvent.setup()
    render(<Level1BuildTheSound initialQuestions={testQuestions} />)

    await user.click(screen.getByRole('button', { name: '/f/' }))
    await user.click(screen.getByRole('button', { name: 'Check answer' }))

    expect(screen.getByRole('status')).toHaveTextContent('The correct answer is /θ/.')
    expect(screen.getByText('Score: 0/2')).toBeInTheDocument()
  })

  it('shows a review summary before starting a new session', async () => {
    const user = userEvent.setup()
    render(<Level1BuildTheSound initialQuestions={[testQuestions[0]]} />)

    await user.click(screen.getByRole('button', { name: '/f/' }))
    await user.click(screen.getByRole('button', { name: 'Check answer' }))
    await user.click(screen.getByRole('button', { name: 'View summary' }))

    expect(screen.getByRole('heading', { name: 'Build the Sound Summary' })).toBeInTheDocument()
    expect(screen.getByText('Your answer').nextSibling).toHaveTextContent('/f/')
    expect(screen.getByText('Correct answer').nextSibling).toHaveTextContent('/θ/')
    expect(screen.getByText('0 correct · 1 mistake')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mistakes (1)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start a new session' })).toBeInTheDocument()
  })

  it('filters the summary to mistakes while keeping original question numbers', async () => {
    const user = userEvent.setup()
    render(<Level1BuildTheSound initialQuestions={testQuestions} />)
    await user.click(screen.getByRole('button', { name: '/θ/' }))
    await user.click(screen.getByRole('button', { name: 'Check answer' }))
    await user.click(screen.getByRole('button', { name: 'Next question' }))
    await user.click(screen.getByRole('button', { name: '/m/' }))
    await user.click(screen.getByRole('button', { name: 'Check answer' }))
    await user.click(screen.getByRole('button', { name: 'View summary' }))
    expect(screen.getByText('1 correct · 1 mistake')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Mistakes (1)' }))
    expect(screen.getByText('Question 2')).toBeInTheDocument()
    expect(screen.queryByText('Question 1')).not.toBeInTheDocument()
    expect(screen.getByText('Your answer').nextSibling).toHaveTextContent('/m/')
    await user.click(screen.getByRole('button', { name: 'All answers (2)' }))
    expect(screen.getByText('Question 1')).toBeInTheDocument()
  })

  it('answers question 2 first and preserves it when returning to question 1', async () => {
    const user = userEvent.setup()
    render(<Level1BuildTheSound initialQuestions={testQuestions} />)

    expect(screen.getByRole('button', { name: 'Previous question' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Next question' }))
    await user.click(screen.getByRole('button', { name: '/ŋ/' }))
    await user.click(screen.getByRole('button', { name: 'Check answer' }))
    expect(screen.getByText('Score: 1/2')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Previous question' }))
    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '/θ/' }))
    await user.click(screen.getByRole('button', { name: 'Check answer' }))
    expect(screen.getByText('Score: 2/2')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next question' }))
    expect(screen.getByRole('button', { name: '/ŋ/' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '/ŋ/' })).toBeDisabled()
  })
})
