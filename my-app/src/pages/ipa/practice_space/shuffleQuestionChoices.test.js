import { expect, it, vi } from 'vitest'
import { shuffleQuestionChoices } from './shuffleQuestionChoices.js'
import { buildTheSoundQuestions } from './build_the_sound/level_1/buildTheSoundQuestions.js'
import { oddSoundOutQuestions } from './mystery_sound/questions.js'
import { findTheSoundQuestions } from './vowel_detective/questions.js'

it.each([[buildTheSoundQuestions], [oddSoundOutQuestions], [findTheSoundQuestions]])('shuffles a question bank without changing answers or the source bank', (questions) => {
  const original = structuredClone(questions)
  const random = vi.spyOn(Math, 'random').mockReturnValue(0)
  try {
    const shuffled = shuffleQuestionChoices(questions)
    shuffled.forEach((question, index) => {
      expect(question).toEqual({ ...questions[index], choices: expect.arrayContaining(questions[index].choices) })
      expect(question.choices).toHaveLength(questions[index].choices.length)
      expect(question.choices).not.toEqual(questions[index].choices)
      expect(question.choices).toContain(question.answer)
    })
    expect(questions).toEqual(original)
  } finally {
    random.mockRestore()
  }
})
