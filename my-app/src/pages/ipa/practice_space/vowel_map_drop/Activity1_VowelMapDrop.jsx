import { qualifiesForNextLevel } from '../levelProgress.js'
import LevelSummary from './LevelSummary.jsx'
import { useEffect, useState } from 'react'
import Level1VowelMapDrop from './level_1/Level1VowelMapDrop.jsx'
import Level2WordVowelMatch from './level_2/Level2WordVowelMatch.jsx'

const resultsKey = 'vowel-map-drop-level-results'

function readResults() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(resultsKey))
    return Object.fromEntries([1, 2].filter((id) => {
      const value = stored?.[id]
      return Number.isInteger(value?.score) && Number.isInteger(value?.total) && value.total > 0 && value.score >= 0 && value.score <= value.total
    }).map((id) => [id, stored[id]]))
  } catch { return {} }
}

const unlockKey = 'vowel-map-drop-level-2-above-70'

export default function Activity1VowelMapDrop() {
  const [results, setResults] = useState(readResults)
  const [showOverallSummary, setShowOverallSummary] = useState(false)
  const [level, setLevel] = useState(1)
  const [level2Unlocked, setLevel2Unlocked] = useState(() => {
    try { return window.localStorage.getItem(unlockKey) === 'true' || qualifiesForNextLevel(results[1]?.score, results[1]?.total) } catch { return false }
  })

  useEffect(() => {
    try { window.localStorage.setItem(resultsKey, JSON.stringify(results)) } catch { /* Results remain available for this visit. */ }
  }, [results])

  function selectLevel(nextLevel) {
    if (nextLevel === 2 && !level2Unlocked) return
    setShowOverallSummary(false)
    setLevel(nextLevel)
  }

  function completeLevel1(score, total, seconds, timedOut) {
    setResults((current) => ({ ...current, 1: { score, total, seconds, timedOut } }))
    if (qualifiesForNextLevel(score, total)) {
      setLevel2Unlocked(true)
      try { window.localStorage.setItem(unlockKey, 'true') } catch { /* Unlock still works for this visit. */ }
    }
  }

  return (
    <div className="build-sound-levels vowel-map-levels">
      <h3>Activity 1: Vowel Map Drop</h3>
      <nav className="build-sound-level-navigation" aria-label="Vowel Map Drop levels">
        <button type="button" aria-current={!showOverallSummary && level === 1 ? 'step' : undefined} onClick={() => selectLevel(1)}>Level 1: Vowel Map Drop</button>
        <button type="button" aria-current={!showOverallSummary && level === 2 ? 'step' : undefined} disabled={!level2Unlocked} aria-describedby={!level2Unlocked ? 'level-two-requirement' : undefined} onClick={() => selectLevel(2)}>Level 2: Match Words to Vowels</button>
        <button type="button" aria-current={showOverallSummary ? 'page' : undefined} onClick={() => setShowOverallSummary(true)}>Overall summary</button>
      </nav>
      {!level2Unlocked && <p id="level-two-requirement">Score 70% or above in Level 1 (at least 10 out of 14) to unlock Level 2.</p>}
      {showOverallSummary && <LevelSummary results={results} level2Unlocked={level2Unlocked} />}
      <div hidden={showOverallSummary}>
      <div hidden={level !== 1}>
        <Level1VowelMapDrop active={!showOverallSummary && level === 1} onComplete={completeLevel1} level2Unlocked={level2Unlocked} onOpenLevel2={() => selectLevel(2)} />
      </div>
      {level2Unlocked && <div hidden={level !== 2}>
        <Level2WordVowelMatch active={!showOverallSummary && level === 2} onBack={() => selectLevel(1)} onComplete={(score, total, timedOut, seconds) => setResults((current) => ({ ...current, 2: { score, total, timedOut, seconds } }))} onShowSummary={() => setShowOverallSummary(true)} />
      </div>}
      </div>
    </div>
  )
}
