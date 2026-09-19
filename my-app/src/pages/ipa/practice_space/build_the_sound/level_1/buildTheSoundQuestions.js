// Fixed question order and answer choice order for Activity 3.
const questions = [
  [['Voiced', 'Plosive', 'Velar'], ['k', 'd', 'b', 'ɡ'], 'ɡ'],
  [['Voiceless', 'Plosive', 'Bilabial'], ['b', 't', 'k', 'p'], 'p'],
  [['Voiced', 'Plosive', 'Alveolar'], ['t', 'b', 'd', 'ɡ'], 'd'],
  [['Voiceless', 'Fricative', 'Labiodental'], ['v', 'θ', 'f', 's'], 'f'],
  [['Voiced', 'Fricative', 'Labiodental'], ['f', 'z', 'ð', 'v'], 'v'],
  [['Voiceless', 'Fricative', 'Dental'], ['ð', 'f', 'θ', 's'], 'θ'],
  [['Voiced', 'Fricative', 'Dental'], ['θ', 'z', 'v', 'ð'], 'ð'],
  [['Voiceless', 'Fricative', 'Alveolar'], ['z', 'ʃ', 's', 'f'], 's'],
  [['Voiced', 'Fricative', 'Alveolar'], ['s', 'ʒ', 'z', 'v'], 'z'],
  [['Voiceless', 'Fricative', 'Alveo-palatal'], ['s', 'ʒ', 'f', 'ʃ'], 'ʃ'],
  [['High', 'Front', 'Unrounded'], ['u', 'ɪ', 'i', 'æ'], 'i'],
  [['High', 'Back', 'Rounded'], ['i', 'ʊ', 'ɑ', 'u'], 'u'],
  [['Near-high', 'Front', 'Unrounded'], ['i', 'ɛ', 'ɪ', 'æ'], 'ɪ'],
  [['Near-high', 'Back', 'Rounded'], ['u', 'ɪ', 'ʊ', 'ɑ'], 'ʊ'],
  [['Mid', 'Front', 'Unrounded'], ['æ', 'ɛ', 'i', 'ɑ'], 'ɛ'],
  [['Low', 'Front', 'Unrounded'], ['ɛ', 'ɑ', 'æ', 'ɪ'], 'æ'],
  [['Low', 'Back', 'Unrounded'], ['æ', 'u', 'ɑ', 'ɛ'], 'ɑ'],
  [['Mid', 'Central', 'Unrounded'], ['i', 'ə', 'u', 'æ'], 'ə'],
  [['Mid', 'Back', 'Rounded'], ['ɛ', 'ɑ', 'ɔ', 'i'], 'ɔ'],
  [['Low', 'Central', 'Unrounded'], ['i', 'ʌ', 'æ', 'u'], 'ʌ'],
]

export const buildTheSoundQuestions = questions.map(([features, choices, answer], index) => ({
  id: `build-the-sound-${index + 1}`,
  category: index < 10 ? 'Consonants' : 'Vowels',
  features,
  choices,
  answer,
}))
