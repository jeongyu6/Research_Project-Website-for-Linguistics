import { useState } from 'react'
import QuizSummary from '../QuizSummary.jsx'
import { consonantInventory, createQuestionSession } from './questions.js'

export default function Activity1BuildTheSound({ initialQuestions }) {
  const startQuestionSession = () => initialQuestions ?? createQuestionSession(consonantInventory, 10)
  const [questions, setQuestions] = useState(startQuestionSession)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [responses, setResponses] = useState([])
  const [showSummary, setShowSummary] = useState(false)
  const question = questions[questionIndex]
  const isCorrect = selectedAnswer === question.answer
  const isLastQuestion = questionIndex === questions.length - 1

  function checkAnswer() {
    if (!selectedAnswer || isChecked) return
    setIsChecked(true)
    if (isCorrect) setScore((currentScore) => currentScore + 1)
    setResponses((currentResponses) => [
      ...currentResponses,
      { id: question.id, features: question.features, exampleWord: question.exampleWord, selectedAnswer, correctAnswer: question.answer, isCorrect },
    ])
  }

  function advanceActivity() {
    if (isLastQuestion) {
      setShowSummary(true)
      return
    }
    setQuestionIndex((currentIndex) => currentIndex + 1)
    setSelectedAnswer('')
    setIsChecked(false)
  }

  function restartActivity() {
    setQuestions(startQuestionSession())
    setQuestionIndex(0)
    setSelectedAnswer('')
    setIsChecked(false)
    setScore(0)
    setResponses([])
    setShowSummary(false)
  }

  if (showSummary) {
    return <QuizSummary activityNumber="1" title="Build the Sound" score={score} total={questions.length} responses={responses} onRestart={restartActivity} />
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
                onClick={() => !isChecked && setSelectedAnswer(choice)}
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

        <div className="sound-activity-actions">
          <span>Score: {score}/{questions.length}</span>
          {isChecked ? (
            <button type="button" onClick={advanceActivity}>{isLastQuestion ? 'View summary' : 'Next question'}</button>
          ) : (
            <button type="button" onClick={checkAnswer} disabled={!selectedAnswer}>Check answer</button>
          )}
        </div>
      </div>
    </section>
  )
}
