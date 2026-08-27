import { describe, expect, it } from 'vitest'
import { createVowelChoices, createVowelDetectiveSession, vowelInventory } from './questions.js'

describe('vowelInventory', () => {
  it('contains the 14 supplied Canadian English vowels', () => {
    expect(vowelInventory).toHaveLength(14)
    expect(new Set(vowelInventory.map((vowel) => vowel.symbol)).size).toBe(14)
  })

  it.each([
    ['i', 'Monophthong', 'High', 'Front', 'Unrounded'],
    ['ɪ', 'Monophthong', 'High', 'Front', 'Unrounded'],
    ['ɛ', 'Monophthong', 'Mid', 'Front', 'Unrounded'],
    ['æ', 'Monophthong', 'Low', 'Front', 'Unrounded'],
    ['ə', 'Monophthong', 'Mid', 'Central', 'Unrounded'],
    ['ʌ', 'Monophthong', 'Mid', 'Central', 'Unrounded'],
    ['u', 'Monophthong', 'High', 'Back', 'Rounded'],
    ['ʊ', 'Monophthong', 'High', 'Back', 'Rounded'],
    ['ɑ', 'Monophthong', 'Low', 'Back', 'Unrounded'],
    ['ej', 'Diphthong', 'Mid-to-high', 'Front', 'Unrounded'],
    ['ow', 'Diphthong', 'Mid-to-high', 'Back', 'Rounded'],
    ['aj', 'Diphthong', 'Low-to-high', 'Central-to-front', 'Unrounded'],
    ['aw', 'Diphthong', 'Low-to-high', 'Central-to-back', 'Unrounded'],
    ['ɔj', 'Diphthong', 'Mid-to-high', 'Back-to-front', 'Rounded-to-unrounded'],
  ])('/%s/ has the supplied vowel features', (symbol, type, height, backness, rounding) => {
    expect(vowelInventory).toContainEqual(expect.objectContaining({ symbol, type, height, backness, rounding }))
  })
})

describe('Vowel Detective question generation', () => {
  it('selects 10 unique questions with four features and four choices', () => {
    const session = createVowelDetectiveSession(vowelInventory, 10, () => 0.5)
    expect(session).toHaveLength(10)
    expect(new Set(session.map((question) => question.id)).size).toBe(10)
    session.forEach((question) => {
      expect(question.features).toHaveLength(4)
      expect(question.choices).toHaveLength(4)
      expect(new Set(question.choices).size).toBe(4)
      expect(question.choices).toContain(question.answer)
    })
  })

  it.each(vowelInventory)('keeps /$symbol/ as an answer choice', (vowel) => {
    expect(createVowelChoices(vowel, vowelInventory, () => 0.25)).toContain(vowel.symbol)
  })
})
