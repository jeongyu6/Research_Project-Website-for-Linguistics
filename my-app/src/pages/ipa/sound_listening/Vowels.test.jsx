import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import Vowels from './Vowels.jsx'

describe('Vowels', () => {
  afterEach(cleanup)

  it('shows the selected vowel description with its recording', async () => {
    const user = userEvent.setup()
    render(<Vowels />)

    await user.click(screen.getByRole('button', { name: 'IPA vowel æ, play recording' }))

    expect(screen.getByText('Low front unrounded monophthong')).toBeInTheDocument()
    expect(screen.getByText('a')).toHaveClass('sound-example-letters')
    expect(screen.getByText('a').parentElement).toHaveTextContent('bat')
  })

  it('updates the description when another vowel is selected', async () => {
    const user = userEvent.setup()
    render(<Vowels />)

    await user.click(screen.getByRole('button', { name: 'IPA vowel ej, play recording' }))

    expect(screen.getByText('Mid-to-high front unrounded diphthong')).toBeInTheDocument()
    expect(screen.getByText('ai')).toHaveClass('sound-example-letters')
    expect(screen.getByText('ai').parentElement).toHaveTextContent('bait')
  })

  it('underlines only the second e in teacher for the schwa', async () => {
    const user = userEvent.setup()
    render(<Vowels />)

    await user.click(screen.getByRole('button', { name: 'IPA vowel ə, play recording' }))

    const underlinedLetters = screen.getByText('e', { selector: '.sound-example-letters' })
    expect(underlinedLetters).toHaveTextContent('e')
    expect(underlinedLetters.nextSibling.textContent).toBe('r')
    expect(underlinedLetters.parentElement).toHaveTextContent('teacher')
  })
})
