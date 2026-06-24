import { useState } from 'react'

const pulmonicColumns = [
  'Bilabial',
  'Labiodental',
  'Interdental',
  'Alveolar',
  'Alveopalatal',
  'Palatal',
  'Velar',
  'Glottal',
]

const pulmonicRows = [
  ['Oral Stop', ['p b', '', '', 't d', '', '', 'k g', 'ʔ']],
  ['Fricative', ['', 'f v', 'θ ð', 's z', 'ʃ ʒ', '', '', 'h']],
  ['Affricate', ['', '', '', '', 'tʃ dʒ', '', '', '']],
  ['Nasal', ['m', '', '', 'n', '', '', 'ŋ', '']],
  ['Retroflex Approximant', ['', '', '', 'r', '', '', '', '']],
  ['Glides', ['w', '', '', '', '', 'j', 'w', '']],
  ['Lateral Approximant', ['', '', '', 'l', '', '', '', '']],
]

const recordingFiles = import.meta.glob('../../Recordings/**/*.mp3', {
  eager: true,
  import: 'default',
  query: '?url',
})

const recordingUrl = (path) => recordingFiles[`../../Recordings/${path}`]

const consonantRecordings = {
  'p': [recordingUrl('Consonants/P-pack-vid.mp3')],
  'b': [recordingUrl('Consonants/b-book-vid.mp3')],
  't': [recordingUrl('Consonants/t-tour-vid.mp3')],
  'd': [recordingUrl('Consonants/d-door-vid.mp3')],
  'k': [recordingUrl('Consonants/K-key.mp3')],
  'g': [recordingUrl('Consonants/g-gig.mp3')],
  'ʔ': [recordingUrl('Consonants/ʔ-button.mp3')],
  'f': [recordingUrl('Consonants/f-fan.mp3')],
  'v': [recordingUrl('Consonants/V-van.mp3')],
  'θ': [recordingUrl('Consonants/θ-think.mp3')],
  'ð': [recordingUrl('Consonants/ð-those.mp3')],
  's': [recordingUrl('Consonants/S-seek.mp3')],
  'z': [recordingUrl('Consonants/Z-zoo.mp3')],
  'ʃ': [recordingUrl('Consonants/ʃ-shoes.mp3')],
  'ʒ': [recordingUrl('Consonants/ʒ-measure.mp3')],
  'tʃ': [recordingUrl('Consonants/tʃ-chair.mp3')],
  'dʒ': [recordingUrl('Consonants/dʒ-judge.mp3')],
  'h': [recordingUrl('Consonants/h-heat.mp3')],
  'm': [recordingUrl('Consonants/m-mom.mp3')],
  'n': [recordingUrl('Consonants/n-new.mp3')],
  'ŋ': [recordingUrl('Consonants/ŋ-sing.mp3')],
  'r': [recordingUrl('Consonants/r-road.mp3')],
  'w': [recordingUrl('Consonants/W-whisper.mp3')],
  'j': [recordingUrl('Consonants/j-yellow.mp3')],
  'l': [recordingUrl('Consonants/L-leg.mp3')],
}

const vowelRecordings = {
  'i': [recordingUrl('Vowels/i-sheep.mp3')],
  'I': [recordingUrl('Vowels/ɪ-ship.mp3')],
  'ʊ': [recordingUrl('Vowels/ʊ-book (1).mp3')],
  'u': [recordingUrl('Vowels/u-boot.mp3')],
  'ej': [recordingUrl('Vowels/ej-bait.mp3')],
  'ɛ': [recordingUrl('Vowels/ɛ-bet.mp3')],
  'ə': [recordingUrl('Vowels/ə-about.mp3')],
  'ow': [recordingUrl('Vowels/ow-boat.mp3')],
  'ʌ': [recordingUrl('Vowels/ʌ-cup.mp3')],
  'ɔj': [recordingUrl('Vowels/ɔj-boy.mp3')],
  'ɔ': [recordingUrl('Vowels/ɔ-port.mp3')],
  'æ': [recordingUrl('Vowels/æ-bat.mp3')],
  'aj': [recordingUrl('Vowels/aj-buy.mp3')],
  'aw': [recordingUrl('Vowels/aw-cow.mp3')],
  'ɑ': [recordingUrl('Vowels/ɑ-father.mp3')],
}

