import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import Activity3VowelMapDrop from './Activity3_VowelMapDrop.jsx'

describe('Activity3VowelMapDrop', () => {
  afterEach(cleanup)

  it('renders the Vowel Map Drop activity', () => {
    render(<Activity3VowelMapDrop />)
    expect(screen.getByRole('heading', { name: 'Activity 3: Vowel Map Drop' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Vowel chart target/ })).toHaveLength(14)
    ;['/i/', '/ɪ/', '/ʊ/', '/u/', '/ej/', '/ɛ/', '/ə/', '/ow/', '/ʌ/', '/ɔj/', '/æ/', '/aj/', '/aw/', '/ɑ/']
      .forEach((symbol) => expect(screen.getByRole('button', { name: symbol })).toBeInTheDocument())
  })

  it('places a selected vowel without grading it immediately', async () => {
    const user = userEvent.setup()
    render(<Activity3VowelMapDrop />)

    await user.click(screen.getByRole('button', { name: '/i/' }))
    await user.click(screen.getByRole('button', { name: 'Vowel chart target 1' }))

    expect(screen.getByRole('button', { name: 'Vowel chart target 1' })).toHaveTextContent('i')
    expect(screen.queryByRole('button', { name: '/i/' })).not.toBeInTheDocument()
    expect(screen.getByText('Placed 1 of 14')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Check My Answer' })).toBeDisabled()
  })

  it('allows a vowel to be placed in an incorrect position before checking', async () => {
    const user = userEvent.setup()
    render(<Activity3VowelMapDrop />)

    await user.click(screen.getByRole('button', { name: '/u/' }))
    await user.click(screen.getByRole('button', { name: 'Vowel chart target 1' }))

    expect(screen.getByRole('button', { name: 'Vowel chart target 1' })).toHaveTextContent('u')
    expect(screen.getByText('Placed 1 of 14')).toBeInTheDocument()
  })

  it('marks mistakes and summarizes their correct locations after checking', async () => {
    const user = userEvent.setup()
    render(<Activity3VowelMapDrop />)
    const placements = ['u', 'ɪ', 'ʊ', 'i', 'ej', 'ɛ', 'ə', 'ow', 'ʌ', 'ɔj', 'æ', 'aj', 'aw', 'ɑ']

    for (const [index, symbol] of placements.entries()) {
      await user.click(screen.getByRole('button', { name: `/${symbol}/` }))
      await user.click(screen.getByRole('button', { name: `Vowel chart target ${index + 1}` }))
    }

    await user.click(screen.getByRole('button', { name: 'Check My Answer' }))

    expect(screen.getByRole('heading', { name: 'Answer Summary' })).toBeInTheDocument()
    expect(screen.getByText('2 vowels were placed incorrectly. Review the correct locations:')).toBeInTheDocument()
    expect(screen.getByText((_, element) => element.tagName === 'LI' && element.textContent.includes('/u/ → High + Back'))).toBeInTheDocument()
    expect(screen.getByText((_, element) => element.tagName === 'LI' && element.textContent.includes('/i/ → High + Front'))).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })
})
