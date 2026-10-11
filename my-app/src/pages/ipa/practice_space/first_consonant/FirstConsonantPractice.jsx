import { useRef, useState } from 'react'
import { firstConsonantQuestions } from './questions.js'
import QuestionTimer from '../QuestionTimer.jsx'

const answerChoices = firstConsonantQuestions.map(({ answer }) => answer)

function shuffle(items) {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[other]] = [result[other], result[index]]
  }
  return result
}

function createSession() {
  return shuffle(firstConsonantQuestions).map((question) => ({
    ...question,
    dropdownChoices: shuffle(answerChoices),
  }))
}

function normalize(value) {
  return value.trim().normalize('NFC').replace(/[\[\]/\s͜͡]/g, '')
}

export default function FirstConsonantPractice() {
  const [questions, setQuestions] = useState(createSession)
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)
  const [timerSession, setTimerSession] = useState(0)
  const [timedOut, setTimedOut] = useState(false)
  const players = useRef({})
  const score = firstConsonantQuestions.filter(({ word, answer }) => normalize(answers[word] ?? '') === answer).length

  function restart() {
    Object.values(players.current).forEach((player) => {
      if (player) { player.pause(); player.currentTime = 0 }
    })
    setAnswers({})
    setChecked(false)
    setTimedOut(false)
    setTimerSession((session) => session + 1)
    setQuestions(createSession())
  }

  return <section className="sound-activity first-consonant-practice" aria-labelledby="first-consonant-heading">
    <div className="sound-activity-header">
      <h3 id="first-consonant-heading">Activity 6: First Consonant</h3>
      <QuestionTimer key={timerSession} questionId="first-consonant-session" duration={360} paused={checked}
        onExpire={() => { setTimedOut(true); setChecked(true) }} />
    </div>
    <p className="sound-activity-instruction">Listen to each word and choose or write the IPA symbol for its <strong>first consonant sound</strong>.</p>
    <p>Select a choice to fill in your answer, or type the symbol on its own or in square brackets, for example b or [b]. You can edit your answer before checking.</p>
    <div className="first-consonant-table-scroll">
      <table className="first-consonant-table">
        <caption>First consonant sounds: 20 words</caption>
        <thead><tr><th scope="col">#</th><th scope="col">Word</th><th scope="col">Recording</th><th scope="col">Your answer</th>{checked && <th scope="col">Feedback</th>}</tr></thead>
        <tbody>{questions.map(({ word, answer, audioSrc, dropdownChoices }, index) => {
          const correct = normalize(answers[word] ?? '') === answer
          return <tr key={word}>
            <th scope="row">{index + 1}</th>
            <td>{word}</td>
            <td><audio ref={(player) => { players.current[word] = player }} controls preload="none" src={audioSrc} aria-label={`Listen to ${word}`}
              onPlay={() => Object.entries(players.current).forEach(([otherWord, player]) => { if (otherWord !== word && player && !player.paused) player.pause() })}>
              Your browser does not support audio playback.
            </audio></td>
            <td><select className="first-consonant-dropdown" aria-label={`Answer choices for ${word}`} disabled={checked}
              value={answerChoices.includes(normalize(answers[word] ?? '')) ? normalize(answers[word] ?? '') : ''}
              onChange={(event) => { setAnswers((current) => ({ ...current, [word]: event.target.value })) }}>
              <option value="">Choose a symbol</option>
              {dropdownChoices.map((choice) => <option key={choice} value={choice}>[{choice}]</option>)}
            </select><input aria-label={`First consonant for ${word}`} value={answers[word] ?? ''}
              onChange={(event) => setAnswers((current) => ({ ...current, [word]: event.target.value }))}
              disabled={checked} autoComplete="off" spellCheck={false} autoCapitalize="none" /></td>
            {checked && <td className={correct ? 'sound-feedback-correct' : 'sound-feedback-incorrect'}>{correct ? 'Correct' : `Correct answer: [${answer}]`}</td>}
          </tr>
        })}</tbody>
      </table>
    </div>
    {checked && <p role="status">{timedOut && 'Time’s up! '}You scored {score} out of 20.</p>}
    <div className="sound-activity-actions">
      <button type="button" disabled={checked || !Object.values(answers).some((answer) => answer.trim())} onClick={() => setChecked(true)}>Check answers</button>
      <button type="button" onClick={restart}>Restart practice</button>
    </div>
  </section>
}
