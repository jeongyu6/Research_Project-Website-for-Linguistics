export function shuffleQuestionChoices(questions) {
  return questions.map((question) => {
    const choices = [...question.choices]
    for (let index = choices.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1))
      ;[choices[index], choices[randomIndex]] = [choices[randomIndex], choices[index]]
    }
    return { ...question, choices }
  })
}

