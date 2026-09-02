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

  it('undoes the most recent vowel placement', async () => {
    const user = userEvent.setup()
    render(<Activity3VowelMapDrop />)
    const undoButton = screen.getByRole('button', { name: 'Undo' })

    expect(undoButton).toBeDisabled()
    await user.click(screen.getByRole('button', { name: '/i/' }))
    await user.click(screen.getByRole('button', { name: 'Vowel chart target 1' }))
    await user.click(screen.getByRole('button', { name: '/u/' }))
    await user.click(screen.getByRole('button', { name: 'Vowel chart target 2' }))

    await user.click(undoButton)

    expect(screen.getByRole('button', { name: 'Vowel chart target 1' })).toHaveTextContent('i')
    expect(screen.getByRole('button', { name: 'Vowel chart target 2' })).not.toHaveTextContent('u')
    expect(screen.getByRole('button', { name: '/u/' })).toBeInTheDocument()
    expect(screen.getByText('Placed 1 of 14')).toBeInTheDocument()
  })

  it('undoes an active vowel selection before changing placements', async () => {
    const user = userEvent.setup()
    render(<Activity3VowelMapDrop />)
    const vowelButton = screen.getByRole('button', { name: '/i/' })
    const undoButton = screen.getByRole('button', { name: 'Undo' })

    await user.click(vowelButton)
    expect(vowelButton).toHaveAttribute('aria-pressed', 'true')
    expect(undoButton).toBeEnabled()

    await user.click(undoButton)

    expect(vowelButton).toHaveAttribute('aria-pressed', 'false')
    expect(undoButton).toBeDisabled()
    expect(screen.getByText('Placed 0 of 14')).toBeInTheDocument()
  })

  it('removes a selected vowel from the chart even when it was not placed last', async () => {
    const user = userEvent.setup()
    render(<Activity3VowelMapDrop />)

    await user.click(screen.getByRole('button', { name: '/i/' }))
    await user.click(screen.getByRole('button', { name: 'Vowel chart target 1' }))
    await user.click(screen.getByRole('button', { name: '/u/' }))
    await user.click(screen.getByRole('button', { name: 'Vowel chart target 2' }))
    await user.click(screen.getByRole('button', { name: 'Vowel chart target 1' }))

    expect(screen.getByRole('button', { name: 'Vowel chart target 1' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'Undo' }))

    expect(screen.getByRole('button', { name: 'Vowel chart target 1' })).not.toHaveTextContent('i')
    expect(screen.getByRole('button', { name: 'Vowel chart target 2' })).toHaveTextContent('u')
    expect(screen.getByRole('button', { name: '/i/' })).toBeInTheDocument()
    expect(screen.getByText('Placed 1 of 14')).toBeInTheDocument()
  })

  it('toggles a placed vowel selection without removing it', async () => {
    const user = userEvent.setup()
    render(<Activity3VowelMapDrop />)
    const target = screen.getByRole('button', { name: 'Vowel chart target 1' })

    await user.click(screen.getByRole('button', { name: '/i/' }))
    await user.click(target)
    await user.click(target)
    expect(target).toHaveAttribute('aria-pressed', 'true')

    await user.click(target)

    expect(target).toHaveAttribute('aria-pressed', 'false')
    expect(target).toHaveTextContent('i')
    expect(screen.getByText('Placed 1 of 14')).toBeInTheDocument()
  })

  it('keeps selected-vowel removal out of later placement undo history', async () => {
    const user = userEvent.setup()
    render(<Activity3VowelMapDrop />)

    for (const [index, symbol] of ['i', 'u', 'æ'].entries()) {
      await user.click(screen.getByRole('button', { name: `/${symbol}/` }))
      await user.click(screen.getByRole('button', { name: `Vowel chart target ${index + 1}` }))
    }

    await user.click(screen.getByRole('button', { name: 'Vowel chart target 1' }))
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    await user.click(screen.getByRole('button', { name: 'Undo' }))

    expect(screen.getByRole('button', { name: 'Vowel chart target 1' })).not.toHaveTextContent('i')
    expect(screen.getByRole('button', { name: 'Vowel chart target 2' })).toHaveTextContent('u')
    expect(screen.getByRole('button', { name: 'Vowel chart target 3' })).not.toHaveTextContent('æ')
    expect(screen.getByRole('button', { name: '/i/' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '/æ/' })).toBeInTheDocument()
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

    await user.click(screen.getByRole('button', { name: 'Vowel chart target 1' }))
    await user.click(screen.getByRole('button', { name: 'Undo' }))

    expect(screen.getByRole('button', { name: '/u/' })).toBeInTheDocument()
    expect(screen.getByText('1 vowel still needs to be placed.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Answer Summary' })).toBeInTheDocument()
  })
})
