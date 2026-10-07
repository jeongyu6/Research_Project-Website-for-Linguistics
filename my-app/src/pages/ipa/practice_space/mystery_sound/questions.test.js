import { expect, it } from 'vitest'
import { oddSoundOutQuestions } from './questions.js'

it('contains the 15 supplied questions in order', () => {
  expect(oddSoundOutQuestions).toHaveLength(15)
  expect(oddSoundOutQuestions.map(({ answer }) => answer)).toEqual(['v', 't', 'z', 'ʃ', 't', 'f', 't', 's', 'u', 'i', 'i', 'ɑ', 'ɛ', 'ɑ', 'u'])
  expect(oddSoundOutQuestions.map(({ category }) => category)).toEqual([...Array(8).fill('Consonants'), ...Array(7).fill('Vowels')])
  for (const question of oddSoundOutQuestions) {
    expect(question.choices).toHaveLength(4)
    expect(question.choices).toContain(question.answer)
    expect(question.explanation).toBeTruthy()
  }
  expect(new Set(oddSoundOutQuestions.map((question) => question.choices.indexOf(question.answer))).size).toBe(4)
})
