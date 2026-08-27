import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import PracticeSpace from './PracticeSpace.jsx'

describe('PracticeSpace', () => {
  afterEach(cleanup)

  it('renders four activity tabs with the first selected', () => {
    render(<PracticeSpace />)

    expect(screen.getByRole('heading', { name: 'Practice Space' })).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(4)
    expect(screen.getByRole('tab', { name: 'Activity #1: Build the Sound' })).toHaveAttribute('aria-selected', 'true')
  })

  it('switches between activity sections', async () => {
    const user = userEvent.setup()
    render(<PracticeSpace />)

    await user.click(screen.getByRole('tab', { name: 'Activity #3: Vowel Map Drop' }))

    expect(screen.getByRole('tabpanel', { name: 'Activity #3: Vowel Map Drop' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Activity 3: Vowel Map Drop' })).toBeInTheDocument()
  })
})
