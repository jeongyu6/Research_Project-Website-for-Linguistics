import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Activity3VowelMapDrop from './Activity3_VowelMapDrop.jsx'

describe('Activity3VowelMapDrop', () => {
  afterEach(cleanup)

  it('renders the Vowel Map Drop activity', () => {
    render(<Activity3VowelMapDrop />)
    expect(screen.getByRole('heading', { name: 'Vowel Map Drop' })).toBeInTheDocument()
  })
})
