import { useRef, useState } from 'react'

const keyboardGroups = [
  {
    label: 'Consonants',
    symbols: ['p', 'b', 't', 'd', 'k', 'g', 'ʔ', 'f', 'v', 'θ', 'ð', 's', 'z', 'ʃ', 'ʒ', 'h', 'tʃ', 'dʒ', 'm', 'n', 'ŋ', 'r', 'w', 'j', 'l', 'ɾ', 'ʍ'],
  },
  {
    label: 'Vowels',
    symbols: ['i', 'I', 'ʊ', 'u', 'ej', 'ɛ', 'ə', 'ow', 'ʌ', 'ɔj', 'ɔ', 'æ', 'aj', 'aw', 'a', 'ɚ'],
  },
  {
    label: 'Diacritics & Transcription',
    symbols: ['ˈ', 'ˌ', 'ː', 'ʰ', '̃', '̥', '̟', '̠', '→'],
  },
]

const pulmonicColumns = [
  'Bilabial',
  'Labiodental',
  'Interdental',
  'Alveolar',
  'Alveopalatal',
  'Palatal',
  'Velar',
  'Glottal',
]

const pulmonicRows = [
  ['Oral Stop', ['p b', '', '', 't d', '', '', 'k g', 'ʔ']],
  ['Fricative', ['', 'f v', 'θ ð', 's z', 'ʃ ʒ', '', '', 'h']],
  ['Affricate', ['', '', '', '', 'tʃ dʒ', '', '', '']],
  ['Nasal', ['m', '', '', 'n', '', '', 'ŋ', '']],
  ['Retroflex Approximant', ['', '', '', 'r', '', '', '', '']],
  ['Glides', ['w', '', '', '', '', 'j', 'w', '']],
  ['Lateral Approximant', ['', '', '', 'l', '', '', '', '']],
]

const recordingFiles = import.meta.glob('../../Recordings/**/*.mp3', {
  eager: true,
  import: 'default',
  query: '?url',
})

const recordingUrl = (path) => recordingFiles[`../../Recordings/${path}`]

const consonantRecordings = {
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
  'r': [recordingUrl('Consonants/r-road.mp3')],
  'w': [recordingUrl('Consonants/W-whisper.mp3')],
  'j': [recordingUrl('Consonants/j-yellow.mp3')],
  'l': [recordingUrl('Consonants/L-leg.mp3')],
}

const vowelRecordings = {
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
  'a': [recordingUrl('Vowels/a-father.mp3')],
}

function PulmonicSymbols({ cell, rowLabel, columnLabel, selectedSymbol, onSelect }) {
  if (!cell) {
    return null
  }

  return (
    <div className="pulmonic-symbols">
      {cell.split(' ').map((symbol) => {
        const key = `${rowLabel}-${columnLabel}-${symbol}`
        const recordings = consonantRecordings[symbol] ?? []

        return (
          <button
            type="button"
            className="pulmonic-symbol-button"
            key={key}
            aria-label={`${symbol}, ${rowLabel}, ${columnLabel}${recordings.length ? ', play recording' : ''}`}
            aria-pressed={selectedSymbol === key}
            onClick={() => onSelect(key, symbol, recordings)}
          >
            <span className="ipa-symbol">{symbol}</span>
          </button>
        )
      })}
    </div>
  )
}

function VowelSymbol({ x, y, text, selectedSymbol, onSelect }) {
  const textWidth = Math.max(42, text.length * 24)
  const symbolKey = `${text}-${x}-${y}`
  const recordings = vowelRecordings[text] ?? []

  return (
    <g
      className="vowel-symbol"
      transform={`translate(${x} ${y})`}
      role="button"
      tabIndex="0"
      aria-label={`IPA vowel ${text}${recordings.length ? ', play recording' : ''}`}
      aria-pressed={selectedSymbol === symbolKey}
      onClick={() => onSelect(symbolKey, text, recordings)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(symbolKey, text, recordings)
        }
      }}
    >
      <rect className="vowel-hitbox" x={-textWidth / 2 - 10} y="-32" width={textWidth + 20} height="64" rx="0" />
      <text textAnchor="middle" dominantBaseline="central">{text}</text>
    </g>
  )
}

