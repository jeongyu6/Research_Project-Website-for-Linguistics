import { useState } from 'react'
import { consonantDescriptions, consonantRecordings, pulmonicColumns, pulmonicRows } from './ipaData.js'
import UnderlinedExample from './UnderlinedExample.jsx'

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


export default function Consonants() {
  const [selectedPulmonic,setSelectedPulmonic]=useState(''); const [selectedPulmonicSymbol,setSelectedPulmonicSymbol]=useState(''); const [selectedPulmonicRecordings,setSelectedPulmonicRecordings]=useState([])
  const selectedDescription = consonantDescriptions[selectedPulmonicSymbol]
  function handlePulmonicSelect(key,symbol,recordings=[]){setSelectedPulmonic(key);setSelectedPulmonicSymbol(symbol);setSelectedPulmonicRecordings(recordings)}
  return (
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
        <p className="consonant-chart-note">
          Note: you can hear [
          <button
            type="button"
            className="vowel-note-symbol"
            aria-label="Play recording for ʔ"
            aria-pressed={selectedPulmonic === 'canadian-english-words-glottal-stop'}
            onClick={() => handlePulmonicSelect('canadian-english-words-glottal-stop', 'ʔ', consonantRecordings['ʔ'])}
          >
            ʔ
          </button>
          ] in words such as 'button' and 'Latin'.
        </p>
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
            {selectedDescription && (
              <div className="sound-recording-description" aria-live="polite">
                <p>{selectedDescription.features}</p>
                <p>
                  <strong>Example:</strong>{' '}
                  <span className="sound-example-word">
                    <UnderlinedExample example={selectedDescription.example} underlined={selectedDescription.underlined} />
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </section>
  )
}
