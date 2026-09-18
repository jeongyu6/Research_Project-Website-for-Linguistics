import useLevelTime from '../../build_the_sound/useLevelTime.js'
import { useState } from 'react'
import QuestionTimer from '../../QuestionTimer.jsx'

import { wordBank, targets } from './level2Words.js'

export default function Level2WordVowelMatch({ onBack, onComplete, onShowSummary, active = true }) {
  const [placements, setPlacements] = useState({})
  const [history, setHistory] = useState([])
  const [selectedWord, setSelectedWord] = useState('')
  const [checked, setChecked] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const remainingWords = wordBank.filter((word) => !Object.values(placements).includes(word))
  const { elapsedSeconds, resetTime } = useLevelTime(active && !checked)
  const score = targets.filter(({ vowel, word }) => placements[vowel] === word).length

  function placeWord(word, vowel) {
    if (checked || !wordBank.includes(word)) return
    setHistory((previous) => [...previous, placements])
    setPlacements((current) => ({
      ...Object.fromEntries(Object.entries(current).filter(([, placed]) => placed !== word)),
      [vowel]: word,
    }))
    setSelectedWord('')
  }

  function activateTarget(vowel) {
    if (checked) return
    if (selectedWord) placeWord(selectedWord, vowel)
    else if (placements[vowel]) {
      setHistory((previous) => [...previous, placements])
      setSelectedWord(placements[vowel])
      setPlacements((current) => Object.fromEntries(Object.entries(current).filter(([key]) => key !== vowel)))
    }
  }

  function finishAttempt(expired = false) {
    if (checked) return
    setTimedOut(expired)
    setChecked(true)
    setSelectedWord('')
    onComplete?.(score, targets.length, expired, elapsedSeconds())
  }

  function undo() {
    if (checked || history.length === 0) return
    setPlacements(history[history.length - 1])
    setHistory((previous) => previous.slice(0, -1))
    setSelectedWord('')
  }

  function restart() {
    resetTime()
    setHistory([])
    setPlacements({})
    setSelectedWord('')
    setChecked(false)
    setTimedOut(false)
    setAttempt((value) => value + 1)
  }

  return (
    <section className="word-vowel-activity" aria-labelledby="word-vowel-title">
      <div className="sound-activity-header">
        <h4 id="word-vowel-title">Level 2: Match the Words to the Vowels</h4>
        <div className="sound-activity-meta">
          <QuestionTimer key={attempt} questionId="words" duration={180} paused={checked || !active} onExpire={() => finishAttempt(true)} />
          <span className="sound-activity-progress">Placed {14 - remainingWords.length} of 14</span>
        </div>
      </div>
      <p>Drag each word from the word bank to the vowel that represents its <strong>first vowel sound</strong>.</p>
      <p><strong>IMPORTANT:</strong> Some words contain more than one vowel sound. Focus only on <strong>the first vowel sound</strong> in each word. You can also select a word, then select a vowel. Select a placed word to move it.</p>
      <div className="word-vowel-bank" role="group" aria-label="Student word bank">
        {remainingWords.map((word) => (
          <button key={word} type="button" className="vowel-bank-symbol" draggable={!checked} disabled={checked} aria-pressed={selectedWord === word} onClick={() => setSelectedWord(word)} onDragStart={(event) => { event.dataTransfer.setData('text/plain', word); setSelectedWord(word) }}>{word}</button>
        ))}
      </div>
      <div className="word-vowel-chart">
        <svg viewBox="0 0 1020 730" role="group" aria-label="Completed vowel chart: match words to vowels">
          <g className="vowel-lines" aria-hidden="true">
            <line x1="120" y1="76" x2="960" y2="76" />
            <line x1="193" y1="230" x2="960" y2="230" />
            <line x1="315" y1="490" x2="960" y2="490" />
            <line x1="400" y1="670" x2="960" y2="670" />
            <line x1="120" y1="76" x2="400" y2="670" />
            <line x1="380" y1="76" x2="520" y2="670" />
            <line x1="720" y1="76" x2="720" y2="670" />
            <line x1="960" y1="76" x2="960" y2="670" />
          </g>
          <g className="word-vowel-axis" aria-hidden="true">
            <text x="230" y="40">Front</text><text x="560" y="40">Central</text><text x="890" y="40">Back</text>
            <text x="55" y="150">High</text><text x="55" y="355">Mid</text><text x="55" y="565">Low</text>
          </g>
          {targets.map(({ vowel, word, x, y }) => (
            <g key={vowel} transform={`translate(${x} ${y})`} role="button" tabIndex={checked ? -1 : 0} aria-label={`Match word to /${vowel}/${placements[vowel] ? `: ${placements[vowel]}` : ''}`} aria-disabled={checked} className={`word-vowel-target${checked ? placements[vowel] === word ? ' word-vowel-correct' : ' word-vowel-incorrect' : ''}`} onClick={() => activateTarget(vowel)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activateTarget(vowel) } }} onDragOver={(event) => { if (!checked) event.preventDefault() }} onDrop={(event) => { event.preventDefault(); placeWord(event.dataTransfer.getData('text/plain'), vowel) }}>
              <rect x="-61" y="-28" width="122" height="72" rx="10" />
              <text className="word-vowel-symbol" textAnchor="middle" y="0">/{vowel}/</text>
              <text className="word-vowel-word" textAnchor="middle" y="28">{placements[vowel] ?? 'Drop word'}</text>
            </g>
          ))}
        </svg>
      </div>
      {checked && (
        <div className="word-vowel-results">
          <p role="status"><strong>{timedOut ? 'Time’s up. ' : ''}Score: {score}/14 ({Math.round(score / 14 * 100)}%)</strong></p>
          {score === 14 ? <p>All words are matched correctly!</p> : <><h4>Review the first vowel sound</h4><ul>{targets.filter(({ vowel, word }) => placements[vowel] !== word).map(({ vowel, word }) => <li key={vowel}><strong>{word === 'about' ? <><u>a</u>bout</> : word}</strong> → /{vowel}/</li>)}</ul></>}
        </div>
      )}
      <div className="word-vowel-actions">
        {checked && onShowSummary && <button type="button" className="activity-restart-button" onClick={onShowSummary}>View overall summary</button>}
        <button type="button" className="back-button" onClick={onBack}>Back to Level 1</button>
        <button type="button" className="vowel-map-undo-button" disabled={checked || history.length === 0} onClick={undo}>Undo</button>
        {!checked && <button type="button" className="activity-restart-button" disabled={remainingWords.length > 0} onClick={() => finishAttempt()}>Check matches</button>}
        <button type="button" className="activity-restart-button" onClick={restart}>{checked ? 'Try again' : 'Reset words'}</button>
      </div>
    </section>
  )
}
