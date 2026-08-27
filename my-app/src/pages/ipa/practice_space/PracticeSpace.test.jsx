import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import PracticeSpace from './PracticeSpace.jsx'

describe('PracticeSpace', () => {
  afterEach(cleanup)

  it('renders a labelled writing area', () => {
    render(<PracticeSpace />)

    expect(screen.getByRole('heading', { name: 'Practice Space' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Practice space editor' })).toBeInTheDocument()
  })
})