function PulmonicSymbols({ cell, rowLabel, columnLabel, selectedSymbol, onSelect }) {
  if (!cell) {
    return null
  }

  return (
    <div className="pulmonic-symbols">
      {cell.split(' ').map((symbol) => {
        const key = `${rowLabel}-${columnLabel}-${symbol}`
        const recordings = consonantRecordings[symbol] ?? []

        return (
          <button
            type="button"
            className="pulmonic-symbol-button"
            key={key}
            aria-label={`${symbol}, ${rowLabel}, ${columnLabel}${recordings.length ? ', play recording' : ''}`}
            aria-pressed={selectedSymbol === key}
            onClick={() => onSelect(key, symbol, recordings)}
          >
            <span className="ipa-symbol">{symbol}</span>
          </button>
        )
      })}
    </div>
  )
}

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
      <text textAnchor="middle" dominantBaseline="central">{text}</text>
    </g>
  )
}

export default function EnglishPage({ onBack }) {
  const [selectedVowel, setSelectedVowel] = useState('')
  const [selectedVowelSymbol, setSelectedVowelSymbol] = useState('')
  const [selectedVowelRecordings, setSelectedVowelRecordings] = useState([])
  const [selectedPulmonic, setSelectedPulmonic] = useState('')
  const [selectedPulmonicSymbol, setSelectedPulmonicSymbol] = useState('')
  const [selectedPulmonicRecordings, setSelectedPulmonicRecordings] = useState([])

  function handleVowelSelect(key, symbol, recordings = []) {
    setSelectedVowel(key)
    setSelectedVowelSymbol(symbol)
    setSelectedVowelRecordings(recordings)
  }

  function handlePulmonicSelect(key, symbol, recordings = []) {
    setSelectedPulmonic(key)
    setSelectedPulmonicSymbol(symbol)
    setSelectedPulmonicRecordings(recordings)
  }

  return (
    <div className="ipa-page">
      <div className="ipa-page-header">
        <button type="button" className="back-button" onClick={onBack}>
          <span>Back to overview</span>
        </button>
        <h1>International Phonetic Alphabet</h1>
      </div>

      <section className="ipa-chart-section">
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

            <VowelSymbol x={168} y={112} text="i" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            <VowelSymbol x={205} y={146} text="I" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            <VowelSymbol x={828} y={112} text="ʊ" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            <VowelSymbol x={882} y={108} text="u" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />

            <VowelSymbol x={238} y={244} text="ej" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            <VowelSymbol x={287} y={278} text="ɛ" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            <VowelSymbol x={558} y={318} text="ə" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            <VowelSymbol x={880} y={244} text="ow" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            <VowelSymbol x={558} y={390} text="ʌ" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            <VowelSymbol x={790} y={390} text="ɔj" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            <VowelSymbol x={882} y={390} text="ɔ" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />

            <VowelSymbol x={356} y={476} text="æ" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            <VowelSymbol x={548} y={494} text="aj" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            <VowelSymbol x={652} y={494} text="aw" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            <VowelSymbol x={866} y={494} text="ɑ" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
          </svg>
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

      <section className="ipa-chart-section">
        <div className="ipa-section-heading">
          <h2>Canadian English Consonants</h2>
          <p>Where symbols appear in pairs, the one to the right represents a voiced consonant.</p>
        </div>
        <div className="ipa-table-wrap">
          <table className="ipa-table">
            <thead>
              <tr>
                <th scope="col"></th>
                {pulmonicColumns.map((column) => (
                  <th scope="col" key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pulmonicRows.map(([label, cells]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {cells.map((cell, index) => (
                    <td key={`${label}-${pulmonicColumns[index]}`}>
                      <PulmonicSymbols
                        cell={cell}
                        rowLabel={label}
                        columnLabel={pulmonicColumns[index]}
                        selectedSymbol={selectedPulmonic}
                        onSelect={handlePulmonicSelect}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedPulmonicRecordings.length > 0 && (
          <div className="recording-player">
            <span>
              Recording for <span className="ipa-symbol">{selectedPulmonicSymbol}</span>
            </span>
            {selectedPulmonicRecordings.map((recording, index) => (
              <audio key={recording} controls autoPlay={index === 0} src={recording}>
                Your browser does not support the audio player.
              </audio>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
