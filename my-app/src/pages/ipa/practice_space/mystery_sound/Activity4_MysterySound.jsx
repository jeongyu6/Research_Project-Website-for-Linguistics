import { useState } from 'react'
import QuestionTimer from '../QuestionTimer.jsx'
import { oddSoundOutQuestions } from './questions.js'

function formatPrompt(prompt) {
  return prompt.split(/(place of articulation|manner of articulation|height)/g).map((part, index) => (
    /^(place of articulation|manner of articulation|height)$/.test(part) ? <strong key={index}>{part}</strong> : part
  ))
}

export default function Activity4OddSoundOut({ initialQuestions = oddSoundOutQuestions }) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [responses, setResponses] = useState({})
  const [showSummary, setShowSummary] = useState(false)
  const [session, setSession] = useState(0)
  const question = initialQuestions[questionIndex]
  const selectedAnswer = selectedAnswers[question.id] ?? ''
  const response = responses[question.id]
  const answered = Boolean(response)
  const score = Object.values(responses).filter((item) => item.isCorrect).length
  const allAnswered = Object.keys(responses).length === initialQuestions.length

  function recordAnswer(timedOut = false) {
    if (answered || (!selectedAnswer && !timedOut)) return
    setResponses((previous) => ({
      ...previous,
      [question.id]: { selectedAnswer, isCorrect: !timedOut && selectedAnswer === question.answer, timedOut },
    }))
  }

  function restart() {
    setSession((value) => value + 1)
    setQuestionIndex(0)
    setSelectedAnswers({})
    setResponses({})
    setShowSummary(false)
  }

  if (showSummary) {
    return (
      <section className="activity-summary" aria-label="Activity 4: Odd Sound Out summary">
        <div className="activity-summary-header"><div><span className="sound-activity-kicker">Activity 4 complete</span><h3>Odd Sound Out Summary</h3></div><strong>Score: {score}/{initialQuestions.length}</strong></div>
        <ol className="activity-summary-list">
          {initialQuestions.map((item, index) => (
            <li key={item.id} className={responses[item.id].isCorrect ? 'summary-answer-correct' : 'summary-answer-incorrect'}>
              <strong>Question {index + 1}</strong>
              <p>{item.prompt}</p>
              <p>Your answer: {responses[item.id].selectedAnswer ? `/${responses[item.id].selectedAnswer}/` : 'No answer'} · Correct answer: /{item.answer}/</p>
              <p>{item.explanation}</p>
            </li>
          ))}
        </ol>
        <button type="button" className="activity-restart-button" onClick={restart}>Start a new session</button>
      </section>
    )
  }

  return (
    <section className="expanded-quiz" aria-label="Activity 4: Odd Sound Out">
      <div className="sound-activity">
        <div className="sound-activity-header">
          <h3>Activity 4: Odd Sound Out</h3>
          <div className="sound-activity-meta">
            <QuestionTimer key={session} questionId={question.id} paused={answered} onExpire={() => recordAnswer(true)} />
            <span className="sound-activity-progress">Question {questionIndex + 1} of {initialQuestions.length}</span>
          </div>
        </div>
        <p className="sound-activity-instruction">{formatPrompt(question.prompt)}</p>
        <div className="sound-choice-list" role="group" aria-label="Choose the odd sound out">
          {question.choices.map((choice) => (
            <button type="button" key={choice} disabled={answered} aria-pressed={selectedAnswer === choice}
              className={`sound-choice${selectedAnswer === choice ? ' sound-choice-selected' : ''}${answered && choice === question.answer ? ' sound-choice-correct' : ''}`}
              onClick={() => setSelectedAnswers((previous) => ({ ...previous, [question.id]: choice }))}>/{choice}/</button>
          ))}
        </div>
        {answered && <div className={`sound-feedback odd-sound-feedback ${response.isCorrect ? 'sound-feedback-correct' : 'sound-feedback-incorrect'}`} role="status">
          <strong>{response.timedOut ? 'Time’s up.' : response.isCorrect ? 'Correct!' : 'Not quite.'}</strong>
          <p>Correct answer: <strong>/{question.answer}/</strong></p>
          <p>{question.explanation}</p>
        </div>}
        <div className="question-navigation" aria-label="Question navigation">
          <button type="button" aria-label="Previous question" disabled={questionIndex === 0} onClick={() => setQuestionIndex((index) => index - 1)}>‹ Previous</button>
          <button type="button" aria-label="Next question" disabled={questionIndex === initialQuestions.length - 1} onClick={() => setQuestionIndex((index) => index + 1)}>Next ›</button>
        </div>
        <div className="sound-activity-actions"><span>Score: {score}/{initialQuestions.length}</span>
          {allAnswered ? <button type="button" onClick={() => setShowSummary(true)}>View summary</button> : !answered && <button type="button" disabled={!selectedAnswer} onClick={() => recordAnswer()}>Check answer</button>}
        </div>
      </div>
    </section>
  )
}
