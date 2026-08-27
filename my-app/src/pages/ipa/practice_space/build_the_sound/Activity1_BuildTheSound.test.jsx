import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import Activity1BuildTheSound from './Activity1_BuildTheSound.jsx'

const testQuestions = [
  { id: 'first', features: ['Voiceless', 'Fricative', 'Dental'], choices: ['f', 'θ', 'ð', 's'], answer: 'θ' },
  { id: 'second', features: ['Voiced', 'Nasal', 'Velar'], choices: ['m', 'n', 'ŋ', 'ɲ'], answer: 'ŋ' },
]

describe('Activity1BuildTheSound', () => {
  afterEach(cleanup)

  it('checks a correct answer and advances to the next question', async () => {
    const user = userEvent.setup()
    render(<Activity1BuildTheSound initialQuestions={testQuestions} />)

    expect(screen.getByRole('heading', { name: 'Activity 1: Build the Sound' })).toBeInTheDocument()
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
    render(<Activity1BuildTheSound initialQuestions={testQuestions} />)

    await user.click(screen.getByRole('button', { name: '/f/' }))
    await user.click(screen.getByRole('button', { name: 'Check answer' }))

    expect(screen.getByRole('status')).toHaveTextContent('The correct answer is /θ/.')
    expect(screen.getByText('Score: 0/2')).toBeInTheDocument()
  })
})
