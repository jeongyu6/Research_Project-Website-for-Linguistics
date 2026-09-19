import { expect, it } from 'vitest'
import { buildTheSoundQuestions } from './buildTheSoundQuestions.js'

it('uses the full test bank in order with the supplied choices and answers', () => {
  expect(buildTheSoundQuestions).toHaveLength(20)
  expect(buildTheSoundQuestions.map(({ category }) => category)).toEqual([
    ...Array(10).fill('Consonants'), ...Array(10).fill('Vowels'),
  ])
  expect(buildTheSoundQuestions.map(({ answer }) => answer)).toEqual([
    'ɡ', 'p', 'd', 'f', 'v', 'θ', 'ð', 's', 'z', 'ʃ',
    'i', 'u', 'ɪ', 'ʊ', 'ɛ', 'æ', 'ɑ', 'ə', 'ɔ', 'ʌ',
  ])
  for (const question of buildTheSoundQuestions) {
    expect(question.features).toHaveLength(3)
    expect(question.choices).toHaveLength(4)
    expect(new Set(question.choices).size).toBe(4)
    expect(question.choices).toContain(question.answer)
  }
  expect(buildTheSoundQuestions[0]).toMatchObject({
    features: ['Voiced', 'Plosive', 'Velar'], choices: ['k', 'd', 'b', 'ɡ'], answer: 'ɡ',
  })
  expect(buildTheSoundQuestions[19]).toMatchObject({
    features: ['Low', 'Central', 'Unrounded'], choices: ['i', 'ʌ', 'æ', 'u'], answer: 'ʌ',
  })
})