export function IPAKeyboard() {
  const editorRef = useRef(null)
  const savedSelectionRef = useRef(null)
  const savedOffsetsRef = useRef(null)
  const editorPointerActiveRef = useRef(false)
  const undoStackRef = useRef([])
  const redoStackRef = useRef([])
  const isProgrammaticEditRef = useRef(false)
  const [fontSize, setFontSize] = useState('medium')
  const [copyLabel, setCopyLabel] = useState('Copy all')
  const [activeFormats, setActiveFormats] = useState({ bold: false, italic: false, underline: false })
  const [formatIndicators, setFormatIndicators] = useState({ bold: false, italic: false, underline: false })

  function focusEditor() {
    editorRef.current?.focus()
  }

  function recordSnapshot() {
    const html = editorRef.current?.innerHTML ?? ''
    const stack = undoStackRef.current
    const last = stack[stack.length - 1]
    const formatsChanged = !last || Object.keys(activeFormats).some((key) => last.formats[key] !== activeFormats[key])
    if (!last || last.html !== html || formatsChanged) stack.push({ html, formats: activeFormats })
    redoStackRef.current = []
  }

  function runProgrammaticEdit(action) {
    isProgrammaticEditRef.current = true
    action()
    isProgrammaticEditRef.current = false
  }

  function placeCursorAtEnd() {
    const editor = editorRef.current
    if (!editor) return
    const range = document.createRange()
    range.selectNodeContents(editor)
    range.collapse(false)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    savedSelectionRef.current = range.cloneRange()
    saveOffsetsForRange(range)
    editor.focus()
  }

  function restoreEditorSelection() {
    const editor = editorRef.current
    if (!editor) return false

    const offsetRange = createRangeFromOffsets(savedOffsetsRef.current)
    const range = offsetRange ?? savedSelectionRef.current
    if (!range || !editor.contains(range.commonAncestorContainer)) return false

    editor.focus()
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    savedSelectionRef.current = range.cloneRange()
    saveOffsetsForRange(range)
    return true
  }

  function useCurrentOrSavedSelection() {
    const editor = editorRef.current
    const selection = window.getSelection()
    if (editor && selection && selection.rangeCount > 0) {
      const currentRange = selection.getRangeAt(0)
      if (editor.contains(currentRange.commonAncestorContainer)) {
        const rangeToRestore = currentRange.cloneRange()
        saveOffsetsForRange(rangeToRestore)
        editor.focus()
        selection.removeAllRanges()
        selection.addRange(rangeToRestore)
        savedSelectionRef.current = rangeToRestore.cloneRange()
        return true
      }
    }

    return restoreEditorSelection()
  }

  function saveEditorSelection() {
    const editor = editorRef.current
    const selection = window.getSelection()
    if (!editor || !selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    if (editor.contains(range.commonAncestorContainer)) {
      savedSelectionRef.current = range.cloneRange()
      saveOffsetsForRange(range)
    }
  }

  function syncFormatsFromSelection() {
    const editor = editorRef.current
    const selection = window.getSelection()
    if (!editor || !selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    if (!editor.contains(range.commonAncestorContainer)) return

    const selectors = {
      bold: 'strong, b',
      italic: 'em, i',
      underline: 'u',
    }
    const elementForNode = (node) => (
      node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement
    )
    const startElement = elementForNode(range.startContainer)
    const endElement = elementForNode(range.endContainer)
    const nextFormats = Object.fromEntries(
      Object.entries(selectors).map(([format, selector]) => {
        const startWrapper = startElement?.closest(selector)
        const endWrapper = endElement?.closest(selector)
        const isFormatted = Boolean(
          startWrapper
          && endWrapper
          && editor.contains(startWrapper)
          && editor.contains(endWrapper)
        )
        return [format, isFormatted]
      }),
    )

    setActiveFormats(nextFormats)
    setFormatIndicators(nextFormats)
  }

  function saveSelectionAndSyncFormats() {
    saveEditorSelection()
    syncFormatsFromSelection()
  }

  function saveSelectionFromPointer(event) {
    const editor = editorRef.current
    if (!editor) return

    const currentSelection = window.getSelection()
    if (currentSelection && currentSelection.rangeCount > 0) {
      const selectedRange = currentSelection.getRangeAt(0)
      if (
        !selectedRange.collapsed
        && editor.contains(selectedRange.commonAncestorContainer)
      ) {
        savedSelectionRef.current = selectedRange.cloneRange()
        saveOffsetsForRange(selectedRange)
        syncFormatsFromSelection()
        return
      }
    }

    let range = null
    if (document.caretPositionFromPoint) {
      const position = document.caretPositionFromPoint(event.clientX, event.clientY)
      if (position) {
        range = document.createRange()
        range.setStart(position.offsetNode, position.offset)
        range.collapse(true)
      }
    } else if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(event.clientX, event.clientY)
    }

    if (!range || !editor.contains(range.commonAncestorContainer)) {
      saveSelectionAndSyncFormats()
      return
    }

    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    savedSelectionRef.current = range.cloneRange()
    saveOffsetsForRange(range)
    syncFormatsFromSelection()
  }

  function saveOffsetsForRange(range) {
    const editor = editorRef.current
    if (!editor) return

    const beforeStart = document.createRange()
    beforeStart.selectNodeContents(editor)
    beforeStart.setEnd(range.startContainer, range.startOffset)

    const beforeEnd = document.createRange()
    beforeEnd.selectNodeContents(editor)
    beforeEnd.setEnd(range.endContainer, range.endOffset)

    savedOffsetsRef.current = {
      start: beforeStart.toString().length,
      end: beforeEnd.toString().length,
    }
  }

  function createRangeFromOffsets(offsets) {
    const editor = editorRef.current
    if (!editor || !offsets) return null

    const range = document.createRange()
    const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT)
    let node = walker.nextNode()
    let traversed = 0
    let startPoint = null
    let endPoint = null

    while (node) {
      const nextTotal = traversed + node.data.length
      if (!startPoint && offsets.start <= nextTotal) {
        startPoint = [node, Math.max(0, offsets.start - traversed)]
      }
      if (!endPoint && offsets.end <= nextTotal) {
        endPoint = [node, Math.max(0, offsets.end - traversed)]
        break
      }
      traversed = nextTotal
      node = walker.nextNode()
    }

    if (!startPoint || !endPoint) {
      range.selectNodeContents(editor)
      range.collapse(false)
      return range
    }

    range.setStart(...startPoint)
    range.setEnd(...endPoint)
    return range
  }

  function undoEditor() {
    const previous = undoStackRef.current.pop()
    if (previous === undefined || !editorRef.current) return
    redoStackRef.current.push({ html: editorRef.current.innerHTML, formats: activeFormats })
    editorRef.current.innerHTML = previous.html
    placeCursorAtEnd()
    resetTypingFormats()
  }

  function redoEditor() {
    const next = redoStackRef.current.pop()
    if (next === undefined || !editorRef.current) return
    undoStackRef.current.push({ html: editorRef.current.innerHTML, formats: activeFormats })
    editorRef.current.innerHTML = next.html
    placeCursorAtEnd()
    resetTypingFormats()
  }

  function resetTypingFormats() {
    runProgrammaticEdit(() => {
      Object.keys(activeFormats).forEach((command) => forceFormatState(command, false))
    })
    setActiveFormats({ bold: false, italic: false, underline: false })
    setFormatIndicators({ bold: false, italic: false, underline: false })
  }

  function forceFormatState(command, shouldBeActive) {
    if (document.queryCommandState(command) !== shouldBeActive) {
      document.execCommand(command, false)
    }
  }

  function applyFormat(command) {
    if (!restoreEditorSelection()) focusEditor()
    const selection = window.getSelection()
    const hadSelection = Boolean(
      selection
      && selection.rangeCount > 0
      && !selection.getRangeAt(0).collapsed
    )
    const selectedOffsets = hadSelection && savedOffsetsRef.current
      ? { ...savedOffsetsRef.current }
      : null
    recordSnapshot()
    const shouldBeActive = hadSelection
      ? !document.queryCommandState(command)
      : !activeFormats[command]
    runProgrammaticEdit(() => {
      forceFormatState(command, shouldBeActive)
    })
    if (hadSelection && selectedOffsets) {
      const formattedRange = createRangeFromOffsets(selectedOffsets)
      if (!formattedRange) return
      selection.removeAllRanges()
      selection.addRange(formattedRange)
      savedSelectionRef.current = formattedRange.cloneRange()
      saveOffsetsForRange(formattedRange)
      setActiveFormats({ bold: false, italic: false, underline: false })
      setFormatIndicators((current) => ({ ...current, [command]: shouldBeActive }))
    } else if (command === 'bold' || command === 'italic' || command === 'underline') {
      setActiveFormats((current) => ({ ...current, [command]: shouldBeActive }))
      setFormatIndicators((current) => ({ ...current, [command]: shouldBeActive }))
    }
    saveEditorSelection()
  }

  function moveCaretOutsideInactiveFormatting(range) {
    if (!range.collapsed) return

    const formatSelectors = {
      bold: 'strong, b',
      italic: 'em, i',
      underline: 'u',
    }
    const container = range.startContainer
    const element = container.nodeType === Node.ELEMENT_NODE
      ? container
      : container.parentElement

    Object.entries(formatSelectors).forEach(([format, selector]) => {
      if (activeFormats[format] || !element) return
      const wrapper = element.closest(selector)
      if (!wrapper || !editorRef.current?.contains(wrapper)) return

      const contentBeforeCaret = document.createRange()
      contentBeforeCaret.selectNodeContents(wrapper)
      contentBeforeCaret.setEnd(range.startContainer, range.startOffset)
      if (contentBeforeCaret.toString().length === wrapper.textContent.length) {
        range.setStartAfter(wrapper)
        range.collapse(true)
      }
    })
  }

  function insertSymbol(symbol) {
    recordSnapshot()
    const restoredSavedPosition = savedOffsetsRef.current
      ? restoreEditorSelection()
      : useCurrentOrSavedSelection()
    if (!restoredSavedPosition) placeCursorAtEnd()

    const editor = editorRef.current
    const selection = window.getSelection()
    if (!editor || !selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    if (!editor.contains(range.commonAncestorContainer)) return
    moveCaretOutsideInactiveFormatting(range)
    const insertionStart = savedOffsetsRef.current?.start ?? editor.textContent.length

    range.deleteContents()
    let insertedNode = document.createTextNode(symbol)

    const formatElements = { bold: 'strong', italic: 'em', underline: 'u' }
    Object.entries(activeFormats).forEach(([format, isActive]) => {
      if (!isActive) return
      const wrapper = document.createElement(formatElements[format])
      wrapper.append(insertedNode)
      insertedNode = wrapper
    })

    range.insertNode(insertedNode)
    range.setStartAfter(insertedNode)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
    savedSelectionRef.current = range.cloneRange()
    savedOffsetsRef.current = {
      start: insertionStart + symbol.length,
      end: insertionStart + symbol.length,
    }
    editorPointerActiveRef.current = false
  }

  function handleBeforeInput(event) {
    if (isProgrammaticEditRef.current) return

    const nativeEvent = event.nativeEvent
    if (
      nativeEvent.inputType === 'insertText'
      && nativeEvent.data
      && !nativeEvent.isComposing
    ) {
      event.preventDefault()
      setFormatIndicators(activeFormats)
      insertSymbol(nativeEvent.data)
      return
    }

    recordSnapshot()
  }

  function handleEditorInput() {
    setFormatIndicators(activeFormats)
    saveEditorSelection()
  }

  function wrapSelection(opening, closing) {
    focusEditor()
    const editor = editorRef.current
    const selection = window.getSelection()
    if (!editor || !selection) return

    let range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null
    if (!range || !editor.contains(range.commonAncestorContainer)) {
      range = document.createRange()
      range.selectNodeContents(editor)
      range.collapse(false)
    }

    recordSnapshot()
    const selectedContent = range.extractContents()
    const hadSelection = selectedContent.hasChildNodes()
    const openingNode = document.createTextNode(opening)
    const closingNode = document.createTextNode(closing)
    const fragment = document.createDocumentFragment()
    fragment.append(openingNode, selectedContent, closingNode)
    range.insertNode(fragment)

    selection.removeAllRanges()
    const nextRange = document.createRange()
    if (hadSelection) {
      nextRange.setStartAfter(closingNode)
    } else {
      nextRange.setStart(openingNode, openingNode.length)
    }
    nextRange.collapse(true)
    selection.addRange(nextRange)
  }

  function clearEditor() {
    if (!editorRef.current) return
    recordSnapshot()
    editorRef.current.innerHTML = ''
    focusEditor()
    Object.keys(activeFormats).forEach((command) => forceFormatState(command, false))
    setActiveFormats({ bold: false, italic: false, underline: false })
    setFormatIndicators({ bold: false, italic: false, underline: false })
  }

  async function copyAll() {
    const editor = editorRef.current
    const text = editor?.innerText ?? ''
    if (!text.trim()) return

    try {
      const html = editor.innerHTML
      const clipboardItem = new ClipboardItem({
        'text/plain': new Blob([text], { type: 'text/plain' }),
        'text/html': new Blob([html], { type: 'text/html' }),
      })
      await navigator.clipboard.write([clipboardItem])
      setCopyLabel('Copied!')
      window.setTimeout(() => setCopyLabel('Copy all'), 1600)
    } catch {
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(editor)
      selection.removeAllRanges()
      selection.addRange(range)
      document.execCommand('copy')
      selection.removeAllRanges()
    }
  }

  return (
    <section className="ipa-chart-section ipa-keyboard-section">
      <div className="ipa-section-heading">
        <h2>IPA Keyboard</h2>
        <p>Type in the editor or select an IPA symbol to insert it at the cursor.</p>
      </div>

      <div className="ipa-editor-toolbar" role="toolbar" aria-label="Text formatting">
        <button type="button" className="ipa-format-bold" onMouseDown={(event) => event.preventDefault()} onClick={() => applyFormat('bold')} aria-label="Bold selected text" aria-pressed={formatIndicators.bold}>B</button>
        <button type="button" className="ipa-format-italic" onMouseDown={(event) => event.preventDefault()} onClick={() => applyFormat('italic')} aria-label="Italicize selected text" aria-pressed={formatIndicators.italic}>I</button>
        <button type="button" className="ipa-format-underline" onMouseDown={(event) => event.preventDefault()} onClick={() => applyFormat('underline')} aria-label="Underline selected text" aria-pressed={formatIndicators.underline}>U</button>
        <span className="ipa-toolbar-divider" aria-hidden="true" />
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={undoEditor} aria-label="Undo one step" title="Undo one step">↶</button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={redoEditor} aria-label="Redo one step" title="Redo one step">↷</button>
        <button type="button" className="ipa-toolbar-text-button" onClick={clearEditor}>Clear</button>
        <button type="button" className="ipa-toolbar-text-button" onClick={copyAll}>{copyLabel}</button>
        <button type="button" className="ipa-toolbar-text-button" onMouseDown={(event) => event.preventDefault()} onClick={() => wrapSelection('/', '/')} aria-label="Wrap selected text in slashes" title="Wrap selected text in slashes">/…/</button>
        <button type="button" className="ipa-toolbar-text-button" onMouseDown={(event) => event.preventDefault()} onClick={() => wrapSelection('[', ']')} aria-label="Wrap selected text in square brackets" title="Wrap selected text in square brackets">[…]</button>
        <label htmlFor="ipa-editor-size">Text size</label>
        <select id="ipa-editor-size" value={fontSize} onChange={(event) => setFontSize(event.target.value)}>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <div className="ipa-keyboard" aria-label="International Phonetic Alphabet keyboard">
        {keyboardGroups.map((group) => (
          <div className="ipa-keyboard-group" key={group.label}>
            <h3>{group.label}</h3>
            <div className="ipa-keyboard-keys">
              {group.symbols.map((symbol, index) => (
                <button
                  type="button"
                  className="ipa-key"
                  key={`${group.label}-${symbol}-${index}`}
                  onPointerDown={(event) => {
                    if (editorPointerActiveRef.current) saveEditorSelection()
                    event.preventDefault()
                    insertSymbol(symbol)
                  }}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={(event) => {
                    if (event.detail === 0) insertSymbol(symbol)
                  }}
                  aria-label={`Insert IPA symbol ${symbol}`}
                >
                  {symbol}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        ref={editorRef}
        className={`ipa-editor ipa-editor-${fontSize}`}
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label="IPA transcription editor"
        data-placeholder="Type or insert IPA symbols here…"
        onBeforeInput={handleBeforeInput}
        onInput={handleEditorInput}
        onKeyUp={saveSelectionAndSyncFormats}
        onPointerUp={saveSelectionFromPointer}
        onMouseUp={saveSelectionFromPointer}
        onPointerDown={() => {
          editorPointerActiveRef.current = true
        }}
        onMouseDown={() => {
          editorPointerActiveRef.current = true
        }}
        suppressContentEditableWarning
      />
    </section>
  )
}

export default function IPA_Page({ onBack }) {
  const [selectedVowel, setSelectedVowel] = useState('')
  const [selectedVowelSymbol, setSelectedVowelSymbol] = useState('')
  const [selectedVowelRecordings, setSelectedVowelRecordings] = useState([])
  const [selectedPulmonic, setSelectedPulmonic] = useState('')
  const [selectedPulmonicSymbol, setSelectedPulmonicSymbol] = useState('')
  const [selectedPulmonicRecordings, setSelectedPulmonicRecordings] = useState([])

  function handleVowelSelect(key, symbol, recordings = []) {
    setSelectedVowel(key)
    setSelectedVowelSymbol(symbol)
    setSelectedVowelRecordings(recordings)
  }

  function handlePulmonicSelect(key, symbol, recordings = []) {
    setSelectedPulmonic(key)
    setSelectedPulmonicSymbol(symbol)
    setSelectedPulmonicRecordings(recordings)
  }

  return (
    <div className="ipa-page">
      <div className="ipa-page-header">
        <button type="button" className="back-button" onClick={onBack}>
          <span>Back to overview</span>
        </button>
        <h1>International Phonetic Alphabet</h1>
      </div>

      <section className="ipa-chart-section">
        <div className="ipa-section-heading">
          <h2>Canadian English Vowels </h2>
          <p>English vowels arranged by tongue height and backness.</p>
        </div>
        <div className="vowel-chart" aria-label="IPA vowel chart">
          <svg className="vowel-diagram" viewBox="0 0 980 680" role="img" aria-labelledby="vowel-diagram-title">
            <title id="vowel-diagram-title">English vowel chart with front, central, and back vowel positions</title>
            <g className="vowel-lines">
              <line x1="120" y1="76" x2="920" y2="76" />
              <line x1="180" y1="210" x2="920" y2="210" />
              <line x1="260" y1="420" x2="920" y2="420" />
              <line x1="320" y1="560" x2="920" y2="560" />
              <line x1="920" y1="76" x2="920" y2="560" />
              <line x1="120" y1="76" x2="320" y2="560" />
              <line x1="320" y1="76" x2="520" y2="560" />
              <line x1="720" y1="76" x2="720" y2="560" />
            </g>

            <g className="vowel-row-labels">
              <text x="74" y="146">High</text>
              <text x="74" y="318">Mid</text>
              <text x="74" y="492">Low</text>
            </g>

            <g className="vowel-column-labels">
              <text x="220" y="50">Front</text>
              <text x="520" y="50">Central</text>
              <text x="820" y="50">Back</text>
            </g>

            <VowelSymbol x={168} y={112} text="i" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            <VowelSymbol x={205} y={146} text="I" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            <VowelSymbol x={828} y={112} text="ʊ" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            <VowelSymbol x={882} y={108} text="u" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />

            <VowelSymbol x={238} y={244} text="ej" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            <VowelSymbol x={287} y={278} text="ɛ" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            <VowelSymbol x={558} y={318} text="ə" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            <VowelSymbol x={880} y={244} text="ow" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            <VowelSymbol x={558} y={390} text="ʌ" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            <VowelSymbol x={790} y={390} text="ɔj" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            <VowelSymbol x={882} y={390} text="ɔ" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />

            <VowelSymbol x={356} y={476} text="æ" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            <VowelSymbol x={548} y={494} text="aj" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            <VowelSymbol x={652} y={494} text="aw" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
            <VowelSymbol x={866} y={494} text="a" selectedSymbol={selectedVowel} onSelect={handleVowelSelect} />
          </svg>
        </div>
        {selectedVowelRecordings.length > 0 && (
          <div className="recording-player">
            <span>
              Recording for <span className="ipa-symbol">{selectedVowelSymbol}</span>
            </span>
            {selectedVowelRecordings.map((recording, index) => (
              <audio key={recording} controls autoPlay={index === 0} src={recording}>
                Your browser does not support the audio player.
              </audio>
            ))}
          </div>
        )}
      </section>

      <section className="ipa-chart-section">
        <div className="ipa-section-heading">
          <h2>Canadian English Consonants</h2>
          <p>Where symbols appear in pairs, the one to the right represents a voiced consonant.</p>
        </div>
        <div className="ipa-table-wrap">
          <table className="ipa-table">
            <thead>
              <tr>
                <th scope="col"></th>
                {pulmonicColumns.map((column) => (
                  <th scope="col" key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pulmonicRows.map(([label, cells]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {cells.map((cell, index) => (
                    <td key={`${label}-${pulmonicColumns[index]}`}>
                      <PulmonicSymbols
                        cell={cell}
                        rowLabel={label}
                        columnLabel={pulmonicColumns[index]}
                        selectedSymbol={selectedPulmonic}
                        onSelect={handlePulmonicSelect}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedPulmonicRecordings.length > 0 && (
          <div className="recording-player">
            <span>
              Recording for <span className="ipa-symbol">{selectedPulmonicSymbol}</span>
            </span>
            {selectedPulmonicRecordings.map((recording, index) => (
              <audio key={recording} controls autoPlay={index === 0} src={recording}>
                Your browser does not support the audio player.
              </audio>
            ))}
          </div>
        )}
      </section>

      <IPAKeyboard />

    </div>
  )
}
