export default function QuizSummary({ activityNumber, title, score, total, responses, onRestart }) {
  const mistakes = responses.filter((response) => !response.isCorrect).length

  return (
    <section className="activity-summary" aria-labelledby={`activity-${activityNumber}-summary-heading`}>
      <div className="activity-summary-header">
        <div>
          <span className="sound-activity-kicker">Activity {activityNumber} complete</span>
          <h3 id={`activity-${activityNumber}-summary-heading`}>{title} Summary</h3>
        </div>
        <strong>Score: {score}/{total}</strong>
      </div>
      <p>{mistakes === 0 ? 'Excellent—no mistakes to review.' : `Review ${mistakes} ${mistakes === 1 ? 'mistake' : 'mistakes'} below.`}</p>
      <ol className="activity-summary-list">
        {responses.map((response, index) => (
          <li className={response.isCorrect ? 'summary-answer-correct' : 'summary-answer-incorrect'} key={response.id}>
            <div className="summary-question-heading">
              <strong>Question {index + 1}</strong>
              <span>{response.isCorrect ? 'Correct' : 'Needs review'}</span>
            </div>
            <p>{response.features.join(' + ')}</p>
            <dl>
              <div><dt>Your answer</dt><dd>/{response.selectedAnswer}/</dd></div>
              <div><dt>Correct answer</dt><dd>/{response.correctAnswer}/</dd></div>
              {response.exampleWord && <div><dt>Example word</dt><dd>{response.exampleWord}</dd></div>}
            </dl>
          </li>
        ))}
      </ol>
      <button type="button" className="activity-restart-button" onClick={onRestart}>Start a new session</button>
    </section>
  )
}
