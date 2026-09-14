// Canadian English consonant inventory used to generate Build the Sound questions.
// Add or edit consonant facts here; answer choices are generated automatically.
export const consonantInventory = [
  {
    id: 'p-pat',
    symbol: 'p',
    exampleWord: 'pat',
    voicing: 'Voiceless',
    manner: 'Plosive',
    place: 'Bilabial',
  },
  {
    id: 'b-bat',
    symbol: 'b',
    exampleWord: 'bat',
    voicing: 'Voiced',
    manner: 'Plosive',
    place: 'Bilabial',
  },
  {
    id: 'm-man',
    symbol: 'm',
    exampleWord: 'man',
    voicing: 'Voiced',
    manner: 'Nasal',
    place: 'Bilabial',
  },
  {
    id: 'f-fan',
    symbol: 'f',
    exampleWord: 'fan',
    voicing: 'Voiceless',
    manner: 'Fricative',
    place: 'Labiodental',
  },
  {
    id: 'v-van',
    symbol: 'v',
    exampleWord: 'van',
    voicing: 'Voiced',
    manner: 'Fricative',
    place: 'Labiodental',
  },
  {
    id: 'theta-thin',
    symbol: 'θ',
    exampleWord: 'thin',
    voicing: 'Voiceless',
    manner: 'Fricative',
    place: 'Dental',
  },
  {
    id: 'eth-then',
    symbol: 'ð',
    exampleWord: 'then',
    voicing: 'Voiced',
    manner: 'Fricative',
    place: 'Dental',
  },
  {
    id: 't-top',
    symbol: 't',
    exampleWord: 'top',
    voicing: 'Voiceless',
    manner: 'Plosive',
    place: 'Alveolar',
  },
  {
    id: 'd-dog',
    symbol: 'd',
    exampleWord: 'dog',
    voicing: 'Voiced',
    manner: 'Plosive',
    place: 'Alveolar',
  },
  {
    id: 'n-net',
    symbol: 'n',
    exampleWord: 'net',
    voicing: 'Voiced',
    manner: 'Nasal',
    place: 'Alveolar',
  },
  {
    id: 's-sip',
    symbol: 's',
    exampleWord: 'sip',
    voicing: 'Voiceless',
    manner: 'Fricative',
    place: 'Alveolar',
  },
  {
    id: 'z-zip',
    symbol: 'z',
    exampleWord: 'zip',
    voicing: 'Voiced',
    manner: 'Fricative',
    place: 'Alveolar',
  },
  {
    id: 'l-lip',
    symbol: 'l',
    exampleWord: 'lip',
    voicing: 'Voiced',
    manner: 'Lateral approximant',
    place: 'Alveolar',
  },
  {
    id: 'r-red',
    symbol: 'ɹ',
    exampleWord: 'red',
    voicing: 'Voiced',
    manner: 'Rhotic approximant',
    place: 'Retroflex',
  },
  {
    id: 'esh-ship',
    symbol: 'ʃ',
    exampleWord: 'ship',
    voicing: 'Voiceless',
    manner: 'Fricative',
    place: 'Postalveolar',
  },
  {
    id: 'ezh-measure',
    symbol: 'ʒ',
    exampleWord: 'measure',
    voicing: 'Voiced',
    manner: 'Fricative',
    place: 'Postalveolar',
  },
  {
    id: 'tsh-chip',
    symbol: 'tʃ',
    exampleWord: 'chip',
    voicing: 'Voiceless',
    manner: 'Affricate',
    place: 'Postalveolar',
  },
  {
    id: 'dzh-jam',
    symbol: 'dʒ',
    exampleWord: 'jam',
    voicing: 'Voiced',
    manner: 'Affricate',
    place: 'Postalveolar',
  },
  {
    id: 'j-yes',
    symbol: 'j',
    exampleWord: 'yes',
    voicing: 'Voiced',
    manner: 'Glide approximant',
    place: 'Palatal',
  },
  {
    id: 'k-cat',
    symbol: 'k',
    exampleWord: 'cat',
    voicing: 'Voiceless',
    manner: 'Plosive',
    place: 'Velar',
  },
  {
    id: 'g-go',
    symbol: 'ɡ',
    exampleWord: 'go',
    voicing: 'Voiced',
    manner: 'Plosive',
    place: 'Velar',
  },
  {
    id: 'eng-sing',
    symbol: 'ŋ',
    exampleWord: 'sing',
    voicing: 'Voiced',
    manner: 'Nasal',
    place: 'Velar',
  },
  {
    id: 'w-we',
    symbol: 'w',
    exampleWord: 'we',
    voicing: 'Voiced',
    manner: 'Glide approximant',
    place: 'Labial-velar',
  },
  {
    id: 'h-hat',
    symbol: 'h',
    exampleWord: 'hat',
    voicing: 'Voiceless',
    manner: 'Fricative',
    place: 'Glottal',
  },
]

export function shuffleItems(items, random = Math.random) {
  const shuffledItems = [...items]
  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1))
    ;[shuffledItems[index], shuffledItems[randomIndex]] = [shuffledItems[randomIndex], shuffledItems[index]]
  }
  return shuffledItems
}

function similarityScore(sound, answer) {
  return ['voicing', 'manner', 'place']
    .filter((feature) => sound[feature] === answer[feature])
    .length
}

export function createAnswerChoices(answer, inventory, random = Math.random) {
  const distractors = shuffleItems(
    inventory.filter((sound) => sound.symbol !== answer.symbol),
    random,
  )
    .sort((first, second) => similarityScore(second, answer) - similarityScore(first, answer))
    .slice(0, 3)
    .map((sound) => sound.symbol)

  return shuffleItems([answer.symbol, ...distractors], random)
}

export function createQuestionSession(inventory, count = 10, random = Math.random) {
  return shuffleItems(inventory, random)
    .slice(0, Math.min(count, inventory.length))
    .map((sound) => ({
      id: sound.id,
      exampleWord: sound.exampleWord,
      features: [sound.voicing, sound.manner, sound.place],
      answer: sound.symbol,
      choices: createAnswerChoices(sound, inventory, random),
    }))
}

