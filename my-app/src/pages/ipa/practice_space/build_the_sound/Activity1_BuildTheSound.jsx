import { useState } from 'react'
import QuizSummary from '../QuizSummary.jsx'
import { consonantInventory, createQuestionSession } from './questions.js'

export default function Activity1BuildTheSound({ initialQuestions }) {
  const startQuestionSession = () => initialQuestions ?? createQuestionSession(consonantInventory, 10)
  const [questions, setQuestions] = useState(startQuestionSession)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [responses, setResponses] = useState({})
  const [showSummary, setShowSummary] = useState(false)
  const question = questions[questionIndex]
  const selectedAnswer = selectedAnswers[question.id] ?? ''
  const response = responses[question.id]
  const isChecked = Boolean(response)
  const isCorrect = response?.isCorrect ?? selectedAnswer === question.answer
  const score = Object.values(responses).filter(({ isCorrect: answerIsCorrect }) => answerIsCorrect).length
  const allQuestionsAnswered = Object.keys(responses).length === questions.length

  function checkAnswer() {
    if (!selectedAnswer || isChecked) return
    setResponses((currentResponses) => ({
      ...currentResponses,
      [question.id]: { id: question.id, features: question.features, exampleWord: question.exampleWord, selectedAnswer, correctAnswer: question.answer, isCorrect },
    }))
  }

  function restartActivity() {
    setQuestions(startQuestionSession())
    setQuestionIndex(0)
    setSelectedAnswers({})
    setResponses({})
    setShowSummary(false)
  }

  if (showSummary) {
    return <QuizSummary activityNumber="1" title="Build the Sound" score={score} total={questions.length} responses={questions.map(({ id }) => responses[id])} onRestart={restartActivity} />
  }

  return (
    <section aria-label="Activity 1: Build the Sound">
      <div className="sound-activity">
        <div className="sound-activity-header">
          <h3>Activity 1: Build the Sound</h3>
          <span className="sound-activity-progress">
            Question {questionIndex + 1} of {questions.length}
          </span>
        </div>

        <p className="sound-activity-instruction">Which IPA symbol matches all three features?</p>
        <div className="sound-feature-list" aria-label="Phonetic features">
          {question.features.map((feature) => <span key={feature}>{feature}</span>)}
        </div>

        <div className="sound-choice-list" role="group" aria-label="Choose an IPA symbol">
          {question.choices.map((choice) => {
            const choiceIsCorrect = isChecked && choice === question.answer
            const choiceIsIncorrect = isChecked && choice === selectedAnswer && !isCorrect
            return (
              <button
                type="button"
                className={`sound-choice${selectedAnswer === choice ? ' sound-choice-selected' : ''}${choiceIsCorrect ? ' sound-choice-correct' : ''}${choiceIsIncorrect ? ' sound-choice-incorrect' : ''}`}
                key={choice}
                onClick={() => !isChecked && setSelectedAnswers((answers) => ({ ...answers, [question.id]: choice }))}
                aria-pressed={selectedAnswer === choice}
                disabled={isChecked}
              >
                /{choice}/
              </button>
            )
          })}
        </div>

        {isChecked && (
          <p className={`sound-feedback ${isCorrect ? 'sound-feedback-correct' : 'sound-feedback-incorrect'}`} role="status">
            {isCorrect
              ? `Correct! /${question.answer}/ matches all three features.`
              : `Not quite. The correct answer is /${question.answer}/.`}
          </p>
        )}

        <div className="question-navigation" aria-label="Question navigation">
          <button type="button" aria-label="Previous question" onClick={() => setQuestionIndex((index) => index - 1)} disabled={questionIndex === 0}>‹ Previous</button>
          <button type="button" aria-label="Next question" onClick={() => setQuestionIndex((index) => index + 1)} disabled={questionIndex === questions.length - 1}>Next ›</button>
        </div>

        <div className="sound-activity-actions">
          <span>Score: {score}/{questions.length}</span>
          {allQuestionsAnswered
            ? <button type="button" onClick={() => setShowSummary(true)}>View summary</button>
            : !isChecked && <button type="button" onClick={checkAnswer} disabled={!selectedAnswer}>Check answer</button>}
        </div>
      </div>
    </section>
  )
}
