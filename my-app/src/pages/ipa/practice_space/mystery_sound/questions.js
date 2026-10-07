export { shuffleQuestionChoices } from '../shuffleQuestionChoices.js'

export const oddSoundOutQuestions = [
  { prompt: 'Which consonant is the odd one out?', choices: ['k', 'v', 'p', 't'], answer: 'v', explanation: '/p t k/ are voiceless plosives. /v/ is a voiced fricative.' },
  { prompt: 'Which consonant is the odd one out?', choices: ['t', 'ɡ', 'b', 'd'], answer: 't', explanation: '/b d ɡ/ are voiced plosives. /t/ is voiceless.' },
  { prompt: 'Which consonant is the odd one out?', choices: ['s', 'f', 'θ', 'z'], answer: 'z', explanation: '/f θ s/ are voiceless fricatives. /z/ is voiced.' },
  { prompt: 'Which consonant is the odd one out?', choices: ['ð', 'z', 'ʃ', 'v'], answer: 'ʃ', explanation: '/v ð z/ are voiced fricatives. /ʃ/ is voiceless.' },
  { prompt: 'Which consonant has a different place of articulation from the others?', choices: ['m', 't', 'b', 'p'], answer: 't', explanation: '/p b m/ are bilabial. /t/ is alveolar.' },
  { prompt: 'Which consonant has a different place of articulation from the others?', choices: ['d', 's', 't', 'f'], answer: 'f', explanation: '/t d s/ are alveolar. /f/ is labiodental.' },
  { prompt: 'Which consonant has a different manner of articulation from the others?', choices: ['t', 's', 'f', 'v'], answer: 't', explanation: '/f v s/ are fricatives. /t/ is a plosive.' },
  { prompt: 'Which consonant has a different manner of articulation from the others?', choices: ['b', 's', 'k', 'p'], answer: 's', explanation: '/p b k/ are plosives. /s/ is a fricative.' },
  { prompt: 'Which vowel is the odd one out?', choices: ['ɛ', 'i', 'u', 'ɪ'], answer: 'u', explanation: '/i ɪ ɛ/ are front vowels. /u/ is a back vowel.' },
  { prompt: 'Which vowel is the odd one out?', choices: ['i', 'ɑ', 'ʊ', 'u'], answer: 'i', explanation: '/u ʊ ɑ/ are back vowels. /i/ is a front vowel.' },
  { prompt: 'Which vowel is the odd one out?', choices: ['ʊ', 'ɔ', 'u', 'i'], answer: 'i', explanation: '/u ʊ ɔ/ are rounded. /i/ is unrounded.' },
  { prompt: 'Which vowel has a different height from the others?', choices: ['u', 'ɑ', 'ɪ', 'i'], answer: 'ɑ', explanation: 'The other vowels are produced high or near-high in the vowel space; /ɑ/ is low.' },
  { prompt: 'Which vowel has a different height from the others?', choices: ['ɒ', 'æ', 'ɛ', 'ɑ'], answer: 'ɛ', explanation: '/æ ɑ ɒ/ are low vowels; /ɛ/ is mid.' },
  { prompt: 'Which vowel is the odd one out?', choices: ['ɑ', 'ɪ', 'i', 'æ'], answer: 'ɑ', explanation: '/i ɪ æ/ are front vowels. /ɑ/ is back.' },
  { prompt: 'Which vowel is the odd one out?', choices: ['ɪ', 'ɛ', 'u', 'i'], answer: 'u', explanation: '/i ɪ ɛ/ are unrounded. /u/ is rounded.' },
].map((question, index) => ({ ...question, id: `odd-sound-out-${index + 1}`, category: index < 8 ? 'Consonants' : 'Vowels' }))
