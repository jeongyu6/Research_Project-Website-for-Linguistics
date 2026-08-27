import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Activity2MysterySound from './Activity2_MysterySound.jsx'

describe('Activity2MysterySound', () => {
  afterEach(cleanup)

  it('renders the Mystery Sound activity', () => {
    render(<Activity2MysterySound />)
    expect(screen.getByRole('heading', { name: 'Mystery Sound' })).toBeInTheDocument()
  })
})
