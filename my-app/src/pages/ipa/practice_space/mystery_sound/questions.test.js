import { describe, expect, it } from 'vitest'
import { createMysteryChoices, createMysteryClueOrder, createMysteryClues, mysterySoundInventory } from './questions.js'

describe('Mystery Sound question generation', () => {
  it('creates clues from voicing, manner, and place', () => {
    expect(createMysteryClues({ voicing: 'Voiced', manner: 'Fricative', place: 'Labiodental' })).toEqual([
      'I am voiced.',
      'I am fricative.',
      'I am labiodental.',
    ])
  })

  it('randomizes the clue feature order without losing a feature', () => {
    const order = createMysteryClueOrder(() => 0)

    expect(order).toHaveLength(3)
    expect(new Set(order)).toEqual(new Set(['voicing', 'manner', 'place']))
    expect(order).not.toEqual(['voicing', 'manner', 'place'])
  })

  it('creates progressively eliminated distractors for each clue', () => {
    const answer = mysterySoundInventory.find(({ symbol }) => symbol === 'v')
    const choices = createMysteryChoices(answer, ['voicing', 'manner', 'place'], mysterySoundInventory, () => 0)
    const distractors = choices
      .filter((symbol) => symbol !== answer.symbol)
      .map((symbol) => mysterySoundInventory.find((sound) => sound.symbol === symbol))

    expect(choices).toHaveLength(4)
    expect(new Set(choices).size).toBe(4)
    expect(choices).toContain('v')
    expect(distractors).toContainEqual(expect.objectContaining({ voicing: 'Voiceless' }))
    expect(distractors).toContainEqual(expect.objectContaining({ voicing: 'Voiced', manner: expect.not.stringMatching(/^Fricative$/) }))
    expect(distractors).toContainEqual(expect.objectContaining({ voicing: 'Voiced', manner: 'Fricative', place: expect.not.stringMatching(/^Labiodental$/) }))
  })

  it('still creates four valid choices when the answer has a unique manner and voicing combination', () => {
    const answer = mysterySoundInventory.find(({ symbol }) => symbol === 'dʒ')
    const choices = createMysteryChoices(answer, ['voicing', 'manner', 'place'], mysterySoundInventory, () => 0)

    expect(choices).toHaveLength(4)
    expect(new Set(choices).size).toBe(4)
    expect(choices).toContain(answer.symbol)
    choices.forEach((symbol) => expect(mysterySoundInventory.some((sound) => sound.symbol === symbol)).toBe(true))
  })
})
