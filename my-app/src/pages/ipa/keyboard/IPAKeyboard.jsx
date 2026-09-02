import { useRef, useState } from 'react'

const keyboardGroups = [
  {
    label: 'Consonants',
    symbols: ['p', 'b', 't', 'd', 'k', 'g', 'ʔ', 'f', 'v', 'θ', 'ð', 's', 'z', 'ʃ', 'ʒ', 'h', 'tʃ', 'dʒ', 'm', 'n', 'ŋ', 'ɹ', 'w', 'j', 'l', 'ɾ', 'ʍ'],
  },
  {
    label: 'Vowels',
    symbols: ['i', 'I', 'ʊ', 'u', 'ej', 'ɛ', 'ə', 'ow', 'ʌ', 'ɔj', 'ɔ', 'æ', 'aj', 'aw', 'ɑ', 'ɚ'],
  },
  {
    label: 'Diacritics & Transcription',
    symbols: ['ˈ', 'ˌ', 'ː', 'ʰ', '̃', '̥', '̟', '̠', '→'],
  },
]

export default function IPAKeyboard() {
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
  const [wrapperIndicators, setWrapperIndicators] = useState({ slashes: false, brackets: false })

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

  function restoreCurrentOrSavedSelection() {
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
      underline: 'u, ins',
    }
    const elementHasFormat = (element, format, selector) => {
      if (!element) return false
      if (format !== 'underline') return Boolean(element.closest(selector))

      let current = element
      while (current && editor.contains(current)) {
        if (current.matches('u, ins')) return true
        const decoration = `${current.style.textDecoration} ${current.style.textDecorationLine}`
        if (decoration.includes('underline')) return true
        if (current === editor) break
        current = current.parentElement
      }
      return false
    }
    const selectedTextNodes = []
    if (!range.collapsed) {
      const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT)
      let textNode = walker.nextNode()
      while (textNode) {
        if (textNode.data && range.intersectsNode(textNode)) selectedTextNodes.push(textNode)
        textNode = walker.nextNode()
      }
    }
    const caretElement = range.startContainer.nodeType === Node.ELEMENT_NODE
      ? range.startContainer
      : range.startContainer.parentElement
    const caretHasFormat = (format, selector) => {
      if (elementHasFormat(caretElement, format, selector)) return true

      const container = range.startContainer
      const offset = range.startOffset
      const neighbors = []
      if (container.nodeType === Node.ELEMENT_NODE) {
        neighbors.push(container.childNodes[offset - 1], container.childNodes[offset])
      } else {
        if (offset === 0) neighbors.push(container.previousSibling)
        if (offset === container.data.length) neighbors.push(container.nextSibling)
      }

      return neighbors.filter(Boolean).some((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (elementHasFormat(node, format, selector)) return true
          return Array.from(node.querySelectorAll('*'))
            .some((descendant) => elementHasFormat(descendant, format, selector))
        }
        return elementHasFormat(node.parentElement, format, selector)
      })
    }
    const nextFormats = Object.fromEntries(
      Object.entries(selectors).map(([format, selector]) => {
        const isFormatted = range.collapsed
          ? caretHasFormat(format, selector)
          : selectedTextNodes.length > 0 && selectedTextNodes.every((node) => (
            elementHasFormat(node.parentElement, format, selector)
          ))
        return [format, isFormatted]
      }),
    )

    setActiveFormats(nextFormats)
    setFormatIndicators(nextFormats)
    saveOffsetsForRange(range)
    const offsets = savedOffsetsRef.current
    const text = editor.textContent
    setWrapperIndicators(getWrapperState(text, offsets))
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
    setWrapperIndicators({ slashes: false, brackets: false })
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
      underline: 'u, ins, [style*="underline"]',
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
      : restoreCurrentOrSavedSelection()
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
    saveEditorSelection()
    if (isProgrammaticEditRef.current) return
    setFormatIndicators(activeFormats)
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
      nextRange.setStartAfter(openingNode)
      nextRange.setEndBefore(closingNode)
    } else {
      nextRange.setStart(openingNode, openingNode.length)
      nextRange.collapse(true)
    }
    selection.addRange(nextRange)
    savedSelectionRef.current = nextRange.cloneRange()
    saveOffsetsForRange(nextRange)
  }

  function getWrapperLayers(text, offsets) {
    if (!offsets) return []
    const layers = []
    let start = offsets.start
    let end = offsets.end

    while (start > 0 && end < text.length) {
      const opening = text[start - 1]
      const closing = text[end]
      const indicator = opening === '/' && closing === '/'
        ? 'slashes'
        : opening === '[' && closing === ']'
          ? 'brackets'
          : null
      if (!indicator) break
      layers.push({ indicator, opening: start - 1, closing: end })
      start -= 1
      end += 1
    }

    return layers
  }

  function getWrapperState(text, offsets) {
    const layers = getWrapperLayers(text, offsets)
    return {
      slashes: layers.some((layer) => layer.indicator === 'slashes'),
      brackets: layers.some((layer) => layer.indicator === 'brackets'),
    }
  }

  function removeWrapper(layer, offsets) {
    const editor = editorRef.current
    const selection = window.getSelection()
    if (!editor || !selection) return

    const closingRange = createRangeFromOffsets({ start: layer.closing, end: layer.closing + 1 })
    closingRange?.deleteContents()
    const openingRange = createRangeFromOffsets({ start: layer.opening, end: layer.opening + 1 })
    openingRange?.deleteContents()
    editor.normalize()

    const restoredRange = createRangeFromOffsets({
      start: offsets.start - 1,
      end: offsets.end - 1,
    })
    if (!restoredRange) return
    selection.removeAllRanges()
    selection.addRange(restoredRange)
    savedSelectionRef.current = restoredRange.cloneRange()
    saveOffsetsForRange(restoredRange)
  }

  function toggleWrapper(opening, closing, indicator) {
    if (!restoreEditorSelection()) focusEditor()
    const offsets = savedOffsetsRef.current
    const text = editorRef.current?.textContent ?? ''
    const layer = getWrapperLayers(text, offsets)
      .find((candidate) => candidate.indicator === indicator)

    if (layer) {
      recordSnapshot()
      removeWrapper(layer, offsets)
      setWrapperIndicators((current) => ({ ...current, [indicator]: false }))
      return
    }

    wrapSelection(opening, closing)
    setWrapperIndicators((current) => ({ ...current, [indicator]: true }))
  }

  function clearEditor() {
    if (!editorRef.current) return
    recordSnapshot()
    editorRef.current.innerHTML = ''
    focusEditor()
    Object.keys(activeFormats).forEach((command) => forceFormatState(command, false))
    setActiveFormats({ bold: false, italic: false, underline: false })
    setFormatIndicators({ bold: false, italic: false, underline: false })
    setWrapperIndicators({ slashes: false, brackets: false })
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
        <button type="button" className="ipa-toolbar-text-button" onMouseDown={(event) => event.preventDefault()} onClick={() => toggleWrapper('/', '/', 'slashes')} aria-label="Wrap selected text in slashes" title="Wrap selected text in slashes" aria-pressed={wrapperIndicators.slashes}>/…/</button>
        <button type="button" className="ipa-toolbar-text-button" onMouseDown={(event) => event.preventDefault()} onClick={() => toggleWrapper('[', ']', 'brackets')} aria-label="Wrap selected text in square brackets" title="Wrap selected text in square brackets" aria-pressed={wrapperIndicators.brackets}>[…]</button>
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
