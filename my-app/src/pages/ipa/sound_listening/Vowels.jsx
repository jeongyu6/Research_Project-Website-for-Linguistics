import { useState } from 'react'
import { vowelRecordings } from './ipaData.js'
import { vowelChartPositions } from './vowelChartPositions.js'

function VowelSymbol({ x, y, text, selectedSymbol, onSelect }) {
  const textWidth = Math.max(42, text.length * 24)
  const symbolKey = `${text}-${x}-${y}`
  const recordings = vowelRecordings[text] ?? []

  return (
    <g
      className="vowel-symbol"
      transform={`translate(${x} ${y})`}
      role="button"
      tabIndex="0"
      aria-label={`IPA vowel ${text}${recordings.length ? ', play recording' : ''}`}
      aria-pressed={selectedSymbol === symbolKey}
      onClick={() => onSelect(symbolKey, text, recordings)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(symbolKey, text, recordings)
        }
      }}
    >
      <rect className="vowel-hitbox" x={-textWidth / 2 - 10} y="-32" width={textWidth + 20} height="64" rx="0" />
      <text
        className={text === 'ɑ' ? 'vowel-symbol-keyboard-alpha' : undefined}
        textAnchor="middle"
        dominantBaseline="central"
      >
        {text}
      </text>
    </g>
  )
}


export default function Vowels() {
  const [selectedVowel,setSelectedVowel]=useState(''); const [selectedVowelSymbol,setSelectedVowelSymbol]=useState(''); const [selectedVowelRecordings,setSelectedVowelRecordings]=useState([])
  function handleVowelSelect(key,symbol,recordings=[]){setSelectedVowel(key);setSelectedVowelSymbol(symbol);setSelectedVowelRecordings(recordings)}
  return (
<section className="ipa-chart-section vowel-listening-section">
        <div className="ipa-section-heading">
          <h2>Canadian English Vowels </h2>
          <p>English vowels arranged by tongue height and backness.</p>
        </div>
        <div className="vowel-chart" aria-label="IPA vowel chart">
          <svg className="vowel-diagram" viewBox="0 0 980 680" role="img" aria-labelledby="vowel-diagram-title">
            <title id="vowel-diagram-title">English vowel chart with front, central, and back vowel positions</title>
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
              <text x="74" y="146">High</text>
              <text x="74" y="318">Mid</text>
              <text x="74" y="492">Low</text>
            </g>

            <g className="vowel-column-labels">
              <text x="220" y="50">Front</text>
              <text x="520" y="50">Central</text>
              <text x="820" y="50">Back</text>
            </g>

            {vowelChartPositions.map(({ text, x, y }) => (
              <VowelSymbol key={`${text}-${x}-${y}`} x={x} y={y} text={text} selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            ))}
          </svg>
          <p className="vowel-chart-note">
            Note: [
            <button
              type="button"
              className="vowel-note-symbol"
              aria-label="Play recording for ɔ"
              aria-pressed={selectedVowel === 'canadian-english-before-r-ɔ'}
              onClick={() => handleVowelSelect('canadian-english-before-r-ɔ', 'ɔ', vowelRecordings['ɔ'])}
            >
              ɔ
            </button>
            ] can be heard in Canadian English before [ɹ]
          </p>
        </div>
        {selectedVowelRecordings.length > 0 && (
          <div className="recording-player">
            <span>
              Recording for <span className="ipa-symbol">{selectedVowelSymbol}</span>
            </span>
            {selectedVowelRecordings.map((recording, index) => (
              <audio key={recording} controls autoPlay={index === 0} src={recording}>
                Your browser does not support the audio player.
              </audio>
            ))}
          </div>
        )}
      </section>
  )
}
