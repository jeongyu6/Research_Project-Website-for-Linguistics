import { describe, expect, it } from 'vitest'
import { createMysteryChoices, createMysteryClues, mysterySoundInventory } from './questions.js'

describe('Mystery Sound question generation', () => {
  it('creates clues from voicing, manner, and place', () => {
    expect(createMysteryClues({ voicing: 'Voiced', manner: 'Fricative', place: 'Labiodental' })).toEqual([
      'I am voiced.',
      'I am fricative.',
      'I am labiodental.',
    ])
  })

  it('shuffles every consonant into the answer selections', () => {
    const databaseOrder = mysterySoundInventory.map(({ symbol }) => symbol)
    const choices = createMysteryChoices(mysterySoundInventory, () => 0)

    expect(choices).toHaveLength(databaseOrder.length)
    expect(new Set(choices)).toEqual(new Set(databaseOrder))
    expect(choices).not.toEqual(databaseOrder)
  })
})
