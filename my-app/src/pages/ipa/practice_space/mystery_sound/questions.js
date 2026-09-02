import { consonantInventory, shuffleItems } from '../build_the_sound/questions.js'

export function createMysterySound(inventory = consonantInventory, random = Math.random) {
  return inventory[Math.floor(random() * inventory.length)]
}

export function createMysteryClues(sound) {
  return [sound.voicing, sound.manner, sound.place]
    .map((feature) => `I am ${feature.toLowerCase()}.`)
}

export function createMysteryChoices(inventory = consonantInventory, random = Math.random) {
  return shuffleItems(inventory.map(({ symbol }) => symbol), random)
}

export const mysterySoundInventory = consonantInventory
