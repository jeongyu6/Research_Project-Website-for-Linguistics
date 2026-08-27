import { useState } from 'react'
import { mapDropSymbols, vowelChartPositions } from '../../sound_listening/vowelChartPositions.js'

const dropTargets = vowelChartPositions
  .map((position) => ({ ...position, symbol: position.activitySymbol ?? position.text }))
  .filter((position) => mapDropSymbols.includes(position.symbol))

const vowelLocations = {
  i: 'High + Front', 'ɪ': 'High + Front', 'ʊ': 'High + Back', u: 'High + Back',
  ej: 'Mid-to-high + Front', 'ɛ': 'Mid + Front', 'ə': 'Mid + Central', ow: 'Mid-to-high + Back',
  'ʌ': 'Mid + Central', 'ɔj': 'Mid-to-high + Back-to-front', 'æ': 'Low + Front',
  aj: 'Low-to-high + Central-to-front', aw: 'Low-to-high + Central-to-back', 'ɑ': 'Low + Back',
}

export default function Activity3VowelMapDrop() {
  const [placements, setPlacements] = useState({})
  const [selectedSymbol, setSelectedSymbol] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const placedSymbols = Object.values(placements)
  const remainingSymbols = mapDropSymbols.filter((symbol) => !placedSymbols.includes(symbol))
  const incorrectPlacements = Object.entries(placements)
    .filter(([targetSymbol, placedSymbol]) => targetSymbol !== placedSymbol)
    .map(([targetSymbol, placedSymbol]) => ({ targetSymbol, placedSymbol }))

  function placeSymbol(symbol, targetSymbol) {
    if (!symbol || isChecked) return
    setPlacements((current) => {
      const next = Object.fromEntries(
        Object.entries(current).filter(([target, placed]) => target !== targetSymbol && placed !== symbol),
      )
      next[targetSymbol] = symbol
      return next
    })
    setSelectedSymbol('')
  }

  function resetChart() {
    setPlacements({})
    setSelectedSymbol('')
    setIsChecked(false)
  }

  return (
    <section className="vowel-map-activity" aria-labelledby="vowel-map-drop-title">
      <div className="sound-activity-header">
        <h3 id="vowel-map-drop-title">Activity 3: Vowel Map Drop</h3>
        <span className="sound-activity-progress">Placed {placedSymbols.length} of {mapDropSymbols.length}</span>
      </div>
      <p className="sound-activity-instruction">Drag each vowel to its position on the Canadian English vowel chart. You can also select a vowel and then select a target.</p>

      <div className="vowel-map-bank" aria-label="Vowel bank">
        {remainingSymbols.map((symbol) => (
          <button
            type="button"
            draggable
            className={selectedSymbol === symbol ? 'vowel-bank-symbol vowel-bank-symbol-selected' : 'vowel-bank-symbol'}
            key={symbol}
            aria-pressed={selectedSymbol === symbol}
            onClick={() => setSelectedSymbol(symbol)}
            onDragStart={(event) => event.dataTransfer.setData('text/plain', symbol)}
          >
            /{symbol}/
          </button>
        ))}
      </div>

      <div className="vowel-map-chart" aria-label="Canadian English vowel chart practice area">
        <svg className="vowel-diagram vowel-drop-diagram" viewBox="0 0 980 680" role="group" aria-label="Empty vowel chart">
          <g className="vowel-lines">
            <line x1="120" y1="76" x2="920" y2="76" />
            <line x1="180" y1="210" x2="920" y2="210" />
            <line x1="260" y1="420" x2="920" y2="420" />
            <line x1="320" y1="560" x2="920" y2="560" />
            <line x1="920" y1="76" x2="920" y2="560" />
            <line x1="120" y1="76" x2="320" y2="560" />
            <line x1="320" y1="76" x2="520" y2="560" />
            <line x1="720" y1="76" x2="720" y2="560" />
          </g>
          <g className="vowel-row-labels">
            <text x="74" y="146">High</text><text x="74" y="318">Mid</text><text x="74" y="492">Low</text>
          </g>
          <g className="vowel-column-labels">
            <text x="220" y="50">Front</text><text x="520" y="50">Central</text><text x="820" y="50">Back</text>
          </g>
          {dropTargets.map(({ symbol, x, y }, index) => {
            const placedSymbol = placements[symbol]
            const checkedClass = isChecked
              ? placedSymbol === symbol ? ' vowel-drop-target-correct' : ' vowel-drop-target-incorrect'
              : ''
            return (
            <g
              className={`vowel-drop-target${placedSymbol ? ' vowel-drop-target-filled' : ''}${checkedClass}`}
              key={symbol}
              transform={`translate(${x} ${y})`}
              role="button"
              tabIndex="0"
              aria-label={`Vowel chart target ${index + 1}`}
              onClick={() => placeSymbol(selectedSymbol, symbol)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  placeSymbol(selectedSymbol, symbol)
                }
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault()
                placeSymbol(event.dataTransfer.getData('text/plain'), symbol)
              }}
            >
              <circle r="31" />
              {placedSymbol && <text textAnchor="middle" dominantBaseline="central">{placedSymbol}</text>}
            </g>
          )})}
        </svg>
      </div>

      {!isChecked && <button type="button" className="vowel-map-check-button" disabled={placedSymbols.length !== mapDropSymbols.length} onClick={() => setIsChecked(true)}>Check My Answer</button>}
      {isChecked && (
        <section className="vowel-map-review" aria-labelledby="vowel-map-review-heading">
          <h4 id="vowel-map-review-heading">Answer Summary</h4>
          {incorrectPlacements.length === 0 ? (
            <p>Excellent! All {mapDropSymbols.length} vowels are in the correct positions.</p>
          ) : (
            <>
              <p>{incorrectPlacements.length} {incorrectPlacements.length === 1 ? 'vowel was' : 'vowels were'} placed incorrectly. Review the correct locations:</p>
              <ul>
                {incorrectPlacements.map(({ placedSymbol }) => <li key={placedSymbol}><strong>/{placedSymbol}/</strong> → {vowelLocations[placedSymbol]}</li>)}
              </ul>
            </>
          )}
        </section>
      )}
      <button type="button" className="activity-restart-button" onClick={resetChart}>{isChecked ? 'Try again' : 'Reset chart'}</button>
    </section>
  )
}
