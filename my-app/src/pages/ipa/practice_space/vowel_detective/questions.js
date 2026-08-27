export const vowelInventory = [
  { id: 'i-beat', symbol: 'i', exampleWord: 'beat', type: 'Monophthong', height: 'High', backness: 'Front', rounding: 'Unrounded' },
  { id: 'small-cap-i-bit', symbol: 'ɪ', exampleWord: 'bit', type: 'Monophthong', height: 'High', backness: 'Front', rounding: 'Unrounded' },
  { id: 'epsilon-bet', symbol: 'ɛ', exampleWord: 'bet', type: 'Monophthong', height: 'Mid', backness: 'Front', rounding: 'Unrounded' },
  { id: 'ash-bat', symbol: 'æ', exampleWord: 'bat', type: 'Monophthong', height: 'Low', backness: 'Front', rounding: 'Unrounded' },
  { id: 'schwa-sofa-purr', symbol: 'ə', exampleWord: 'sofa, purr', type: 'Monophthong', height: 'Mid', backness: 'Central', rounding: 'Unrounded' },
  { id: 'wedge-putt', symbol: 'ʌ', exampleWord: 'putt', type: 'Monophthong', height: 'Mid', backness: 'Central', rounding: 'Unrounded' },
  { id: 'u-boot', symbol: 'u', exampleWord: 'boot', type: 'Monophthong', height: 'High', backness: 'Back', rounding: 'Rounded' },
  { id: 'upsilon-put', symbol: 'ʊ', exampleWord: 'put', type: 'Monophthong', height: 'High', backness: 'Back', rounding: 'Rounded' },
  { id: 'alpha-pot-father-bought', symbol: 'ɑ', exampleWord: 'pot, father, bought', type: 'Monophthong', height: 'Low', backness: 'Back', rounding: 'Unrounded' },
  { id: 'ej-bait', symbol: 'ej', exampleWord: 'bait', type: 'Diphthong', height: 'Mid-to-high', backness: 'Front', rounding: 'Unrounded' },
  { id: 'ow-boat', symbol: 'ow', exampleWord: 'boat', type: 'Diphthong', height: 'Mid-to-high', backness: 'Back', rounding: 'Rounded' },
  { id: 'aj-my', symbol: 'aj', exampleWord: 'my', type: 'Diphthong', height: 'Low-to-high', backness: 'Central-to-front', rounding: 'Unrounded' },
  { id: 'aw-cow', symbol: 'aw', exampleWord: 'cow', type: 'Diphthong', height: 'Low-to-high', backness: 'Central-to-back', rounding: 'Unrounded' },
  { id: 'oj-boy', symbol: 'ɔj', exampleWord: 'boy', type: 'Diphthong', height: 'Mid-to-high', backness: 'Back-to-front', rounding: 'Rounded-to-unrounded' },
]

function shuffle(items, random) {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]]
  }
  return shuffled
}

function similarityScore(vowel, answer) {
  return ['type', 'height', 'backness', 'rounding']
    .filter((feature) => vowel[feature] === answer[feature])
    .length
}

export function createVowelChoices(answer, inventory, random = Math.random) {
  const distractors = shuffle(inventory.filter((vowel) => vowel.symbol !== answer.symbol), random)
    .sort((first, second) => similarityScore(second, answer) - similarityScore(first, answer))
    .slice(0, 3)
    .map((vowel) => vowel.symbol)

  return shuffle([answer.symbol, ...distractors], random)
}

export function createVowelDetectiveSession(inventory, count = 10, random = Math.random) {
  return shuffle(inventory, random)
    .slice(0, Math.min(count, inventory.length))
    .map((vowel) => ({
      id: vowel.id,
      exampleWord: vowel.exampleWord,
      features: [vowel.type, vowel.height, vowel.backness, vowel.rounding],
      choices: createVowelChoices(vowel, inventory, random),
      answer: vowel.symbol,
    }))
}
