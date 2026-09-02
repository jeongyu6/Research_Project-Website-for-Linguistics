import IPAKeyboard from './keyboard/index.js'
import PracticeSpace from './practice_space/index.js'
import { Consonants, Vowels } from './sound_listening/index.js'

export { IPAKeyboard } from './keyboard/index.js'

export default function IPA_Page({ onBack }) {
  return (
    <div className="ipa-page">
      <div className="ipa-page-header">
        <button type="button" className="back-button" onClick={onBack}>
          <span>Back to overview</span>
        </button>
        <h1>International Phonetic Alphabet</h1>
      </div>

      <Vowels />
      <Consonants />
      <IPAKeyboard />
      <PracticeSpace />
    </div>
  )
}
