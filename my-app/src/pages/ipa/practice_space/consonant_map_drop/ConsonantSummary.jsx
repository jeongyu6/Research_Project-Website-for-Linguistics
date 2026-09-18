import { qualifiesForNextLevel } from '../levelProgress.js'

const titles = ['Place Consonants', 'Complete the Chart', 'Match Words']
const time = (seconds) => Number.isFinite(seconds) && seconds >= 0 ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}` : 'Not recorded'

export default function ConsonantSummary({ results, canOpen }) {
  const complete = titles.every((_, index) => results[index])
  const recorded = Object.values(results)
  const score = recorded.reduce((sum, result) => sum + result.score, 0)
  const total = recorded.reduce((sum, result) => sum + result.total, 0)
  const hasTimes = complete && recorded.every((result) => Number.isFinite(result.seconds))
  return (
    <section className="activity-summary" aria-labelledby="consonant-summary-title">
      <h3 id="consonant-summary-title">Consonant Map Drop: Overall Summary</h3>
      <p>Your latest completed attempt for each level is shown below.</p>
      <div className="levels-summary-table-wrap">
        <table className="levels-summary-table">
          <caption>Consonant Map Drop grades and time</caption>
          <thead><tr><th scope="col">Level</th><th scope="col">Score</th><th scope="col">Grade</th><th scope="col">Time taken (m:ss)</th><th scope="col">Status</th></tr></thead>
          <tbody>{titles.map((title, index) => {
            const result = results[index]
            const qualifies = result && qualifiesForNextLevel(result.score, result.total)
            return <tr key={title}>
              <th scope="row">Level {index + 1}: {title}</th>
              <td>{result ? `${result.score}/${result.total}` : '—'}</td>
              <td>{result ? `${Math.round(result.score / result.total * 100)}%` : '—'}</td>
              <td>{result ? time(result.seconds) : '—'}</td>
              <td>{result ? <>{result.timedOut ? 'Time expired' : 'Completed'}{index < 2 ? qualifies ? ' — 70% or above' : ' — below 70%' : ''}</> : canOpen(index) ? 'Not completed' : 'Locked'}</td>
            </tr>
          })}</tbody>
        </table>
      </div>
      {complete ? <p className="levels-overall-grade"><strong>Overall grade: {score}/{total} ({Math.round(score / total * 100)}%)</strong></p> : <p>Complete all three levels to see your overall grade.</p>}
      {hasTimes && <p><strong>Total time: {time(recorded.reduce((sum, result) => sum + result.seconds, 0))}</strong></p>}
      <p>The overall grade counts total correct matches across all levels. Time counts active work, excluding review and time spent on this summary.</p>
    </section>
  )
}
