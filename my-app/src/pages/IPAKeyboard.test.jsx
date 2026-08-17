import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IPAKeyboard } from './IPA_Page.jsx'

function getEditor() {
  return screen.getByRole('textbox', { name: /ipa transcription editor/i })
}

function selectEditorText(editor) {
  editor.focus()
  const range = document.createRange()
  range.selectNodeContents(editor)
  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
}

function setCaretOffset(editor, offset) {
  const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  let traversed = 0
  while (node && traversed + node.data.length < offset) {
    traversed += node.data.length
    node = walker.nextNode()
  }

  const range = document.createRange()
  if (node) {
    range.setStart(node, offset - traversed)
  } else {
    range.selectNodeContents(editor)
    range.collapse(false)
  }
  range.collapse(true)
  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
}

function saveCaretAtEnd(editor) {
  editor.focus()
  const range = document.createRange()
  range.selectNodeContents(editor)
  range.collapse(false)
  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
  editor.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
}

function finishPointerSelection(editor) {
  editor.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }))
  editor.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
}

describe('IPAKeyboard', () => {
  const formatState = { bold: false, italic: false, underline: false }

  beforeEach(() => {
    Object.keys(formatState).forEach((format) => {
      formatState[format] = false
    })

    document.queryCommandState = vi.fn((command) => formatState[command] ?? false)
    document.execCommand = vi.fn((command, _showUI, value) => {
      if (command === 'insertText') {
        const selection = window.getSelection()
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          range.deleteContents()
          const text = document.createTextNode(value)
          range.insertNode(text)
          range.setStartAfter(text)
          range.collapse(true)
          selection.removeAllRanges()
          selection.addRange(range)
        } else {
          document.activeElement.append(document.createTextNode(value))
        }
      } else if (command in formatState) {
        formatState[command] = !formatState[command]
      }
      return true
    })
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('lets the user type directly in the editor', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()

    await user.click(editor)
    await user.keyboard('hello')

    expect(editor).toHaveTextContent('hello')
  })

  it('inserts one IPA symbol using the on-screen keyboard', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)

    await user.click(screen.getByRole('button', { name: 'Insert IPA symbol ʃ' }))

    expect(getEditor()).toHaveTextContent('ʃ')
  })

  it('inserts several IPA symbols in the selected order', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)

    for (const symbol of ['ʃ', 'ə', 'ŋ']) {
      await user.click(screen.getByRole('button', { name: `Insert IPA symbol ${symbol}` }))
    }

    expect(getEditor()).toHaveTextContent('ʃəŋ')
  })

  it('adds an IPA symbol to the end of existing text', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()

    await user.click(editor)
    await user.keyboard('test')
    await user.click(screen.getByRole('button', { name: 'Insert IPA symbol p' }))

    expect(editor).toHaveTextContent('testp')
  })

  it('inserts symbols at the saved cursor position instead of moving to the end', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()
    editor.textContent = 'hllo'
    editor.focus()

    const range = document.createRange()
    range.setStart(editor.firstChild, 1)
    range.collapse(true)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    document.dispatchEvent(new Event('selectionchange'))

    await user.click(screen.getByRole('button', { name: 'Insert IPA symbol ə' }))
    await user.click(screen.getByRole('button', { name: 'Insert IPA symbol p' }))

    expect(editor).toHaveTextContent('həpllo')
  })

  it('inserts a symbol before all existing characters', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()
    editor.textContent = 'hello'
    editor.focus()

    const range = document.createRange()
    range.setStart(editor.firstChild, 0)
    range.collapse(true)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    document.dispatchEvent(new Event('selectionchange'))

    await user.click(screen.getByRole('button', { name: 'Insert IPA symbol ʃ' }))

    expect(editor).toHaveTextContent('ʃhello')
  })

  it('replaces selected characters without moving the insertion to the end', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()
    editor.textContent = 'hello'
    editor.focus()

    const range = document.createRange()
    range.setStart(editor.firstChild, 1)
    range.setEnd(editor.firstChild, 4)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    document.dispatchEvent(new Event('selectionchange'))

    await user.click(screen.getByRole('button', { name: 'Insert IPA symbol ə' }))

    expect(editor).toHaveTextContent('həo')
  })

  it('keeps the caret after an inserted symbol so normal typing continues there', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()
    editor.textContent = 'hllo'
    editor.focus()

    const range = document.createRange()
    range.setStart(editor.firstChild, 1)
    range.collapse(true)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    document.dispatchEvent(new Event('selectionchange'))

    await user.click(screen.getByRole('button', { name: 'Insert IPA symbol ə' }))
    await user.keyboard('y')

    expect(editor).toHaveTextContent('həyllo')
  })

  it('types a normal character at a manually moved caret position', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()
    editor.textContent = 'hllo'
    editor.focus()

    const range = document.createRange()
    range.setStart(editor.firstChild, 1)
    range.collapse(true)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)

    await user.keyboard('e')

    expect(editor).toHaveTextContent('hello')
  })

  it('does not move the caret after the browser reports a selection change', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()
    editor.textContent = 'helo'
    editor.focus()

    const range = document.createRange()
    range.setStart(editor.firstChild, 3)
    range.collapse(true)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    document.queryCommandState.mockClear()
    document.dispatchEvent(new Event('selectionchange'))
    expect(document.queryCommandState).not.toHaveBeenCalled()

    await user.keyboard('l')

    expect(editor).toHaveTextContent('hello')
    expect(document.queryCommandState).not.toHaveBeenCalled()
  })

  it('uses the latest live caret when an IPA key is clicked immediately after moving it', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()
    editor.textContent = 'abcidiejihehe'
    editor.focus()

    const text = editor.firstChild
    const insertionPoint = text.textContent.indexOf('ji') + 1
    const range = document.createRange()
    range.setStart(text, insertionPoint)
    range.collapse(true)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)

    // Deliberately do not dispatch selectionchange: this reproduces clicking
    // an IPA key before an asynchronously saved caret has caught up.
    await user.click(screen.getByRole('button', { name: 'Insert IPA symbol s' }))

    expect(editor).toHaveTextContent('abcidiejsihehe')
  })

  it('inserts between separate symbol nodes even if focus moved before the click', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()

    for (const symbol of ['t', 'ʒ', 'h', 'h', 'dʒ', 'm', 'n', 'ŋ', 'r', 'w', 'j', 'l', 'ʊ', 'ʊ', 'ʊ']) {
      await user.click(screen.getByRole('button', { name: `Insert IPA symbol ${symbol}` }))
    }
    expect(editor).toHaveTextContent('tʒhhdʒmnŋrwjlʊʊʊ')

    const range = document.createRange()
    range.setStartAfter(editor.firstChild)
    range.collapse(true)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    editor.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

    const schwaButton = screen.getByRole('button', { name: 'Insert IPA symbol ə' })
    schwaButton.focus()
    selection.removeAllRanges()
    const incorrectEndRange = document.createRange()
    incorrectEndRange.selectNodeContents(editor)
    incorrectEndRange.collapse(false)
    selection.addRange(incorrectEndRange)
    await user.click(schwaButton)

    expect(editor).toHaveTextContent('təʒhhdʒmnŋrwjlʊʊʊ')
  })

  it('uses the visual pointer location after the editor has been idle', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()
    editor.textContent = 'udɔjɔjɔjʒʍ→→tʃdʒmnnŋɔjɾhŋŋŋr→→əowɔj→→'

    const visualCaret = document.createRange()
    visualCaret.setStart(editor.firstChild, 1)
    visualCaret.collapse(true)
    const originalCaretRangeFromPoint = document.caretRangeFromPoint
    Object.defineProperty(document, 'caretRangeFromPoint', {
      configurable: true,
      value: vi.fn(() => visualCaret.cloneRange()),
    })

    editor.dispatchEvent(new MouseEvent('pointerup', {
      bubbles: true,
      clientX: 120,
      clientY: 40,
    }))

    // Browsers fire mouseup after pointerup. Simulate a stale live selection
    // appearing between those events; mouseup must retain the visual position.
    const staleEnd = document.createRange()
    staleEnd.selectNodeContents(editor)
    staleEnd.collapse(false)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(staleEnd)
    editor.dispatchEvent(new MouseEvent('mouseup', {
      bubbles: true,
      clientX: 120,
      clientY: 40,
    }))

    await user.click(screen.getByRole('button', { name: 'Insert IPA symbol aw' }))

    expect(editor).toHaveTextContent('uawdɔjɔjɔjʒʍ→→tʃdʒmnnŋɔjɾhŋŋŋr→→əowɔj→→')

    if (originalCaretRangeFromPoint) {
      Object.defineProperty(document, 'caretRangeFromPoint', {
        configurable: true,
        value: originalCaretRangeFromPoint,
      })
    } else {
      delete document.caretRangeFromPoint
    }
  })

  it('keeps appending at the end when an idle selectionchange reports a stale position', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()

    for (const symbol of ['dʒ', 'm', 'm', 'r']) {
      await user.click(screen.getByRole('button', { name: `Insert IPA symbol ${symbol}` }))
    }
    expect(editor).toHaveTextContent('dʒmmr')

    const staleRange = document.createRange()
    staleRange.setStart(editor.firstChild, 1)
    staleRange.collapse(true)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(staleRange)
    document.dispatchEvent(new Event('selectionchange'))

    await user.click(screen.getByRole('button', { name: 'Insert IPA symbol r' }))

    expect(editor).toHaveTextContent('dʒmmrr')
  })

  it('does not corrupt the next insertion position when focus briefly moves', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()

    for (const symbol of ['dʒ', 'm', 'm', 'r', 'r']) {
      await user.click(screen.getByRole('button', { name: `Insert IPA symbol ${symbol}` }))
    }
    expect(editor).toHaveTextContent('dʒmmrr')

    const misleadingRange = document.createRange()
    misleadingRange.setStart(editor.firstChild, 1)
    misleadingRange.collapse(true)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(misleadingRange)
    screen.getByRole('button', { name: 'Clear' }).focus()

    await user.click(screen.getByRole('button', { name: 'Insert IPA symbol n' }))
    await user.click(screen.getByRole('button', { name: 'Insert IPA symbol m' }))

    expect(editor).toHaveTextContent('dʒmmrrnm')
  })

  it('captures a manually moved live caret immediately before an IPA key click', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()

    editor.textContent = 'abcdef'
    editor.focus()
    const endRange = document.createRange()
    endRange.selectNodeContents(editor)
    endRange.collapse(false)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(endRange)
    editor.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

    const movedRange = document.createRange()
    editor.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    movedRange.setStart(editor.firstChild, 2)
    movedRange.collapse(true)
    selection.removeAllRanges()
    selection.addRange(movedRange)
    finishPointerSelection(editor)

    await user.click(screen.getByRole('button', { name: 'Insert IPA symbol ʃ' }))

    expect(editor).toHaveTextContent('abʃcdef')
  })

  it('keeps a moved cursor between m and n even if the editor blurs before inserting a', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()
    editor.textContent = 'dʒmnŋrɑɑɑ'
    saveCaretAtEnd(editor)

    editor.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    editor.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    setCaretOffset(editor, 3)
    finishPointerSelection(editor)
    editor.dispatchEvent(new FocusEvent('blur', { bubbles: true }))

    await user.click(screen.getByRole('button', { name: 'Insert IPA symbol a' }))

    expect(editor).toHaveTextContent('dʒmanŋrɑɑɑ')
  })

  it('keeps the user-selected offset when formatting state moves the live selection elsewhere', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()
    editor.textContent = 'abcdef'
    saveCaretAtEnd(editor)

    const chosenRange = document.createRange()
    chosenRange.setStart(editor.firstChild, 2)
    chosenRange.collapse(true)
    const originalCaretRangeFromPoint = document.caretRangeFromPoint
    Object.defineProperty(document, 'caretRangeFromPoint', {
      configurable: true,
      value: vi.fn(() => chosenRange.cloneRange()),
    })
    editor.dispatchEvent(new MouseEvent('pointerup', {
      bubbles: true,
      clientX: 120,
      clientY: 40,
    }))
    editor.dispatchEvent(new MouseEvent('mouseup', {
      bubbles: true,
      clientX: 120,
      clientY: 40,
    }))

    const staleEndRange = document.createRange()
    staleEndRange.selectNodeContents(editor)
    staleEndRange.collapse(false)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(staleEndRange)

    await user.click(screen.getByRole('button', { name: 'Insert IPA symbol m' }))

    expect(editor).toHaveTextContent('abmcdef')

    if (originalCaretRangeFromPoint) {
      Object.defineProperty(document, 'caretRangeFromPoint', {
        configurable: true,
        value: originalCaretRangeFromPoint,
      })
    } else {
      delete document.caretRangeFromPoint
    }
  })

  describe('cursor regression scenarios', () => {
    it.each([
      ['m', 'abmcdef'],
      ['n', 'abncdef'],
      ['r', 'abrcdef'],
      ['ʃ', 'abʃcdef'],
      ['ŋ', 'abŋcdef'],
      ['ə', 'abəcdef'],
      ['aw', 'abawcdef'],
      ['dʒ', 'abdʒcdef'],
    ])('inserts %s between b and c after moving from the end', async (symbol, expected) => {
      const user = userEvent.setup()
      render(<IPAKeyboard />)
      const editor = getEditor()
      editor.textContent = 'abcdef'
      saveCaretAtEnd(editor)

      editor.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
      setCaretOffset(editor, 2)
      finishPointerSelection(editor)
      await user.click(screen.getByRole('button', { name: `Insert IPA symbol ${symbol}` }))

      expect(editor).toHaveTextContent(expected)
    })

    it.each([
      ['dʒmmrr', 'r'],
      ['dʒmmrr', 'm'],
      ['dʒmmrr', 'n'],
      ['mnŋrrmmnn', 'ŋ'],
      ['tʃdʒmnŋrwjl', 'm'],
    ])('keeps the end of %s after an idle stale selection when inserting %s', async (initial, symbol) => {
      const user = userEvent.setup()
      render(<IPAKeyboard />)
      const editor = getEditor()
      editor.textContent = initial
      saveCaretAtEnd(editor)

      setCaretOffset(editor, 1)
      document.dispatchEvent(new Event('selectionchange'))
      await user.click(screen.getByRole('button', { name: `Insert IPA symbol ${symbol}` }))

      expect(editor).toHaveTextContent(`${initial}${symbol}`)
    })

    it('inserts ə between t and ʒ in a long consonant sequence', async () => {
      const user = userEvent.setup()
      render(<IPAKeyboard />)
      const editor = getEditor()
      editor.textContent = 'tʒhhdʒmnŋrwjlʊʊʊ'
      saveCaretAtEnd(editor)

      editor.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
      setCaretOffset(editor, 1)
      finishPointerSelection(editor)
      await user.click(screen.getByRole('button', { name: 'Insert IPA symbol ə' }))

      expect(editor).toHaveTextContent('təʒhhdʒmnŋrwjlʊʊʊ')
    })

    it('inserts aw between u and d in a long mixed IPA sequence', async () => {
      const user = userEvent.setup()
      render(<IPAKeyboard />)
      const editor = getEditor()
      editor.textContent = 'udɔjɔjɔjʒʍ→→tʃdʒmnnŋɔjɾhŋŋŋr→→əowɔj→→'
      saveCaretAtEnd(editor)

      editor.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
      setCaretOffset(editor, 1)
      finishPointerSelection(editor)
      await user.click(screen.getByRole('button', { name: 'Insert IPA symbol aw' }))

      expect(editor).toHaveTextContent('uawdɔjɔjɔjʒʍ→→tʃdʒmnnŋɔjɾhŋŋŋr→→əowɔj→→')
    })

    it('supports several deliberate cursor moves without reverting to an older position', async () => {
      const user = userEvent.setup()
      render(<IPAKeyboard />)
      const editor = getEditor()
      editor.textContent = 'abcdef'
      saveCaretAtEnd(editor)

      editor.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
      setCaretOffset(editor, 2)
      finishPointerSelection(editor)
      await user.click(screen.getByRole('button', { name: 'Insert IPA symbol m' }))
      expect(editor).toHaveTextContent('abmcdef')

      editor.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
      setCaretOffset(editor, 1)
      finishPointerSelection(editor)
      await user.click(screen.getByRole('button', { name: 'Insert IPA symbol n' }))
      expect(editor).toHaveTextContent('anbmcdef')

      editor.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
      setCaretOffset(editor, 2)
      finishPointerSelection(editor)
      await user.click(screen.getByRole('button', { name: 'Insert IPA symbol r' }))
      expect(editor).toHaveTextContent('anrbmcdef')
    })

    it('continues appending many consonants despite repeated stale idle selections', async () => {
      const user = userEvent.setup()
      render(<IPAKeyboard />)
      const editor = getEditor()

      for (const symbol of ['dʒ', 'm', 'm', 'r', 'r', 'n', 'm', 'ŋ', 'r', 'm', 'n']) {
        await user.click(screen.getByRole('button', { name: `Insert IPA symbol ${symbol}` }))

        const staleRange = document.createRange()
        staleRange.selectNodeContents(editor)
        staleRange.collapse(true)
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(staleRange)
        document.dispatchEvent(new Event('selectionchange'))
      }

      expect(editor).toHaveTextContent('dʒmmrrnmŋrmn')
    })
  })

  describe('text selection formatting regressions', () => {
    it.each([
      ['bold', /bold selected text/i],
      ['italic', /italicize selected text/i],
      ['underline', /underline selected text/i],
    ])('keeps highlighted text selected until %s is applied', async (command, buttonName) => {
      const user = userEvent.setup()
      render(<IPAKeyboard />)
      const editor = getEditor()
      editor.textContent = 'abcdef'
      editor.focus()

      const selectedRange = document.createRange()
      selectedRange.setStart(editor.firstChild, 1)
      selectedRange.setEnd(editor.firstChild, 4)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(selectedRange)

      editor.dispatchEvent(new MouseEvent('pointerup', {
        bubbles: true,
        clientX: 200,
        clientY: 40,
      }))
      editor.dispatchEvent(new MouseEvent('mouseup', {
        bubbles: true,
        clientX: 200,
        clientY: 40,
      }))

      expect(selection.toString()).toBe('bcd')
      await user.click(screen.getByRole('button', { name: buttonName }))

      expect(document.execCommand).toHaveBeenCalledWith(command, false)
      expect(selection.isCollapsed).toBe(false)
      expect(selection.toString()).toBe('bcd')
      expect(screen.getByRole('button', { name: buttonName })).toHaveAttribute('aria-pressed', 'true')
    })

    it('preserves the exact highlighted portion rather than collapsing to the release point', () => {
      render(<IPAKeyboard />)
      const editor = getEditor()
      editor.textContent = 'select only these words'
      editor.focus()

      const selectedRange = document.createRange()
      selectedRange.setStart(editor.firstChild, 7)
      selectedRange.setEnd(editor.firstChild, 17)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(selectedRange)

      editor.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }))
      editor.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

      expect(selection.toString()).toBe('only these')
      expect(selection.isCollapsed).toBe(false)
    })

    it('restores a middle selection in a long IPA string before applying bold', async () => {
      const user = userEvent.setup()
      render(<IPAKeyboard />)
      const editor = getEditor()
      const ipaText = 'uejɛəoawawawawawawawawawawawawwʌɔj'
      editor.textContent = ipaText
      editor.focus()

      const selectionStart = 6
      const selectionEnd = 26
      const expectedSelection = ipaText.slice(selectionStart, selectionEnd)
      const selectedRange = document.createRange()
      selectedRange.setStart(editor.firstChild, selectionStart)
      selectedRange.setEnd(editor.firstChild, selectionEnd)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(selectedRange)
      editor.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }))
      editor.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

      let selectionWhenBoldRan = ''
      document.execCommand.mockImplementation((command) => {
        if (command === 'bold') selectionWhenBoldRan = window.getSelection().toString()
        return true
      })

      await user.click(screen.getByRole('button', { name: /bold selected text/i }))

      expect(selectionWhenBoldRan).toBe(expectedSelection)
      expect(selectionWhenBoldRan).not.toBe('')
    })

    it.each([
      ['beginning', 0, 6, /bold selected text/i, 'bold'],
      ['middle', 8, 24, /bold selected text/i, 'bold'],
      ['end', 27, 34, /bold selected text/i, 'bold'],
      ['middle italic', 5, 19, /italicize selected text/i, 'italic'],
      ['middle underline', 10, 28, /underline selected text/i, 'underline'],
    ])('formats a selection at the %s of a long IPA transcription', async (
      _location,
      selectionStart,
      selectionEnd,
      buttonName,
      command,
    ) => {
      const user = userEvent.setup()
      render(<IPAKeyboard />)
      const editor = getEditor()
      const ipaText = 'uejɛəoawawawawawawawawawawawawwʌɔj'
      editor.textContent = ipaText
      editor.focus()

      const selectedRange = document.createRange()
      selectedRange.setStart(editor.firstChild, selectionStart)
      selectedRange.setEnd(editor.firstChild, selectionEnd)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(selectedRange)
      editor.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }))
      editor.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

      let formattedSelection = ''
      document.execCommand.mockImplementation((receivedCommand) => {
        if (receivedCommand === command) formattedSelection = window.getSelection().toString()
        return true
      })

      await user.click(screen.getByRole('button', { name: buttonName }))

      expect(formattedSelection).toBe(ipaText.slice(selectionStart, selectionEnd))
    })

    it('preserves a selection spanning several separately inserted IPA nodes', async () => {
      const user = userEvent.setup()
      render(<IPAKeyboard />)
      const editor = getEditor()

      for (const symbol of ['dʒ', 'm', 'n', 'ŋ', 'aw', 'ə']) {
        await user.click(screen.getByRole('button', { name: `Insert IPA symbol ${symbol}` }))
      }
      expect(editor).toHaveTextContent('dʒmnŋawə')

      const selectedRange = document.createRange()
      selectedRange.setStart(editor.childNodes[0], 1)
      selectedRange.setEnd(editor.childNodes[4], 2)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(selectedRange)
      editor.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }))
      editor.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

      let selectionWhenBoldRan = ''
      document.execCommand.mockImplementation((command) => {
        if (command === 'bold') selectionWhenBoldRan = window.getSelection().toString()
        return true
      })

      await user.click(screen.getByRole('button', { name: /bold selected text/i }))

      expect(selectionWhenBoldRan).toBe('ʒmnŋaw')
    })

    it('can apply bold and then reselect the same IPA portion for italic', async () => {
      const user = userEvent.setup()
      render(<IPAKeyboard />)
      const editor = getEditor()
      editor.textContent = 'tʃdʒmnŋrwjləawɔj'
      editor.focus()

      const selectedRange = document.createRange()
      selectedRange.setStart(editor.firstChild, 4)
      selectedRange.setEnd(editor.firstChild, 12)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(selectedRange)
      editor.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }))
      editor.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

      const formattedSelections = []
      document.execCommand.mockImplementation((command) => {
        if (command === 'bold' || command === 'italic') {
          formattedSelections.push([command, window.getSelection().toString()])
        }
        return true
      })

      await user.click(screen.getByRole('button', { name: /bold selected text/i }))

      const italicRange = document.createRange()
      italicRange.setStart(editor.firstChild, 4)
      italicRange.setEnd(editor.firstChild, 12)
      selection.removeAllRanges()
      selection.addRange(italicRange)
      editor.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }))
      editor.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
      await user.click(screen.getByRole('button', { name: /italicize selected text/i }))

      expect(formattedSelections).toEqual([
        ['bold', 'mnŋrwjlə'],
        ['italic', 'mnŋrwjlə'],
      ])
    })

    it('does not replace or shorten text while applying formatting', async () => {
      const user = userEvent.setup()
      render(<IPAKeyboard />)
      const editor = getEditor()
      const originalText = 'dʒmmrrnmŋrmnəawɔj'
      editor.textContent = originalText
      editor.focus()

      const selectedRange = document.createRange()
      selectedRange.setStart(editor.firstChild, 3)
      selectedRange.setEnd(editor.firstChild, 13)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(selectedRange)
      editor.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }))
      editor.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

      await user.click(screen.getByRole('button', { name: /underline selected text/i }))

      expect(editor).toHaveTextContent(originalText)
    })

    it.each([
      ['bold', /bold selected text/i],
      ['italic', /italicize selected text/i],
      ['underline', /underline selected text/i],
    ])('keeps the blue selection available after applying %s', async (
      _command,
      buttonName,
    ) => {
      const user = userEvent.setup()
      render(<IPAKeyboard />)
      const editor = getEditor()
      editor.textContent = 'abcdef'
      editor.focus()

      const selectedRange = document.createRange()
      selectedRange.setStart(editor.firstChild, 1)
      selectedRange.setEnd(editor.firstChild, 4)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(selectedRange)
      editor.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }))
      editor.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

      const formatButton = screen.getByRole('button', { name: buttonName })
      await user.click(formatButton)

      expect(selection.isCollapsed).toBe(false)
      expect(selection.toString()).toBe('bcd')
      expect(formatButton).toHaveAttribute('aria-pressed', 'true')
    })

    it('applies bold, italic, and underline to one selection without reselecting it', async () => {
      const user = userEvent.setup()
      render(<IPAKeyboard />)
      const editor = getEditor()
      editor.textContent = 'abcdef'
      editor.focus()

      const range = document.createRange()
      range.setStart(editor.firstChild, 1)
      range.setEnd(editor.firstChild, 4)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      fireEvent.mouseUp(editor)

      for (const name of [
        /bold selected text/i,
        /italicize selected text/i,
        /underline selected text/i,
      ]) {
        await user.click(screen.getByRole('button', { name }))
        expect(selection.toString()).toBe('bcd')
      }

      expect(document.execCommand).toHaveBeenCalledWith('bold', false)
      expect(document.execCommand).toHaveBeenCalledWith('italic', false)
      expect(document.execCommand).toHaveBeenCalledWith('underline', false)
    })

    const formatButtons = {
      bold: /bold selected text/i,
      italic: /italicize selected text/i,
      underline: /underline selected text/i,
    }

    it.each([
      ['bold → italic → underline', ['bold', 'italic', 'underline']],
      ['bold → underline → italic', ['bold', 'underline', 'italic']],
      ['italic → bold → underline', ['italic', 'bold', 'underline']],
      ['italic → underline → bold', ['italic', 'underline', 'bold']],
      ['underline → bold → italic', ['underline', 'bold', 'italic']],
      ['underline → italic → bold', ['underline', 'italic', 'bold']],
    ])('preserves one selection while applying formats in the order %s', async (
      _description,
      order,
    ) => {
      const user = userEvent.setup()
      render(<IPAKeyboard />)
      const editor = getEditor()
      const originalText = 'tʃdʒmnŋrwjləawɔj'
      editor.textContent = originalText
      editor.focus()

      const range = document.createRange()
      range.setStart(editor.firstChild, 4)
      range.setEnd(editor.firstChild, 12)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      fireEvent.mouseUp(editor)

      for (const format of order) {
        await user.click(screen.getByRole('button', { name: formatButtons[format] }))
        expect(selection.toString()).toBe('mnŋrwjlə')
        expect(editor).toHaveTextContent(originalText)
      }

      for (const format of Object.keys(formatButtons)) {
        expect(screen.getByRole('button', { name: formatButtons[format] }))
          .toHaveAttribute('aria-pressed', 'true')
      }
    })

    it.each([
      ['bold', ['italic', 'underline']],
      ['italic', ['bold', 'underline']],
      ['underline', ['bold', 'italic']],
    ])('can turn off only %s while retaining the selection and other formats', async (
      formatToRemove,
      formatsToKeep,
    ) => {
      const user = userEvent.setup()
      render(<IPAKeyboard />)
      const editor = getEditor()
      editor.textContent = 'abcdef'
      editor.focus()

      const range = document.createRange()
      range.setStart(editor.firstChild, 1)
      range.setEnd(editor.firstChild, 5)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      fireEvent.mouseUp(editor)

      for (const format of Object.keys(formatButtons)) {
        await user.click(screen.getByRole('button', { name: formatButtons[format] }))
      }
      await user.click(screen.getByRole('button', { name: formatButtons[formatToRemove] }))

      expect(selection.toString()).toBe('bcde')
      expect(screen.getByRole('button', { name: formatButtons[formatToRemove] }))
        .toHaveAttribute('aria-pressed', 'false')
      for (const format of formatsToKeep) {
        expect(screen.getByRole('button', { name: formatButtons[format] }))
          .toHaveAttribute('aria-pressed', 'true')
      }
    })

    it.each([
      ['beginning', 0, 8],
      ['middle', 12, 25],
      ['end', 29, 37],
    ])('stacks all formats on a selection at the %s of a long IPA string', async (
      _position,
      start,
      end,
    ) => {
      const user = userEvent.setup()
      render(<IPAKeyboard />)
      const editor = getEditor()
      const originalText = 'udɔjɔjɔjʒʍ→→tʃdʒmnnŋɔjɾhŋŋŋr→→əowɔj→→'
      editor.textContent = originalText
      editor.focus()

      const range = document.createRange()
      range.setStart(editor.firstChild, start)
      range.setEnd(editor.firstChild, end)
      const expectedSelection = originalText.slice(start, end)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      fireEvent.mouseUp(editor)

      for (const format of Object.keys(formatButtons)) {
        await user.click(screen.getByRole('button', { name: formatButtons[format] }))
        expect(selection.toString()).toBe(expectedSelection)
      }

      expect(editor).toHaveTextContent(originalText)
      expect(selection.isCollapsed).toBe(false)
    })

  })

  it('clears all text from the editor', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()

    await user.click(editor)
    await user.keyboard('hɛlo')
    await user.click(screen.getByRole('button', { name: 'Clear' }))

    expect(editor).toBeEmptyDOMElement()
  })

  it('safely clears an editor that is already empty', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)

    await user.click(screen.getByRole('button', { name: 'Clear' }))

    expect(getEditor()).toBeEmptyDOMElement()
  })

  it('changes among the available editor text sizes', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()
    const sizeSelector = screen.getByLabelText(/text size/i)

    expect(editor).toHaveClass('ipa-editor-medium')
    await user.selectOptions(sizeSelector, 'large')
    expect(editor).toHaveClass('ipa-editor-large')
    await user.selectOptions(sizeSelector, 'small')
    expect(editor).toHaveClass('ipa-editor-small')
  })

  it('exposes an accessible multiline editor and labelled controls', () => {
    render(<IPAKeyboard />)
    const editor = getEditor()

    expect(editor).toHaveAttribute('contenteditable', 'true')
    expect(editor).toHaveAttribute('aria-multiline', 'true')
    expect(screen.getByRole('toolbar', { name: /text formatting/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /bold selected text/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /italicize selected text/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /underline selected text/i })).toBeInTheDocument()
  })

  it.each([
    ['bold', /bold selected text/i],
    ['italic', /italicize selected text/i],
    ['underline', /underline selected text/i],
  ])('toggles %s formatting and its pressed state', async (command, accessibleName) => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const button = screen.getByRole('button', { name: accessibleName })

    expect(button).toHaveAttribute('aria-pressed', 'false')
    await user.click(button)
    expect(document.execCommand).toHaveBeenCalledWith(command, false)
    expect(button).toHaveAttribute('aria-pressed', 'true')
    await user.click(button)
    expect(button).toHaveAttribute('aria-pressed', 'false')
  })

  it.each([
    ['strong', /bold selected text/i],
    ['em', /italicize selected text/i],
    ['u', /underline selected text/i],
  ])('updates the %s indicator when the caret moves between formatted and plain text', (
    tagName,
    accessibleName,
  ) => {
    render(<IPAKeyboard />)
    const editor = getEditor()
    editor.innerHTML = `<${tagName}>formatted</${tagName}> plain`
    const formattedText = editor.querySelector(tagName).firstChild
    const plainText = editor.lastChild
    const selection = window.getSelection()
    const range = document.createRange()

    range.setStart(formattedText, 3)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
    fireEvent.mouseUp(editor)
    expect(screen.getByRole('button', { name: accessibleName })).toHaveAttribute('aria-pressed', 'true')

    range.setStart(plainText, 2)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
    fireEvent.mouseUp(editor)
    expect(screen.getByRole('button', { name: accessibleName })).toHaveAttribute('aria-pressed', 'false')
  })

  it('wraps selected text in phonemic slashes', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()
    editor.textContent = 'test'
    selectEditorText(editor)

    await user.click(screen.getByRole('button', { name: /wrap selected text in slashes/i }))

    expect(editor).toHaveTextContent('/test/')
  })

  it('wraps selected text in phonetic square brackets', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()
    editor.textContent = 'test'
    selectEditorText(editor)

    await user.click(screen.getByRole('button', { name: /wrap selected text in square brackets/i }))

    expect(editor).toHaveTextContent('[test]')
  })

  it('undoes and redoes an inserted IPA symbol', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()

    await user.click(screen.getByRole('button', { name: 'Insert IPA symbol ʃ' }))
    expect(editor).toHaveTextContent('ʃ')
    await user.click(screen.getByRole('button', { name: /undo one step/i }))
    expect(editor).toBeEmptyDOMElement()
    await user.click(screen.getByRole('button', { name: /redo one step/i }))
    expect(editor).toHaveTextContent('ʃ')
  })

  it('does nothing when Undo or Redo is clicked without any history', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()

    await user.click(screen.getByRole('button', { name: /undo one step/i }))
    expect(editor).toBeEmptyDOMElement()

    await user.click(screen.getByRole('button', { name: /redo one step/i }))
    expect(editor).toBeEmptyDOMElement()
  })

  it('moves backward and forward through several symbol insertions', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()
    const undo = screen.getByRole('button', { name: /undo one step/i })
    const redo = screen.getByRole('button', { name: /redo one step/i })

    for (const symbol of ['p', 'ʃ', 'ŋ']) {
      await user.click(screen.getByRole('button', { name: `Insert IPA symbol ${symbol}` }))
    }
    expect(editor).toHaveTextContent('pʃŋ')

    await user.click(undo)
    expect(editor).toHaveTextContent('pʃ')
    await user.click(undo)
    expect(editor).toHaveTextContent('p')

    await user.click(redo)
    expect(editor).toHaveTextContent('pʃ')
    await user.click(redo)
    expect(editor).toHaveTextContent('pʃŋ')
  })

  it('restores cleared text with Undo and clears it again with Redo', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()

    await user.click(editor)
    await user.keyboard('hɛlo')
    await user.click(screen.getByRole('button', { name: 'Clear' }))
    expect(editor).toBeEmptyDOMElement()

    await user.click(screen.getByRole('button', { name: /undo one step/i }))
    expect(editor).toHaveTextContent('hɛlo')

    await user.click(screen.getByRole('button', { name: /redo one step/i }))
    expect(editor).toBeEmptyDOMElement()
  })

  it('clears the redo history after a new edit is made', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()

    await user.click(screen.getByRole('button', { name: 'Insert IPA symbol p' }))
    await user.click(screen.getByRole('button', { name: /undo one step/i }))
    expect(editor).toBeEmptyDOMElement()

    await user.click(screen.getByRole('button', { name: 'Insert IPA symbol t' }))
    await user.click(screen.getByRole('button', { name: /redo one step/i }))

    expect(editor).toHaveTextContent('t')
    expect(editor).not.toHaveTextContent('p')
  })

  it.each(['small', 'medium', 'large'])(
    'keeps the %s text size after Undo, Redo, typing, and symbol insertion',
    async (size) => {
      const user = userEvent.setup()
      render(<IPAKeyboard />)
      const editor = getEditor()
      const expectedClass = `ipa-editor-${size}`

      await user.selectOptions(screen.getByLabelText(/text size/i), size)
      await user.click(screen.getByRole('button', { name: 'Insert IPA symbol p' }))
      await user.click(screen.getByRole('button', { name: /undo one step/i }))
      expect(editor).toHaveClass(expectedClass)

      await user.click(screen.getByRole('button', { name: /redo one step/i }))
      expect(editor).toHaveClass(expectedClass)

      await user.click(editor)
      await user.keyboard('test')
      await user.click(screen.getByRole('button', { name: 'Insert IPA symbol ŋ' }))

      expect(editor).toHaveClass(expectedClass)
      expect(editor).not.toHaveAttribute('style')
      expect(editor.querySelector('[style*="font-size"], font[size]')).toBeNull()
    },
  )

  it.each([
    ['bold', /bold selected text/i],
    ['italic', /italicize selected text/i],
    ['underline', /underline selected text/i],
  ])('resets %s typing state after using an arrow', async (_format, accessibleName) => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const formatButton = screen.getByRole('button', { name: accessibleName })

    await user.click(formatButton)
    expect(formatButton).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'Insert IPA symbol p' }))
    await user.click(screen.getByRole('button', { name: /undo one step/i }))

    expect(formatButton).toHaveAttribute('aria-pressed', 'false')

    await user.click(getEditor())
    await user.keyboard('a')
    expect(formatButton).toHaveAttribute('aria-pressed', 'false')
  })

  it('keeps one consistent size through repeated arrow and letter sequences', async () => {
    const user = userEvent.setup()
    render(<IPAKeyboard />)
    const editor = getEditor()
    const undo = screen.getByRole('button', { name: /undo one step/i })
    const redo = screen.getByRole('button', { name: /redo one step/i })

    await user.selectOptions(screen.getByLabelText(/text size/i), 'large')
    await user.click(editor)
    await user.keyboard('abc')

    for (let step = 0; step < 3; step += 1) {
      await user.click(undo)
      await user.click(redo)
      await user.click(editor)
      await user.keyboard('x')
      expect(editor).toHaveClass('ipa-editor-large')
      expect(editor.querySelector('[style*="font-size"], font[size]')).toBeNull()
    }
  })

  it('copies non-empty editor content to the clipboard', async () => {
    const user = userEvent.setup()
    const clipboardWrite = vi.fn().mockResolvedValue(undefined)
    const originalClipboardItem = globalThis.ClipboardItem
    globalThis.ClipboardItem = class ClipboardItem {
      constructor(data) {
        this.data = data
      }
    }
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { write: clipboardWrite },
    })

    render(<IPAKeyboard />)
    const editor = getEditor()
    editor.innerText = 'ʃəŋ'

    await user.click(screen.getByRole('button', { name: 'Copy all' }))

    expect(clipboardWrite).toHaveBeenCalledOnce()
    expect(await clipboardWrite.mock.calls[0][0][0].data['text/plain'].text()).toBe('ʃəŋ')
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument()
    globalThis.ClipboardItem = originalClipboardItem
  })

  it('does not write to the clipboard when the editor is empty', async () => {
    const user = userEvent.setup()
    const clipboardWrite = vi.fn()
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { write: clipboardWrite },
    })

    render(<IPAKeyboard />)
    await user.click(screen.getByRole('button', { name: 'Copy all' }))

    expect(clipboardWrite).not.toHaveBeenCalled()
  })
})
