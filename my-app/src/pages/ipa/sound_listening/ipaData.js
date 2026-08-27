export const pulmonicColumns = [
  'Bilabial',
  'Labiodental',
  'Interdental',
  'Alveolar',
  'Alveopalatal',
  'Palatal',
  'Velar',
  'Glottal',
]

export const pulmonicRows = [
  ['Oral Stop', ['p b', '', '', 't d', '', '', 'k g', '']],
  ['Fricative', ['', 'f v', 'θ ð', 's z', 'ʃ ʒ', '', '', 'h']],
  ['Affricate', ['', '', '', '', 'tʃ dʒ', '', '', '']],
  ['Nasal', ['m', '', '', 'n', '', '', 'ŋ', '']],
  ['Retroflex Approximant', ['', '', '', 'ɹ', '', '', '', '']],
  ['Glides', ['w', '', '', '', '', 'j', 'w', '']],
  ['Lateral Approximant', ['', '', '', 'l', '', '', '', '']],
]

const recordingFiles = import.meta.glob('../../../../Recordings/**/*.mp3', {
  eager: true,
  import: 'default',
  query: '?url',
})

const recordingUrl = (path) => recordingFiles[`../../../../Recordings/${path}`]

export const consonantRecordings = {
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
  'ɹ': [recordingUrl('Consonants/r-road.mp3')],
  'w': [recordingUrl('Consonants/W-whisper.mp3')],
  'j': [recordingUrl('Consonants/j-yellow.mp3')],
  'l': [recordingUrl('Consonants/L-leg.mp3')],
}

export const vowelRecordings = {
  'i': [recordingUrl('Vowels/i-sheep.mp3')],
  'I': [recordingUrl('Vowels/ɪ-ship.mp3')],
  'ʊ': [recordingUrl('Vowels/ʊ-put.mp3')],
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
  'ɑ': [recordingUrl('Vowels/a-father.mp3')],
}
