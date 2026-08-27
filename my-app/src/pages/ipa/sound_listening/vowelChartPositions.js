export const vowelChartPositions = [
  { text: 'i', x: 168, y: 112 },
  { text: 'I', activitySymbol: 'ɪ', x: 205, y: 146 },
  { text: 'ʊ', x: 828, y: 112 },
  { text: 'u', x: 882, y: 108 },
  { text: 'ej', x: 238, y: 244 },
  { text: 'ɛ', x: 287, y: 278 },
  { text: 'ə', x: 558, y: 318 },
  { text: 'ow', x: 880, y: 244 },
  { text: 'ʌ', x: 558, y: 390 },
  { text: 'ɔj', x: 790, y: 390 },
  { text: 'æ', x: 356, y: 476 },
  { text: 'aj', x: 548, y: 494 },
  { text: 'aw', x: 652, y: 494 },
  { text: 'ɑ', x: 866, y: 494 },
]

export const mapDropSymbols = vowelChartPositions.map((position) => position.activitySymbol ?? position.text)
