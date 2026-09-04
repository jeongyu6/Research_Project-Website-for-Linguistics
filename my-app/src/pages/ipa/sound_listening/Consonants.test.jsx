import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import Consonants from './Consonants.jsx'

describe('Consonants', () => {
  afterEach(cleanup)

  it('shows the selected consonant description and underlines its spelling', async () => {
    const user = userEvent.setup()
    render(<Consonants />)

    await user.click(screen.getByRole('button', { name: 'p, Oral Stop, Bilabial, play recording' }))

    expect(screen.getByText('Voiceless bilabial plosive')).toBeInTheDocument()
    expect(screen.getByText('p', { selector: '.sound-example-letters' })).toHaveClass('sound-example-letters')
    expect(screen.getByText('p', { selector: '.sound-example-letters' }).parentElement).toHaveTextContent('pat')
  })

  it('underlines the digraph for a consonant represented by two letters', async () => {
    const user = userEvent.setup()
    render(<Consonants />)

    await user.click(screen.getByRole('button', { name: 'θ, Fricative, Interdental, play recording' }))

    expect(screen.getByText('Voiceless dental fricative')).toBeInTheDocument()
    expect(screen.getByText('th', { selector: '.sound-example-letters' })).toHaveClass('sound-example-letters')
  })
})
