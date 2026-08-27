import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Activity4VowelDetective from './Activity4_VowelDetective.jsx'

describe('Activity4VowelDetective', () => {
  afterEach(cleanup)

  it('renders the Vowel Detective activity', () => {
    render(<Activity4VowelDetective />)
    expect(screen.getByRole('heading', { name: 'Vowel Detective' })).toBeInTheDocument()
  })
})
