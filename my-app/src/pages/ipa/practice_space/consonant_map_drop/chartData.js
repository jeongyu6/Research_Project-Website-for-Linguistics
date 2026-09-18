import { pulmonicColumns, pulmonicRows } from '../../sound_listening/ipaData.js'
export { pulmonicColumns, pulmonicRows }

export const consonantSlots = pulmonicRows.flatMap(([manner, cells], row) => cells.flatMap((cell, column) => cell ? cell.split(' ').map((symbol, position) => ({
  id: `${row}-${column}-${position}`, answer: symbol, symbol, type: 'symbol', manner, place: pulmonicColumns[column], row, column, position,
  label: `${manner}, ${pulmonicColumns[column]}, position ${position + 1}`,
})) : []))

export const headingSlots = [
  ...pulmonicColumns.map((answer, index) => ({ id: `column-${index}`, answer, type: 'column', label: `Column ${index + 1}` })),
  ...pulmonicRows.map(([answer], index) => ({ id: `row-${index}`, answer, type: 'row', label: `Row ${index + 1}` })),
]

export function shuffle(items) {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
