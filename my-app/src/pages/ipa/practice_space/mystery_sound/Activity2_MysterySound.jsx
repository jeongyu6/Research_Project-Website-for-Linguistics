import { useState } from 'react'
import { createMysteryChoices, createMysteryClueOrder, createMysteryClues, createMysterySound } from './questions.js'

const pointsByClueCount = { 1: 300, 2: 200, 3: 100 }

export default function Activity2MysterySound({ initialSound, initialChoices, initialClueOrder }) {
  const startMystery = () => initialSound ?? createMysterySound()
  const [mystery, setMystery] = useState(startMystery)
  const [clueOrder, setClueOrder] = useState(() => initialClueOrder ?? createMysteryClueOrder())
  const makeChoices = (sound, order) => initialChoices ?? createMysteryChoices(sound, order)
  const [choices, setChoices] = useState(() => makeChoices(mystery, clueOrder))
  const [revealedClues, setRevealedClues] = useState(1)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [attemptedAnswers, setAttemptedAnswers] = useState([])
  const [feedback, setFeedback] = useState('')
  const [isSolved, setIsSolved] = useState(false)
  const [isSkipped, setIsSkipped] = useState(false)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const clues = createMysteryClues(mystery, clueOrder)
  const isRoundComplete = isSolved || isSkipped

  function revealNextClue() {
    if (revealedClues >= clues.length || isRoundComplete) return
    setRevealedClues((count) => count + 1)
    setSelectedAnswer('')
    setFeedback('')
  }

  function submitGuess() {
    if (!selectedAnswer || isRoundComplete) return
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

  function skipMystery() {
    if (isRoundComplete) return
    setSelectedAnswer('')
    setFeedback(`Skipped. The mystery sound was /${mystery.symbol}/.`)
    setIsSkipped(true)
  }

  function beginNextMystery() {
    const nextMystery = startMystery()
    const nextClueOrder = initialClueOrder ?? createMysteryClueOrder()
    setMystery(nextMystery)
    setClueOrder(nextClueOrder)
    setChoices(makeChoices(nextMystery, nextClueOrder))
    setRevealedClues(1)
    setSelectedAnswer('')
    setAttemptedAnswers([])
    setFeedback('')
    setIsSolved(false)
    setIsSkipped(false)
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
              className={`sound-choice${selectedAnswer === symbol ? ' sound-choice-selected' : ''}${isRoundComplete && symbol === mystery.symbol ? ' sound-choice-correct' : ''}`}
              key={symbol}
              onClick={() => setSelectedAnswer(symbol)}
              aria-pressed={selectedAnswer === symbol}
              disabled={isRoundComplete || attemptedAnswers.includes(symbol)}
            >
              /{symbol}/
            </button>
          ))}
        </div>

        {feedback && <p className={`sound-feedback ${isSolved ? 'sound-feedback-correct' : isSkipped ? 'sound-feedback-skipped' : 'sound-feedback-incorrect'}`} role="status">{feedback}</p>}

        <div className="sound-activity-actions mystery-sound-actions">
          <span>Clue {revealedClues} of {clues.length}</span>
          <div>
            {!isRoundComplete && revealedClues < clues.length && <button type="button" className="mystery-secondary-button" onClick={revealNextClue}>Reveal another clue</button>}
            {!isRoundComplete && <button type="button" className="mystery-secondary-button" onClick={skipMystery}>Skip</button>}
            {!isRoundComplete && <button type="button" onClick={submitGuess} disabled={!selectedAnswer}>Submit guess</button>}
            {isRoundComplete && <button type="button" onClick={beginNextMystery}>Next mystery</button>}
          </div>
        </div>
      </div>
    </section>
  )
}
