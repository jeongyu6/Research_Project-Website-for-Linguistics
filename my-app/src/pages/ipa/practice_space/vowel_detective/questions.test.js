import { expect, it } from 'vitest'
import { findTheSoundQuestions } from './questions.js'

it('contains all 15 word questions in the supplied order', () => {
  expect(findTheSoundQuestions).toHaveLength(15)
  expect(findTheSoundQuestions.map(({ symbol }) => symbol)).toEqual(['i', 'ɪ', 'ɛ', 'æ', 'ɑ', 'ʌ', 'ʊ', 'u', 'ej', 'aj', 'ow', 'aw', 'ɔj', 'ɔ', 'ə'])
  expect(findTheSoundQuestions.map(({ answer }) => answer)).toEqual(['see', 'fish', 'fed', 'map', 'hot', 'luck', 'look', 'moon', 'pray', 'five', 'goat', 'cloud', 'toy', 'short', 'about'])
  for (const question of findTheSoundQuestions) {
    expect(question.choices).toHaveLength(4)
    expect(question.choices).toContain(question.answer)
  }
  expect(findTheSoundQuestions[13].choices).toEqual(['feet', 'short', 'map', 'book'])
})
