import { consonantInventory, shuffleItems } from '../build_the_sound/questions.js'

export const mysteryFeatureOrder = ['voicing', 'manner', 'place']

export function createMysterySound(inventory = consonantInventory, random = Math.random) {
  return inventory[Math.floor(random() * inventory.length)]
}

export function createMysteryClueOrder(random = Math.random) {
  return shuffleItems(mysteryFeatureOrder, random)
}

export function createMysteryClues(sound, featureOrder = mysteryFeatureOrder) {
  return featureOrder.map((feature) => `I am ${sound[feature].toLowerCase()}.`)
}

export function createMysteryChoices(answer, featureOrder = mysteryFeatureOrder, inventory = consonantInventory, random = Math.random) {
  const [firstFeature, secondFeature, thirdFeature] = featureOrder
  const usedSymbols = new Set([answer.symbol])
  const distractors = []

  function addBestDistractor(predicate, similarityFeatures = []) {
    const candidates = shuffleItems(
      inventory.filter((sound) => !usedSymbols.has(sound.symbol) && predicate(sound)),
      random,
    ).sort((first, second) => {
      const score = (sound) => similarityFeatures.filter((feature) => sound[feature] === answer[feature]).length
      return score(second) - score(first)
    })
    const choice = candidates[0]
    if (!choice) return false
    usedSymbols.add(choice.symbol)
    distractors.push(choice.symbol)
    return true
  }

  // Eliminated by clue 1, while otherwise resembling the answer when possible.
  addBestDistractor(
    (sound) => sound[firstFeature] !== answer[firstFeature],
    [secondFeature, thirdFeature],
  )

  // Survives clue 1, then is eliminated by clue 2.
  addBestDistractor(
    (sound) => sound[firstFeature] === answer[firstFeature] && sound[secondFeature] !== answer[secondFeature],
    [thirdFeature],
  )

  // Survives the first two clues, then is eliminated by clue 3.
  const hasThirdClueDistractor = addBestDistractor(
    (sound) => sound[firstFeature] === answer[firstFeature]
      && sound[secondFeature] === answer[secondFeature]
      && sound[thirdFeature] !== answer[thirdFeature],
  )

  // Some feature combinations (for example, voiced affricates) are unique in this inventory.
  if (!hasThirdClueDistractor) {
    addBestDistractor(
      (sound) => sound[firstFeature] === answer[firstFeature],
      [secondFeature, thirdFeature],
    )
  }

  while (distractors.length < 3) {
    if (!addBestDistractor(() => true, ['voicing', 'manner', 'place'])) break
  }

  return shuffleItems([answer.symbol, ...distractors], random)
}

export const mysterySoundInventory = consonantInventory
