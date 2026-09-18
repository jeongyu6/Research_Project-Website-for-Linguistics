export default function UnderlinedExample({ example, underlined, underlineLastOccurrence = false }) {
  let cursor = 0
  const parts = []

  underlined.forEach((letters, index) => {
    const start = underlineLastOccurrence ? example.lastIndexOf(letters) : example.indexOf(letters, cursor)
    if (start === -1) return
    if (start > cursor) parts.push(example.slice(cursor, start))
    parts.push(<span className="sound-example-letters" key={`${letters}-${index}`}>{letters}</span>)
    cursor = start + letters.length
  })

  parts.push(example.slice(cursor))
  return parts
}
