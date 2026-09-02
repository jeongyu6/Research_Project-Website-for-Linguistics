import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import Activity2MysterySound from './Activity2_MysterySound.jsx'

const mysterySound = {
  id: 'v-van', symbol: 'v', exampleWord: 'van', voicing: 'Voiced', manner: 'Fricative', place: 'Labiodental',
}
const mysteryChoices = ['v', 'f', 'p', 't']
const clueOrder = ['voicing', 'manner', 'place']

describe('Activity2MysterySound', () => {
  afterEach(cleanup)

  it('renders the Mystery Sound activity', () => {
    render(<Activity2MysterySound initialSound={mysterySound} initialChoices={mysteryChoices} initialClueOrder={clueOrder} />)
    expect(screen.getByRole('heading', { name: 'Activity 2: Mystery Sound' })).toBeInTheDocument()
    expect(screen.getByText('I am voiced.')).toBeInTheDocument()
    expect(screen.queryByText('I am fricative.')).not.toBeInTheDocument()
    expect(screen.getByText('300 points available')).toBeInTheDocument()
  })

  it('reveals clues one at a time and reduces the available points', async () => {
    const user = userEvent.setup()
    render(<Activity2MysterySound initialSound={mysterySound} initialChoices={mysteryChoices} initialClueOrder={clueOrder} />)

    await user.click(screen.getByRole('button', { name: 'Reveal another clue' }))
    expect(screen.getByText('I am fricative.')).toBeInTheDocument()
    expect(screen.getByText('200 points available')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reveal another clue' }))
    expect(screen.getByText('I am labiodental.')).toBeInTheDocument()
    expect(screen.getByText('100 points available')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Reveal another clue' })).not.toBeInTheDocument()
  })

  it('awards 300 points for a correct guess after the first clue', async () => {
    const user = userEvent.setup()
    render(<Activity2MysterySound initialSound={mysterySound} initialChoices={mysteryChoices} initialClueOrder={clueOrder} />)

    await user.click(screen.getByRole('button', { name: '/v/' }))
    await user.click(screen.getByRole('button', { name: 'Submit guess' }))

    expect(screen.getByRole('status')).toHaveTextContent('You earned 300 points.')
    expect(screen.getByText('Round 1 · Score 300')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next mystery' })).toBeInTheDocument()
  })

  it('reveals the next clue after an incorrect guess and awards 200 points', async () => {
    const user = userEvent.setup()
    render(<Activity2MysterySound initialSound={mysterySound} initialChoices={mysteryChoices} initialClueOrder={clueOrder} />)

    await user.click(screen.getByRole('button', { name: '/f/' }))
    await user.click(screen.getByRole('button', { name: 'Submit guess' }))

    expect(screen.getByRole('status')).toHaveTextContent('Here is another clue')
    expect(screen.getByText('I am fricative.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '/f/' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: '/v/' }))
    await user.click(screen.getByRole('button', { name: 'Submit guess' }))
    expect(screen.getByRole('status')).toHaveTextContent('You earned 200 points.')
  })

  it('skips a mystery, reveals the answer, and awards no points', async () => {
    const user = userEvent.setup()
    render(<Activity2MysterySound initialSound={mysterySound} initialChoices={mysteryChoices} initialClueOrder={clueOrder} />)

    await user.click(screen.getByRole('button', { name: 'Skip' }))

    expect(screen.getByRole('status')).toHaveTextContent('Skipped. The mystery sound was /v/.')
    expect(screen.getByText('Round 1 · Score 0')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '/v/' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next mystery' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Submit guess' })).not.toBeInTheDocument()
  })
})
