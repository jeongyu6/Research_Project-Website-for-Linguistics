import { describe, expect, it } from 'vitest'
import { createVowelChoices, createVowelDetectiveSession, vowelInventory } from './questions.js'

describe('vowelInventory', () => {
  it('contains the 14 supplied Canadian English vowels', () => {
    expect(vowelInventory).toHaveLength(14)
    expect(new Set(vowelInventory.map((vowel) => vowel.symbol)).size).toBe(14)
  })

  it.each([
    ['i', 'beat', 'Monophthong', 'High', 'Front', 'Unrounded'],
    ['ɪ', 'bit', 'Monophthong', 'High', 'Front', 'Unrounded'],
    ['ɛ', 'bet', 'Monophthong', 'Mid', 'Front', 'Unrounded'],
    ['æ', 'bat', 'Monophthong', 'Low', 'Front', 'Unrounded'],
    ['ə', 'sofa, purr', 'Monophthong', 'Mid', 'Central', 'Unrounded'],
    ['ʌ', 'putt', 'Monophthong', 'Mid', 'Central', 'Unrounded'],
    ['u', 'boot', 'Monophthong', 'High', 'Back', 'Rounded'],
    ['ʊ', 'put', 'Monophthong', 'High', 'Back', 'Rounded'],
    ['ɑ', 'pot, father, bought', 'Monophthong', 'Low', 'Back', 'Unrounded'],
    ['ej', 'bait', 'Diphthong', 'Mid-to-high', 'Front', 'Unrounded'],
    ['ow', 'boat', 'Diphthong', 'Mid-to-high', 'Back', 'Rounded'],
    ['aj', 'my', 'Diphthong', 'Low-to-high', 'Central-to-front', 'Unrounded'],
    ['aw', 'cow', 'Diphthong', 'Low-to-high', 'Central-to-back', 'Unrounded'],
    ['ɔj', 'boy', 'Diphthong', 'Mid-to-high', 'Back-to-front', 'Rounded-to-unrounded'],
  ])('/%s/ matches the supplied vowel answer key', (symbol, exampleWord, type, height, backness, rounding) => {
    expect(vowelInventory).toContainEqual(expect.objectContaining({ symbol, exampleWord, type, height, backness, rounding }))
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
