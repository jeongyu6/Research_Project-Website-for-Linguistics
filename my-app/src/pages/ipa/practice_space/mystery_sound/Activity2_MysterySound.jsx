import { useState } from 'react'
import { createMysteryChoices, createMysteryClues, createMysterySound } from './questions.js'

const pointsByClueCount = { 1: 300, 2: 200, 3: 100 }

export default function Activity2MysterySound({ initialSound }) {
  const startMystery = () => initialSound ?? createMysterySound()
  const [mystery, setMystery] = useState(startMystery)
  const [choices, setChoices] = useState(createMysteryChoices)
  const [revealedClues, setRevealedClues] = useState(1)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [attemptedAnswers, setAttemptedAnswers] = useState([])
  const [feedback, setFeedback] = useState('')
  const [isSolved, setIsSolved] = useState(false)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const clues = createMysteryClues(mystery)

  function revealNextClue() {
    if (revealedClues >= clues.length || isSolved) return
    setRevealedClues((count) => count + 1)
    setSelectedAnswer('')
    setFeedback('')
  }

  function submitGuess() {
    if (!selectedAnswer || isSolved) return
    if (selectedAnswer === mystery.symbol) {
      const points = pointsByClueCount[revealedClues]
      setScore((currentScore) => currentScore + points)
      setFeedback(`Correct! The mystery sound is /${mystery.symbol}/. You earned ${points} points.`)
      setIsSolved(true)
      return
    }

    setAttemptedAnswers((answers) => [...answers, selectedAnswer])
    setSelectedAnswer('')
    if (revealedClues < clues.length) {
      setRevealedClues((count) => count + 1)
      setFeedback('Not quite. Here is another clue—try again.')
    } else {
      setFeedback('Not quite. Review all three clues and try again.')
    }
  }

  function beginNextMystery() {
    setMystery(startMystery())
    setChoices(createMysteryChoices())
    setRevealedClues(1)
    setSelectedAnswer('')
    setAttemptedAnswers([])
    setFeedback('')
    setIsSolved(false)
    setRound((currentRound) => currentRound + 1)
  }

  return (
    <section aria-label="Activity 2: Mystery Sound">
      <div className="sound-activity mystery-sound-activity">
        <div className="sound-activity-header">
          <h3>Activity 2: Mystery Sound</h3>
          <span className="sound-activity-progress">Round {round} · Score {score}</span>
        </div>

        <p className="sound-activity-instruction">Identify the IPA consonant. Fewer clues earn more points.</p>

        <ol className="mystery-clue-list" aria-label="Revealed phonetic clues">
          {clues.slice(0, revealedClues).map((clue, index) => (
            <li key={clue}><strong>Clue {index + 1}</strong><span>{clue}</span></li>
          ))}
        </ol>

        <div className="mystery-points" aria-label="Points available">
          {pointsByClueCount[revealedClues]} points available
        </div>

        <div className="sound-choice-list mystery-sound-choices" role="group" aria-label="Guess the mystery IPA symbol">
          {choices.map((symbol) => (
            <button
              type="button"
              className={`sound-choice${selectedAnswer === symbol ? ' sound-choice-selected' : ''}${isSolved && symbol === mystery.symbol ? ' sound-choice-correct' : ''}`}
              key={symbol}
              onClick={() => setSelectedAnswer(symbol)}
              aria-pressed={selectedAnswer === symbol}
              disabled={isSolved || attemptedAnswers.includes(symbol)}
            >
              /{symbol}/
            </button>
          ))}
        </div>

        {feedback && <p className={`sound-feedback ${isSolved ? 'sound-feedback-correct' : 'sound-feedback-incorrect'}`} role="status">{feedback}</p>}

        <div className="sound-activity-actions mystery-sound-actions">
          <span>Clue {revealedClues} of {clues.length}</span>
          <div>
            {!isSolved && revealedClues < clues.length && <button type="button" className="mystery-secondary-button" onClick={revealNextClue}>Reveal another clue</button>}
            {!isSolved && <button type="button" onClick={submitGuess} disabled={!selectedAnswer}>Submit guess</button>}
            {isSolved && <button type="button" onClick={beginNextMystery}>Next mystery</button>}
          </div>
        </div>
      </div>
    </section>
  )
}
