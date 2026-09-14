import ConsonantSummary from './ConsonantSummary.jsx'
import { qualifiesForNextLevel } from '../levelProgress.js'
import { useEffect, useState } from 'react'
import Level1ConsonantPlacement from './level_1/Level1ConsonantPlacement.jsx'
import Level2CompleteChart from './level_2/Level2CompleteChart.jsx'
import Level3WordMatch from './level_3/Level3WordMatch.jsx'

const levels = [
  { title: 'Level 1: Place Consonants', Component: Level1ConsonantPlacement },
  { title: 'Level 2: Complete the Chart', Component: Level2CompleteChart },
  { title: 'Level 3: Match Words', Component: Level3WordMatch },
]

const resultsKey = 'consonant-map-drop-level-results'

function readResults() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(resultsKey))
    return Object.fromEntries([0, 1, 2].filter((index) => {
      const result = saved?.[index]
      return Number.isInteger(result?.score) && Number.isInteger(result?.total) && result.total > 0 && result.score >= 0 && result.score <= result.total
    }).map((index) => [index, saved[index]]))
  } catch { return {} }
}

const progressKey = 'consonant-map-drop-passing-results'

function readPassingResults() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(progressKey))
    return Object.fromEntries([0, 1].filter((index) => qualifiesForNextLevel(saved?.[index]?.score, saved?.[index]?.total)).map((index) => [index, saved[index]]))
  } catch { return {} }
}

export default function Activity2ConsonantMapDrop() {
  const [results, setResults] = useState(readResults)
  const [showSummary, setShowSummary] = useState(false)
  useEffect(() => {
    try { window.localStorage.setItem(resultsKey, JSON.stringify(results)) } catch { /* Keep results for this visit. */ }
  }, [results])
  const [passingResults, setPassingResults] = useState(readPassingResults)
  useEffect(() => {
    try { window.localStorage.setItem(progressKey, JSON.stringify(passingResults)) } catch { /* Keep progress for this visit. */ }
  }, [passingResults])
  function canOpen(index) {
    return Array.from({ length: index }, (_, previous) => previous).every((previous) => qualifiesForNextLevel(passingResults[previous]?.score, passingResults[previous]?.total))
  }
  function completeLevel(index, score, total, seconds, timedOut) {
    if (!canOpen(index)) return
    setResults((current) => ({ ...current, [index]: { score, total, seconds, timedOut } }))
    if (!qualifiesForNextLevel(score, total)) return
    setPassingResults((current) => ({ ...current, [index]: { score, total } }))
  }
  const [level, setLevel] = useState(0)
  const [visited, setVisited] = useState([0])
  function selectLevel(index) {
    if (!canOpen(index)) return
    setShowSummary(false)
    setLevel(index)
    setVisited((current) => current.includes(index) ? current : [...current, index])
  }
  return (
    <div className="consonant-levels">
      <h3>Activity 2: Consonant Map Drop</h3>
      <nav className="build-sound-level-navigation" aria-label="Consonant Map Drop levels">
        {levels.map(({ title }, index) => <button key={title} type="button" disabled={!canOpen(index)} aria-describedby={!canOpen(index) ? 'consonant-level-requirement' : undefined} aria-current={!showSummary && level === index ? 'step' : undefined} onClick={() => selectLevel(index)}>{title}</button>)}
        <button type="button" aria-current={showSummary ? 'page' : undefined} onClick={() => setShowSummary(true)}>Overall summary</button>
      </nav>
      <p id="consonant-level-requirement">Score 70% or above to unlock the next level: at least 18/25 in Level 1 and 28/40 in Level 2.</p>
      {showSummary && <ConsonantSummary results={results} canOpen={canOpen} />}
      {levels.map(({ Component, title }, index) => visited.includes(index) && <div key={title} hidden={showSummary || level !== index}><Component active={!showSummary && level === index} onComplete={(score, total, seconds, timedOut) => completeLevel(index, score, total, seconds, timedOut)} /></div>)}
    </div>
  )
}
