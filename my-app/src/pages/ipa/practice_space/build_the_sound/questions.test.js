import { describe, expect, it } from 'vitest'
import { consonantInventory, createAnswerChoices, createQuestionSession, shuffleItems } from './questions.js'

describe('consonantInventory', () => {
  it('contains 24 unique and complete consonant records', () => {
    expect(consonantInventory).toHaveLength(24)
    expect(new Set(consonantInventory.map((sound) => sound.id)).size).toBe(24)
    expect(new Set(consonantInventory.map((sound) => sound.symbol)).size).toBe(24)

    consonantInventory.forEach((sound) => {
      expect(sound.exampleWord).toBeTruthy()
      expect(sound.voicing).toBeTruthy()
      expect(sound.manner).toBeTruthy()
      expect(sound.place).toBeTruthy()
    })
  })

  it.each([
    ['Voiceless', 'Plosive', 'Bilabial', 'p'],
    ['Voiced', 'Plosive', 'Bilabial', 'b'],
    ['Voiced', 'Nasal', 'Bilabial', 'm'],
    ['Voiceless', 'Fricative', 'Labiodental', 'f'],
    ['Voiced', 'Fricative', 'Labiodental', 'v'],
    ['Voiceless', 'Fricative', 'Dental', 'θ'],
    ['Voiced', 'Fricative', 'Dental', 'ð'],
    ['Voiceless', 'Plosive', 'Alveolar', 't'],
    ['Voiced', 'Plosive', 'Alveolar', 'd'],
    ['Voiced', 'Nasal', 'Alveolar', 'n'],
    ['Voiceless', 'Fricative', 'Alveolar', 's'],
    ['Voiced', 'Fricative', 'Alveolar', 'z'],
    ['Voiced', 'Lateral approximant', 'Alveolar', 'l'],
    ['Voiced', 'Rhotic approximant', 'Retroflex', 'ɹ'],
    ['Voiceless', 'Fricative', 'Postalveolar', 'ʃ'],
    ['Voiced', 'Fricative', 'Postalveolar', 'ʒ'],
    ['Voiceless', 'Affricate', 'Postalveolar', 'tʃ'],
    ['Voiced', 'Affricate', 'Postalveolar', 'dʒ'],
    ['Voiced', 'Glide approximant', 'Palatal', 'j'],
    ['Voiceless', 'Plosive', 'Velar', 'k'],
    ['Voiced', 'Plosive', 'Velar', 'ɡ'],
    ['Voiced', 'Nasal', 'Velar', 'ŋ'],
    ['Voiced', 'Glide approximant', 'Labial-velar', 'w'],
    ['Voiceless', 'Fricative', 'Glottal', 'h'],
  ])('%s + %s + %s points to /%s/', (voicing, manner, place, expectedSymbol) => {
    const matchingSounds = consonantInventory.filter((sound) => (
      sound.voicing === voicing
      && sound.manner === manner
      && sound.place === place
    ))

    expect(matchingSounds).toHaveLength(1)
    expect(matchingSounds[0].symbol).toBe(expectedSymbol)
  })
})

describe('createAnswerChoices', () => {
  it('creates four unique choices containing the correct answer', () => {
    const answer = consonantInventory.find((sound) => sound.symbol === 'θ')
    const choices = createAnswerChoices(answer, consonantInventory, () => 0.5)

    expect(choices).toHaveLength(4)
    expect(new Set(choices).size).toBe(4)
    expect(choices).toContain('θ')
  })

  it('uses similar consonants as plausible distractors', () => {
    const answer = consonantInventory.find((sound) => sound.symbol === 'θ')
    const choices = createAnswerChoices(answer, consonantInventory, () => 0.5)

    expect(choices).toEqual(expect.arrayContaining(['θ', 'ð']))
  })

  it.each(consonantInventory)('keeps /$symbol/ as the answer for $exampleWord', (sound) => {
    const choices = createAnswerChoices(sound, consonantInventory, () => 0.25)

    expect(choices).toHaveLength(4)
    expect(new Set(choices).size).toBe(4)
    expect(choices).toContain(sound.symbol)
  })
})

describe('createQuestionSession', () => {
  it('generates 10 unique questions from the 24-sound inventory', () => {
    const questions = createQuestionSession(consonantInventory, 10, () => 0.5)

    expect(questions).toHaveLength(10)
    expect(new Set(questions.map((question) => question.id)).size).toBe(10)
    questions.forEach((question) => {
      expect(question.features).toHaveLength(3)
      expect(question.choices).toHaveLength(4)
      expect(question.choices).toContain(question.answer)
    })
  })
})

describe('shuffleItems', () => {
  it('shuffles a copy without mutating the original list', () => {
    const original = ['f', 'θ', 'ð', 's']
    const shuffled = shuffleItems(original, () => 0)

    expect(shuffled).not.toEqual(original)
    expect(shuffled).toEqual(expect.arrayContaining(original))
    expect(original).toEqual(['f', 'θ', 'ð', 's'])
  })
})
