import QuestionTimer from '../QuestionTimer.jsx'
import { useState } from 'react'
import { findTheSoundQuestions } from './questions.js'

export default function Activity5FindTheSound({ initialQuestions = findTheSoundQuestions }) {
  const [timerSession, setTimerSession] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [responses, setResponses] = useState({})
  const [showSummary, setShowSummary] = useState(false)
  const question = initialQuestions[questionIndex]
  const selectedAnswer = selectedAnswers[question.id] ?? ''
  const response = responses[question.id]
  const isChecked = Boolean(response)
  const score = Object.values(responses).filter(({ isCorrect }) => isCorrect).length
  const allQuestionsAnswered = Object.keys(responses).length === initialQuestions.length

  function recordAnswer(timedOut = false) {
    if (isChecked || (!selectedAnswer && !timedOut)) return
    setResponses((current) => ({ ...current, [question.id]: {
      selectedAnswer, isCorrect: !timedOut && selectedAnswer === question.answer, timedOut,
    } }))
  }

  function restartActivity() {
    setTimerSession((session) => session + 1)
    setQuestionIndex(0)
    setSelectedAnswers({})
    setResponses({})
    setShowSummary(false)
  }

  if (showSummary) {
    return <section className="activity-summary" aria-label="Activity 5: Find the Sound summary">
      <div className="activity-summary-header"><div><span className="sound-activity-kicker">Activity 5 complete</span><h3>Find the Sound Summary</h3></div><strong>Score: {score}/{initialQuestions.length}</strong></div>
      <ol className="activity-summary-list">
        {initialQuestions.map((item, index) => (
          <li key={item.id} className={responses[item.id].isCorrect ? 'summary-answer-correct' : 'summary-answer-incorrect'}>
            <div className="summary-question-heading"><strong>Question {index + 1}: /{item.symbol}/</strong><span>{responses[item.id].timedOut ? 'Time expired' : responses[item.id].isCorrect ? 'Correct' : 'Needs review'}</span></div>
            <dl><div><dt>Your answer</dt><dd>{responses[item.id].selectedAnswer || 'No answer'}</dd></div><div><dt>Correct answer</dt><dd>{item.answer}</dd></div></dl>
          </li>
        ))}
      </ol>
      <button type="button" className="activity-restart-button" onClick={restartActivity}>Start a new session</button>
    </section>
  }

  return <section className="expanded-quiz" aria-label="Activity 5: Find the Sound">
    <div className="sound-activity">
      <div className="sound-activity-header">
        <h3>Activity 5: Find the Sound</h3>
        <div className="sound-activity-meta">
          <QuestionTimer key={timerSession} questionId={question.id} paused={isChecked} onExpire={() => recordAnswer(true)} />
          <span className="sound-activity-progress">Question {questionIndex + 1} of {initialQuestions.length}</span>
        </div>
      </div>
      <p className="sound-activity-instruction">Choose the word that contains the IPA vowel shown.</p>
      <p className="sound-activity-instruction">Which word contains <strong>/{question.symbol}/</strong>?</p>
      <div className="sound-choice-list" role="group" aria-label="Choose a word">
        {question.choices.map((choice, index) => <button type="button" key={choice}
          className={`sound-choice${selectedAnswer === choice ? ' sound-choice-selected' : ''}${isChecked && choice === question.answer ? ' sound-choice-correct' : ''}${isChecked && choice === selectedAnswer && !response.isCorrect ? ' sound-choice-incorrect' : ''}`}
          onClick={() => setSelectedAnswers((current) => ({ ...current, [question.id]: choice }))}
          aria-pressed={selectedAnswer === choice} disabled={isChecked}>{String.fromCharCode(65 + index)}. {choice}</button>)}
      </div>
      {isChecked && <p className={`sound-feedback ${response.isCorrect ? 'sound-feedback-correct' : 'sound-feedback-incorrect'}`} role="status">
        {response.timedOut ? 'Time’s up.' : response.isCorrect ? 'Correct!' : 'Not quite.'} The correct word is {question.answer}.
      </p>}
      <div className="question-navigation" aria-label="Question navigation">
        <button type="button" aria-label="Previous question" onClick={() => setQuestionIndex((index) => index - 1)} disabled={questionIndex === 0}>‹ Previous</button>
        <button type="button" aria-label="Next question" onClick={() => setQuestionIndex((index) => index + 1)} disabled={questionIndex === initialQuestions.length - 1}>Next ›</button>
      </div>
      <div className="sound-activity-actions"><span>Score: {score}/{initialQuestions.length}</span>
        {allQuestionsAnswered ? <button type="button" onClick={() => setShowSummary(true)}>View summary</button> : !isChecked && <button type="button" onClick={() => recordAnswer()} disabled={!selectedAnswer}>Check answer</button>}
      </div>
    </div>
  </section>
}
