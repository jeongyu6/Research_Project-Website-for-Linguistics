function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return 'Not recorded'
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

const levels = [
  { id: 1, title: 'Vowel Map Drop' },
  { id: 2, title: 'Match the Words to the Vowels' },
]

export default function LevelSummary({ results, level2Unlocked }) {
  const complete = levels.every(({ id }) => results[id])
  const hasTimes = complete && levels.every(({ id }) => Number.isFinite(results[id]?.seconds))
  const totalSeconds = levels.reduce((sum, { id }) => sum + (results[id]?.seconds ?? 0), 0)
  const earned = levels.reduce((sum, { id }) => sum + (results[id]?.score ?? 0), 0)
  const possible = levels.reduce((sum, { id }) => sum + (results[id]?.total ?? 0), 0)

  return (
    <section className="activity-summary" aria-labelledby="levels-summary-title">
      <h3 id="levels-summary-title">Vowel Map Drop: Overall Summary</h3>
      <p>Your latest completed attempt for each level is shown below. Retrying a level updates its grade when you finish.</p>
      <div className="levels-summary-table-wrap">
        <table className="levels-summary-table">
          <caption>Grades by level</caption>
          <thead><tr><th scope="col">Level</th><th scope="col">Score</th><th scope="col">Grade</th><th scope="col">Time taken (m:ss)</th><th scope="col">Status</th></tr></thead>
          <tbody>{levels.map(({ id, title }) => {
            const result = results[id]
            return <tr key={id}>
              <th scope="row">Level {id}: {title}</th>
              <td>{result ? `${result.score}/${result.total}` : '—'}</td>
              <td>{result ? `${Math.round(result.score / result.total * 100)}%` : '—'}</td>
              <td>{result ? formatTime(result.seconds) : '—'}</td>
              <td>{result ? result.timedOut ? 'Time expired' : id === 1 && result.score / result.total < 0.7 ? 'Completed — below 70%' : 'Completed' : id === 2 && !level2Unlocked ? 'Locked — earn 70% or above in Level 1' : 'Not completed'}</td>
            </tr>
          })}</tbody>
        </table>
      </div>
      {complete
        ? <p className="levels-overall-grade"><strong>Overall grade: {earned}/{possible} ({Math.round(earned / possible * 100)}%)</strong></p>
        : <p>Complete both levels to see your overall grade.</p>}
      {hasTimes && <p><strong>Total time: {formatTime(totalSeconds)}</strong></p>}
      <p>Time taken counts active work on each level, excluding answer review and time spent on this summary.</p>
      <p>The overall grade is the total correct answers divided by the total possible answers across both levels.</p>
    </section>
  )
}
