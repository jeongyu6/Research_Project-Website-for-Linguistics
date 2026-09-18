import useLevelTime from '../build_the_sound/useLevelTime.js'
import { useState } from 'react'
import QuestionTimer from '../QuestionTimer.jsx'
import { consonantSlots, headingSlots, pulmonicColumns, pulmonicRows, shuffle } from './chartData.js'
import { wordAnswers } from './level_3/wordData.js'

const exercises = {
  symbols: consonantSlots,
  headings: [...headingSlots, ...consonantSlots],
  words: consonantSlots.filter(({ symbol, column }) => wordAnswers[symbol] && (symbol !== 'w' || column === 6)).map((slot) => ({ ...slot, answer: wordAnswers[slot.symbol], type: 'word', label: `Match word to /${slot.symbol}/` })),
}
const titles = {
  symbols: 'Level 1: Build the Framework: Match the Labels',
  headings: 'Level 2: Complete the Chart: Drag the Consonants',
  words: 'Level 3: Connect Sounds to Words: Match the Words',
}

export default function ConsonantChartExercise({ mode, active = true, onComplete }) {
  const slots = exercises[mode]
  const allTokens = slots.map(({ answer, type }, index) => ({ id: `tile-${index}`, answer, type }))
  const [tokens, setTokens] = useState(() => shuffle(allTokens))
  const [placements, setPlacements] = useState({})
  const [selected, setSelected] = useState('')
  const [history, setHistory] = useState([])
  const [checked, setChecked] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const tokenOf = (id) => tokens.find((token) => token.id === id)
  const { elapsedSeconds, resetTime } = useLevelTime(active && !checked)
  const remaining = tokens.filter(({ id }) => !Object.values(placements).includes(id))
  const wrong = slots.filter(({ id, answer }) => tokenOf(placements[id])?.answer !== answer)
  const correctCount = slots.length - wrong.length
  const headingsBlank = mode === 'headings'
  const words = mode === 'words'

  function place(tile, id) {
    const token = tokenOf(tile)
    const slot = slots.find((item) => item.id === id)
    if (checked || !token || !slot || token.type !== slot.type) return
    setHistory((current) => [...current, placements])
    setPlacements((current) => ({ ...Object.fromEntries(Object.entries(current).filter(([, value]) => value !== tile)), [id]: tile }))
    setSelected('')
  }

  function activate(id) {
    if (checked) return
    if (selected) place(selected, id)
    else if (placements[id]) {
      setHistory((current) => [...current, placements])
      setSelected(placements[id])
      setPlacements((current) => Object.fromEntries(Object.entries(current).filter(([key]) => key !== id)))
    }
  }

  function finishAttempt(expired = false) {
    if (checked) return
    setTimedOut(expired)
    setChecked(true)
    setSelected('')
    onComplete?.(correctCount, slots.length, elapsedSeconds(), expired)
  }

  function undo() {
    if (checked || !history.length) return
    setPlacements(history[history.length - 1])
    setHistory((current) => current.slice(0, -1))
    setSelected('')
  }

  function reset() {
    resetTime()
    setPlacements({}); setSelected(''); setHistory([]); setChecked(false); setTimedOut(false); setAttempt((current) => current + 1); setTokens(shuffle(allTokens))
  }

  function renderBank(type, label) {
    const items = remaining.filter((token) => token.type === type)
    return <div className="consonant-token-bank" key={type}>
      {headingsBlank && <h4>{label}</h4>}
      <div className="consonant-map-bank" role="group" aria-label={label}>
        {items.map(({ id, answer }) => <button key={id} type="button" className="vowel-bank-symbol" draggable={!checked} disabled={checked} aria-pressed={selected === id} onClick={() => setSelected(id)} onDragStart={(event) => { event.dataTransfer.setData('text/plain', id); setSelected(id) }}>{type === 'symbol' ? `/${answer}/` : answer}</button>)}
      </div>
    </div>
  }

  function targetButton(id, label, placeholder = '＋') {
    const slot = slots.find((item) => item.id === id)
    const answer = tokenOf(placements[id])?.answer
    return <button type="button" className={`consonant-map-target${words ? ' consonant-word-target' : ''}${checked ? answer === slot.answer ? ' consonant-map-correct' : ' consonant-map-incorrect' : ''}`} disabled={checked} aria-label={`${label}${answer ? `: ${answer}` : ''}`} onClick={() => activate(id)} onDragOver={(event) => { if (!checked) event.preventDefault() }} onDrop={(event) => { event.preventDefault(); place(event.dataTransfer.getData('text/plain'), id) }}>{answer ?? placeholder}</button>
  }

  return (
    <section className="consonant-map-activity" aria-labelledby={`consonant-${mode}-title`}>
      <div className="sound-activity-header">
        <h4 id={`consonant-${mode}-title`}>{titles[mode]}</h4>
        <div className="sound-activity-meta">
          <QuestionTimer key={attempt} questionId={mode} duration={headingsBlank ? 300 : 180} paused={checked || !active} onExpire={() => finishAttempt(true)} />
          <span className="sound-activity-progress">Placed {Object.keys(placements).length} of {slots.length}</span>
        </div>
      </div>
      <p>{words ? 'Drag each word to the IPA symbol that represents the first consonant sound you hear in the word.' : headingsBlank ? 'Drag the place of articulation labels into the column headings, the manner of articulation labels into the row headings, and the consonants into the correct positions.' : 'Drag each consonant to its position on the Canadian English consonant chart. You can also select a consonant and then select a target.'}</p>
      {mode !== 'symbols' && (words ? <p><strong>Remember:</strong> focus on the sound, not the spelling.</p> : <p>In paired positions, place voiceless consonants on the left and voiced consonants on the right. Place the two /w/ tiles in the bilabial and velar glide positions.</p>)}
      {headingsBlank && <p>You can also select a {words ? 'word' : 'tile'}, then select a target. Select a placed tile to move it, or use Undo.</p>}
      {headingsBlank && renderBank('column', 'Place of Articulation labels')}
      {headingsBlank && renderBank('row', 'Manner of Articulation labels')}
      {renderBank(words ? 'word' : 'symbol', words ? 'Student word bank' : 'Consonant bank')}
      <div className="consonant-map-table-wrap">
        <table className={`consonant-map-table${words ? ' consonant-word-table' : ''}`}>
          <caption>Canadian English consonants: manner and place of articulation</caption>
          <thead><tr><th scope="col">Manner / Place</th>{pulmonicColumns.map((column, index) => <th scope="col" key={column}>{headingsBlank ? targetButton(`column-${index}`, `Column ${index + 1}`, `Column ${index + 1}`) : column}</th>)}</tr></thead>
          <tbody>{pulmonicRows.map(([manner, cells], row) => <tr key={manner}>
            <th scope="row">{headingsBlank ? targetButton(`row-${row}`, `Row ${row + 1}`, `Row ${row + 1}`) : manner}</th>
            {cells.map((cell, column) => <td key={column} className={cell ? '' : 'consonant-map-empty'}>{cell && <div className="consonant-map-cell">{cell.split(' ').map((symbol, position) => {
              const id = `${row}-${column}-${position}`
              const label = headingsBlank ? `Row ${row + 1}, column ${column + 1}, position ${position + 1}` : `${manner}, ${pulmonicColumns[column]}, position ${position + 1}`
              return <div className="consonant-map-slot" key={id}>
                {words && <span className="ipa-symbol">/{symbol}/</span>}
                {words ? slots.some((slot) => slot.id === id) && targetButton(id, `Match word to /${symbol}/`, 'Drop word') : targetButton(id, label)}
              </div>
            })}</div>}</td>)}
          </tr>)}</tbody>
        </table>
      </div>
      {checked && <div className="consonant-map-review">
        <p role="status"><strong>{timedOut ? 'Time’s up. ' : ''}Score: {correctCount}/{slots.length} ({Math.round(correctCount / slots.length * 100)}%)</strong></p>
        {!wrong.length ? <p>All matches are correct!</p> : <><h4>Review the correct matches</h4><ul>{wrong.map(({ id, answer, label, type }) => <li key={id}>{type === 'symbol' ? `/${answer}/` : answer} — {label}</li>)}</ul></>}
      </div>}
      <div className="consonant-map-actions">
        <button type="button" className="vowel-map-undo-button" disabled={checked || !history.length} onClick={undo}>Undo</button>
        {!checked && <button type="button" className="activity-restart-button" disabled={remaining.length > 0} onClick={() => finishAttempt()}>Check chart</button>}
        <button type="button" className="activity-restart-button" onClick={reset}>{checked ? 'Try again' : 'Reset chart'}</button>
      </div>
    </section>
  )
}
