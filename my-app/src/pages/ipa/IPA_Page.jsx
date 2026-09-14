import { useEffect } from 'react'
import IPAKeyboard from './keyboard/index.js'
import PracticeSpace from './practice_space/index.js'
import { Consonants, Vowels } from './sound_listening/index.js'

export { IPAKeyboard } from './keyboard/index.js'

export default function IPA_Page({ onBack }) {
  useEffect(() => {
    document.documentElement.classList.add('ipa-screen-scrolling')
    return () => document.documentElement.classList.remove('ipa-screen-scrolling')
  }, [])

  return (
    <div className="ipa-page">
      <div className="ipa-page-header">
        <button type="button" className="back-button" onClick={onBack}>
          <span>Back to overview</span>
        </button>
        <h1>International Phonetic Alphabet</h1>
      </div>

      <div className="ipa-screen"><Vowels /></div>
      <div className="ipa-screen"><Consonants /></div>
      <div className="ipa-screen"><IPAKeyboard /></div>
      <div className="ipa-screen"><PracticeSpace /></div>
    </div>
  )
}
