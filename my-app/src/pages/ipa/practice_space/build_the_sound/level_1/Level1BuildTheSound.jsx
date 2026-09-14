import useLevelTime from '../useLevelTime.js'
import QuestionTimer from '../../QuestionTimer.jsx'
import { useState } from 'react'
import QuizSummary from '../../QuizSummary.jsx'
import { consonantInventory, createQuestionSession } from './level1Questions.js'

export default function Level1BuildTheSound({ initialQuestions, active = true, onComplete }) {
  const startQuestionSession = () => initialQuestions ?? createQuestionSession(consonantInventory, 10)
  const [timerSession, setTimerSession] = useState(0)
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
  const { elapsedSeconds, resetTime } = useLevelTime(active && !isChecked && !showSummary)
  const allQuestionsAnswered = Object.keys(responses).length === questions.length

  function recordResponse(response) {
    const next = { ...responses, [question.id]: response }
    setResponses(next)
    if (Object.keys(next).length === questions.length) {
      onComplete?.(Object.values(next).filter((answer) => answer.isCorrect).length, questions.length, elapsedSeconds())
    }
  }

  function expireQuestion() {
    if (isChecked) return
    recordResponse({
      id: question.id, features: question.features, exampleWord: question.exampleWord,
      selectedAnswer, correctAnswer: question.answer, isCorrect: false, timedOut: true,
    })
  }

  function checkAnswer() {
    if (!selectedAnswer || isChecked) return
    recordResponse({ id: question.id, features: question.features, exampleWord: question.exampleWord, selectedAnswer, correctAnswer: question.answer, isCorrect })
  }

  function restartActivity() {
    resetTime()
    setTimerSession((session) => session + 1)
    setQuestions(startQuestionSession())
    setQuestionIndex(0)
    setSelectedAnswers({})
    setResponses({})
    setShowSummary(false)
  }

  if (showSummary) {
    return <QuizSummary activityNumber="3" title="Build the Sound" score={score} total={questions.length} responses={questions.map(({ id }) => responses[id])} onRestart={restartActivity}>
    </QuizSummary>
  }

  return (
    <section aria-label="Activity 3: Build the Sound">
      <div className="sound-activity">
        <div className="sound-activity-header">
          <h3>Activity 3: Build the Sound</h3>
          <div className="sound-activity-meta">
            <QuestionTimer key={timerSession} questionId={question.id} paused={isChecked || !active} onExpire={expireQuestion} />
            <span className="sound-activity-progress">
              Question {questionIndex + 1} of {questions.length}
            </span>
          </div>
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
            {response?.timedOut ? `Time’s up. The correct answer is /${question.answer}/.` : isCorrect
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
