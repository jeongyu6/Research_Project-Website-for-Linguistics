import { useEffect, useMemo, useRef, useState } from 'react'
import utscLogo from '../../Pictures/UTSC_logo.png'
//Got inspiration from the github: https://github.com/frekky/TreeForm.git



const horizontalGap = 112
const verticalGap = 98
const nodeWidth = 82
const nodeHeight = 36
const canvasMargin = 220
const branchStartClearance = 18
const branchEndClearance = 10
const minBranchDrop = 34
let nodeCounter = 0
let movementCounter = 0
const commonConstituentLabels = ['NP', 'VP', 'TP', 'CP', 'DP', 'PP', 'AdjP', 'AdvP', 'IP', 'XP']

// Buttons to create were for:
// node down, node up, terminal, triangle,
// case, theta roles, feature, unary, binary,
// ternary, adjuct, X-bar, movement, link features
// add feature

const treeTemplates = [
  { key: 'F1', label: 'Node Down', preview: ['|', 'X'], previewStyle: 'nodeDown', action: 'nodeDown' },
  { key: 'F2', label: 'Node Up', preview: ['X', '|'], action: 'nodeUp' },
  { key: 'F3', label: 'Terminal', preview: ['|', 'text'], action: 'terminal' },
  { key: 'F4', label: 'Triangle', preview: ['△', 'text'], action: 'triangle' },
  { key: 'F5', label: 'Case', preview: ['[+CASE]'], action: 'case' },
  { key: 'F6', label: 'Theta Roles', preview: ['<θ,θ>'], action: 'theta' },
  { key: 'F7', label: 'Feature', preview: ['+FEATURE'], action: 'feature' },
  { key: 'F8', label: 'Unary', preview: ['XP', '|', 'X'], action: 'unary' },
  { key: 'F9', label: 'Binary', preview: [' XP ', '/ \\', 'X   Y'], action: 'binary' },
  { key: 'F10', label: 'Ternary', preview: [' XP ', '/ | \\', 'X Y Z'], action: 'ternary' },
  { key: 'F11', label: 'Adjunct', preview: ['XP', '/ \\', 'Adj XP'], action: 'adjunct' },
  { key: 'F12', label: 'X-Bar', preview: ['XP', '/ \\', "Spec X'"], action: 'xbar' },
  { key: '', label: 'Movement', preview: ['XP -> t'], action: 'movement' },
  { key: '', label: 'Link Feature', preview: ['X <θ>'], action: 'linkFeature' },
]

function createNode(label = 'XP', options = {}) {
  nodeCounter += 1
  return {
    id: `node-${Date.now()}-${nodeCounter}`,
    label,
    features: [],
    children: [],
    ...options,
  }
}

function findNode(node, id) {
  if (!node) return null
  if (node.id === id) return node
  for (const child of node.children || []) {
    const found = findNode(child, id)
    if (found) return found
  }
  return null
}

function updateNode(node, id, updater) {
  if (node.id === id) return updater(node)
  return {
    ...node,
    children: (node.children || []).map((child) => updateNode(child, id, updater)),
  }
}

function removeNode(node, id) {
  return {
    ...node,
    children: (node.children || [])
      .filter((child) => child.id !== id)
      .map((child) => removeNode(child, id)),
  }
}

function collectNodeIds(node, ids = new Set()) {
  if (!node) return ids
  ids.add(node.id)
  for (const child of node.children || []) {
    collectNodeIds(child, ids)
  }
  return ids
}

function flipSubtree(node) {
  return {
    ...node,
    children: (node.children || []).map(flipSubtree).reverse(),
  }
}

function measureTree(node) {
  if (!node.children?.length) return horizontalGap
  return Math.max(horizontalGap, node.children.reduce((sum, child) => sum + measureTree(child), 0))
}

function getNodeVisualBottom(node) {
  const featureCount = node.features?.length || 0

  if (node.shape === 'triangle') {
    const labelBottom = nodeHeight / 2 + 28
    if (!featureCount) return labelBottom
    return nodeHeight / 2 + 46 + (featureCount - 1) * 18
  }

  if (!featureCount) return nodeHeight / 2
  return nodeHeight / 2 + 24 + (featureCount - 1) * 18
}

function getNodeVisualTop() {
  return -nodeHeight / 2
}

function getDepthMetrics(node, depth = 0, metrics = []) {
  const visualTop = getNodeVisualTop(node)
  const visualBottom = getNodeVisualBottom(node)
  const currentMetrics = metrics[depth] || { top: visualTop, bottom: visualBottom }
  metrics[depth] = {
    top: Math.min(currentMetrics.top, visualTop),
    bottom: Math.max(currentMetrics.bottom, visualBottom),
  }

  for (const child of node.children || []) {
    getDepthMetrics(child, depth + 1, metrics)
  }

  return metrics
}

function getDepthOffsets(depthMetrics) {
  const offsets = [34]

  for (let depth = 1; depth < depthMetrics.length; depth += 1) {
    const previousMetrics = depthMetrics[depth - 1] || { top: -nodeHeight / 2, bottom: nodeHeight / 2 }
    const currentMetrics = depthMetrics[depth] || { top: -nodeHeight / 2, bottom: nodeHeight / 2 }
    const branchGap = previousMetrics.bottom - currentMetrics.top + branchStartClearance + branchEndClearance + minBranchDrop
    const rowGap = Math.max(verticalGap, branchGap)
    offsets[depth] = offsets[depth - 1] + rowGap
  }

  return offsets
}

function layoutTree(node, left = 0, depth = 0, nodes = [], edges = [], depthOffsets = getDepthOffsets(getDepthMetrics(node))) {
  const width = measureTree(node)
  const x = left + width / 2
  const y = depthOffsets[depth] || depth * verticalGap + 34
  nodes.push({ ...node, x, y, depth })

  let childLeft = left
  for (const child of node.children || []) {
    const childWidth = measureTree(child)
    const childX = childLeft + childWidth / 2
    const childY = depthOffsets[depth + 1] || (depth + 1) * verticalGap + 34
    edges.push({
      from: node.id,
      to: child.id,
      x1: x,
      y1: y + getNodeVisualBottom(node) + branchStartClearance,
      x2: childX,
      y2: childY + getNodeVisualTop(child) - branchEndClearance,
    })
    layoutTree(child, childLeft, depth + 1, nodes, edges, depthOffsets)
    childLeft += childWidth
  }

  const lastNodeBottom = nodes.reduce((bottom, currentNode) => Math.max(bottom, currentNode.y + getNodeVisualBottom(currentNode)), 0)
  return { nodes, edges, width, height: lastNodeBottom + 70 }
}

function getDepth(node) {
  if (!node.children?.length) return 0
  return 1 + Math.max(...node.children.map(getDepth))
}

function parseFeatureInput(value) {
  const features = []
  let currentFeature = ''
  let bracketDepth = 0
  let angleDepth = 0

  for (const character of value) {
    if (character === '[') bracketDepth += 1
    if (character === ']') bracketDepth = Math.max(0, bracketDepth - 1)
    if (character === '<') angleDepth += 1
    if (character === '>') angleDepth = Math.max(0, angleDepth - 1)

    const isSeparator = (character === ',' || character === ';' || character === '\n') && bracketDepth === 0 && angleDepth === 0
    if (isSeparator) {
      const feature = currentFeature.trim()
      if (feature) features.push(feature)
      currentFeature = ''
    } else {
      currentFeature += character
    }
  }

  const finalFeature = currentFeature.trim()
  if (finalFeature) features.push(finalFeature)

  return features
}

function FeatureLabel({ feature, y, onSelect, fontSize, fontFamily, fontWeight }) {
  return (
    <g className="feature-label" onClick={onSelect}>
      <text
        x="0"
        y={y}
        textAnchor="middle"
        fill="#475569"
        fontFamily={fontFamily}
        fontSize={Math.max(11, fontSize - 4)}
        fontWeight={fontWeight === '400' ? '500' : fontWeight}
      >
        {feature}
      </text>
      <line x1="-30" y1={y + 5} x2="30" y2={y + 5} stroke="#475569" strokeWidth="1.8" />
    </g>
  )
}

function getMovementAnchors(movement, nodePositions) {
  const fromNode = nodePositions.get(movement.from)
  const toNode = nodePositions.get(movement.to)
  if (!fromNode || !toNode) return null

  const startX = fromNode.x + (movement.startOffsetX || 0)
  const startY = fromNode.y + nodeHeight / 2 + 28 + Math.max((fromNode.features?.length || 1) - 1, 0) * 18 + (movement.startOffsetY || 0)
  const endX = toNode.x + (movement.endOffsetX || 0)
  const endY = toNode.y + nodeHeight / 2 + 18 + (movement.endOffsetY || 0)
  const defaultControlX = Math.min(startX, endX) - 78 + (movement.offsetX || 0)
  const defaultControlY = (startY + endY) / 2 + (movement.offsetY || 0)
  const controlX = movement.controlX ?? defaultControlX
  const controlY = movement.controlY ?? defaultControlY

  return {
    id: movement.id,
    startX,
    startY,
    controlX,
    controlY,
    endX,
    endY,
  }
}

function getMovementPath(movement, nodePositions) {
  const anchors = getMovementAnchors(movement, nodePositions)
  if (!anchors) return null

  return {
    ...anchors,
    d: `M ${anchors.startX} ${anchors.startY} Q ${anchors.controlX} ${anchors.controlY} ${anchors.endX} ${anchors.endY}`,
  }
}

function TreeNode({ node, selectedId, onSelect, fontSize, fontFamily, fontWeight }) {
  const isSelected = selectedId === node.id
  const isTriangle = node.shape === 'triangle'
  //Extra CSS class when the node isSelected; This it to allow for easier adding of special visual effects
  const nodeClassName = isSelected ? 'tree-node selected-tree-node' : 'tree-node'

  if (isTriangle) {
    return (
      //
      <g className={`${nodeClassName} triangle-node`} transform={`translate(${node.x}, ${node.y})`} onClick={() => onSelect(node.id)}>
        <polygon
          points={`0,${-nodeHeight / 2} ${-nodeWidth / 2},${nodeHeight / 2} ${nodeWidth / 2},${nodeHeight / 2}`}
          fill={isSelected ? '#1555c5' : 'transparent'}
          stroke={isSelected ? '#1555c5' : '#24324a'}
          strokeWidth={isSelected ? '4.8' : '3.2'}
        />
        <text
          x="0"
          y={nodeHeight / 2 + 20}
          textAnchor="middle"
          fill="#172033"
          fontFamily={fontFamily}
          fontSize={fontSize}
          fontWeight={fontWeight}
        >
          {node.label}
        </text>
        {node.features?.map((feature, index) => (
          <FeatureLabel
            key={`${node.id}-${feature}-${index}`}
            feature={feature}
            y={nodeHeight / 2 + 38 + index * 18}
            onSelect={() => onSelect(node.id)}
            fontSize={fontSize}
            fontFamily={fontFamily}
            fontWeight={fontWeight}
          />
        ))}
      </g>
    )
  }

  return (
    <g className={nodeClassName} transform={`translate(${node.x}, ${node.y})`}>
      <button type="button" aria-label={`Select ${node.label}`} tabIndex="-1" className="svg-button-reset" />
      <rect
        x={-nodeWidth / 2}
        y={-nodeHeight / 2}
        width={nodeWidth}
        height={nodeHeight}
        rx="6"
        fill={isSelected ? '#1555c5' : '#ffffff'}
        stroke={isSelected ? '#062d72' : '#24324a'}
        strokeWidth={isSelected ? '4.8' : '3'}
        onClick={() => onSelect(node.id)}
      />
      <text
        x="0"
        y="5"
        textAnchor="middle"
        fill={isSelected ? '#ffffff' : '#172033'}
        fontFamily={fontFamily}
        fontSize={fontSize}
        fontWeight={fontWeight}
        onClick={() => onSelect(node.id)}
      >
        {node.label}
      </text>
      {node.features?.map((feature, index) => (
        <FeatureLabel
          key={`${node.id}-${feature}-${index}`}
          feature={feature}
          y={nodeHeight / 2 + 16 + index * 18}
          onSelect={() => onSelect(node.id)}
          fontSize={fontSize}
          fontFamily={fontFamily}
          fontWeight={fontWeight}
        />
      ))}
    </g>
  )
}

function PreviewNode({ x, y, label, tone = 'light' }) {
  return (
    <g>
      <rect className={`preview-node preview-node-${tone}`} x={x - 18} y={y - 9} width="36" height="18" rx="7" />
      <text x={x} y={y + 4} textAnchor="middle">{label}</text>
    </g>
  )
}

function PreviewLine({ x1, y1, x2, y2 }) {
  return <line className="preview-line" x1={x1} y1={y1} x2={x2} y2={y2} />
}

function TemplateDiagram({ template }) {
  switch (template.action) {
    case 'nodeDown':
      return (
        <>
          <PreviewNode x={55} y={18} label="XP" tone="selected" />
          <PreviewLine x1={55} y1={28} x2={55} y2={45} />
          <PreviewNode x={55} y={56} label="X" />
        </>
      )
    case 'nodeUp':
      return (
        <>
          <PreviewNode x={55} y={18} label="XP" tone="selected" />
          <PreviewLine x1={55} y1={28} x2={55} y2={45} />
          <PreviewNode x={55} y={56} label="X" tone="muted" />
        </>
      )
    case 'terminal':
      return (
        <>
          <PreviewNode x={55} y={18} label="X" />
          <PreviewLine x1={55} y1={28} x2={55} y2={48} />
          <text className="preview-terminal" x={55} y={62} textAnchor="middle">text</text>
        </>
      )
    case 'triangle':
      return (
        <>
          <path className="preview-triangle" d="M55 22 L38 52 L72 52 Z" />
          <text className="preview-terminal" x={55} y={66} textAnchor="middle">text</text>
        </>
      )
    case 'unary':
      return (
        <>
          <PreviewNode x={55} y={18} label="XP" tone="selected" />
          <PreviewLine x1={55} y1={28} x2={55} y2={45} />
          <PreviewNode x={55} y={56} label="X" />
        </>
      )
    case 'binary':
      return (
        <>
          <PreviewNode x={55} y={17} label="XP" tone="selected" />
          <PreviewLine x1={55} y1={27} x2={35} y2={47} />
          <PreviewLine x1={55} y1={27} x2={75} y2={47} />
          <PreviewNode x={35} y={58} label="X" />
          <PreviewNode x={75} y={58} label="Y" />
        </>
      )
    case 'ternary':
      return (
        <>
          <PreviewNode x={55} y={16} label="XP" tone="selected" />
          <PreviewLine x1={55} y1={26} x2={27} y2={47} />
          <PreviewLine x1={55} y1={26} x2={55} y2={47} />
          <PreviewLine x1={55} y1={26} x2={83} y2={47} />
          <PreviewNode x={27} y={58} label="X" />
          <PreviewNode x={55} y={58} label="Y" />
          <PreviewNode x={83} y={58} label="Z" />
        </>
      )
    case 'adjunct':
      return (
        <>
          <PreviewNode x={55} y={17} label="XP" tone="selected" />
          <PreviewLine x1={55} y1={27} x2={34} y2={47} />
          <PreviewLine x1={55} y1={27} x2={76} y2={47} />
          <PreviewNode x={34} y={58} label="Adj" />
          <PreviewNode x={76} y={58} label="XP" />
        </>
      )
    case 'xbar':
      return (
        <>
          <PreviewNode x={55} y={14} label="XP" tone="selected" />
          <PreviewLine x1={55} y1={24} x2={31} y2={42} />
          <PreviewLine x1={55} y1={24} x2={77} y2={42} />
          <PreviewNode x={31} y={51} label="Spec" />
          <PreviewNode x={77} y={51} label="X'" />
          <PreviewLine x1={77} y1={60} x2={77} y2={70} />
        </>
      )
    case 'movement':
      return (
        <>
          <PreviewNode x={32} y={54} label="t" tone="muted" />
          <PreviewNode x={80} y={24} label="XP" tone="selected" />
          <path className="preview-arrow" d="M34 42 Q45 22 61 22" />
          <path className="preview-arrow-head" d="M60 17 L70 22 L60 27 Z" />
        </>
      )
    default:
      return null
  }
}

function TemplatePreview({ template }) {
  const diagramActions = new Set(['nodeDown', 'nodeUp', 'terminal', 'triangle', 'unary', 'binary', 'ternary', 'adjunct', 'xbar', 'movement'])

  if (diagramActions.has(template.action)) {
    return (
      <span className="template-preview template-diagram-preview" aria-hidden="true">
        <svg className="template-diagram" viewBox="0 0 110 76" focusable="false">
          <TemplateDiagram template={template} />
        </svg>
      </span>
    )
  }

  return (
    <span className="template-preview template-notation-preview" aria-hidden="true">
      {template.preview.map((line, index) => (
        <span key={`${template.label}-${line}-${index}`}>{line}</span>
      ))}
    </span>
  )
}

function getLabelChoice(label) {
  return commonConstituentLabels.includes(label) ? label : 'Other'
}

export default function SyntaxTreeBuilder() {
  const [tree, setTree] = useState(null)
  const [selectedId, setSelectedId] = useState('')
  const [labelInput, setLabelInput] = useState('S')
  const [childInput, setChildInput] = useState('XP')
  const [featureInput, setFeatureInput] = useState('')
  const [editingFeatureIndex, setEditingFeatureIndex] = useState(null)
  const [movementStartId, setMovementStartId] = useState('')
  const [movements, setMovements] = useState([])
  const [selectedMovementId, setSelectedMovementId] = useState('')
  const [draggedMovementHandle, setDraggedMovementHandle] = useState(null)
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false)
  const [isLectureMode, setIsLectureMode] = useState(false)
  const [lectureStep, setLectureStep] = useState(0)
  const [treeFontSize, setTreeFontSize] = useState(17)
  const [treeFontFamily, setTreeFontFamily] = useState("Georgia, 'Times New Roman', serif")
  const [treeFontWeight, setTreeFontWeight] = useState('700')
  //The original state will be 100% for 1, 115% for 1.15, 85% for 0.85
  const [zoomLevel, setZoomLevel] = useState(1)
  //undoStack stores older versions of the tree
  //redoStack stores versions versions you removed with undo to easily bring them back
  const [undoStack, setUndoStack] = useState([])
  const [redoStack, setRedoStack] = useState([])
  const [status, setStatus] = useState('')
  const svgRef = useRef(null)
  const canvasRef = useRef(null)
  const historyShortcutPressedRef = useRef(false)

  const selectedNode = findNode(tree, selectedId)
  const layout = useMemo(() => (tree ? layoutTree(tree) : { nodes: [], edges: [], width: 640, height: 420 }), [tree])
  const nodePositions = useMemo(() => new Map(layout.nodes.map((node) => [node.id, node])), [layout.nodes])
  const movementPaths = useMemo(
    () => movements.map((movement) => getMovementPath(movement, nodePositions)).filter(Boolean),
    [movements, nodePositions],
  )
  const selectedMovement = movements.find((movement) => movement.id === selectedMovementId)
  const maxLectureStep = tree ? getDepth(tree) : 0
  const visibleNodeIds = useMemo(() => new Set(
    layout.nodes
      .filter((node) => !isLectureMode || node.depth <= lectureStep)
      .map((node) => node.id),
  ), [isLectureMode, layout.nodes, lectureStep])
  const visibleEdges = layout.edges.filter((edge) => visibleNodeIds.has(edge.from) && visibleNodeIds.has(edge.to))
  const visibleNodes = layout.nodes.filter((node) => visibleNodeIds.has(node.id))
  const visibleMovementPaths = movementPaths.filter((movement) => visibleNodeIds.has(movements.find((item) => item.id === movement.id)?.from) && visibleNodeIds.has(movements.find((item) => item.id === movement.id)?.to))
  const canvasWidth = Math.max(layout.width + canvasMargin * 2, 860)
  const canvasHeight = Math.max(layout.height + canvasMargin, 560)
  const canvasOffsetX = Math.max((canvasWidth - layout.width) / 2, canvasMargin)
  //Brand uses a wider rectangle for its shape
  const brandLogoWidth = Math.min(330, canvasWidth * 0.38)
  const brandLogoHeight = brandLogoWidth * 0.4
  const brandPadding = 30
  const brandTextGap = -20
  const brandBlockX = canvasWidth - brandPadding - brandLogoWidth / 2
  const brandBlockY = canvasHeight - brandPadding - brandTextGap - brandLogoHeight / 2
  //It calculates the visible area based on zoom. 
  const viewBoxWidth = canvasWidth / zoomLevel
  const viewBoxHeight = canvasHeight / zoomLevel
  const viewBoxX = (canvasWidth - viewBoxWidth) / 2
  const viewBoxY = (canvasHeight - viewBoxHeight) / 2
  const viewBox = `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`

  //It saves the tree, movement arrows and etc and selected movement line. 
  function getEditorSnapshot() {
    return {
      tree: tree ? structuredClone(tree) : null,
      movements: structuredClone(movements),
      selectedId,
      labelInput,
      childInput,
      featureInput,
      editingFeatureIndex,
      movementStartId,
      selectedMovementId,
    }
  }

  
  function restoreEditorSnapshot(snapshot) {
    setTree(snapshot.tree ? structuredClone(snapshot.tree) : null)
    setMovements(structuredClone(snapshot.movements || []))
    setSelectedId(snapshot.selectedId || '')
    setLabelInput(snapshot.labelInput || 'S')
    setChildInput(snapshot.childInput || 'XP')
    setFeatureInput(snapshot.featureInput || '')
    setEditingFeatureIndex(snapshot.editingFeatureIndex ?? null)
    setMovementStartId(snapshot.movementStartId || '')
    setSelectedMovementId(snapshot.selectedMovementId || '')
    setDraggedMovementHandle(null)
  }

  //Function responsible for saving the current editor state
  function recordHistory() {
    setUndoStack((current) => [...current.slice(-49), getEditorSnapshot()])
    setRedoStack([])
  }

  //Undoing the edits
  function undoTreeEdit() {
    //Case 1: If there is nothing in undostack, it says "Nothing to undo".
    setUndoStack((current) => {
      if (!current.length) {
        setStatus('Nothing to undo.')
        return current
      }
      //Case 2: Otherwise, it takes the latest saved version
      //It saves the current version into redostack
      //It restores the previous version
      //It removes that previous version from undoStack
      const previousSnapshot = current[current.length - 1]
      setRedoStack((redoHistory) => [...redoHistory.slice(-49), getEditorSnapshot()])
      restoreEditorSnapshot(previousSnapshot)
      setStatus('Undid the last edit.')
      return current.slice(0, -1)
    })
  }

  function redoTreeEdit() {
    //Case 1: If there is nothing on redoStack, it says nothing to redo
    setRedoStack((current) => {
      if (!current.length) {
        setStatus('Nothing to redo.')
        return current
      }
      //Case 2: it takes the latest saved version; it saves the current version into redoStack; It restores the previous version and removes the previous version from undoStack
      const nextSnapshot = current[current.length - 1]
      setUndoStack((undoHistory) => [...undoHistory.slice(-49), getEditorSnapshot()])
      restoreEditorSnapshot(nextSnapshot)
      setStatus('Redid the edit.')
      return current.slice(0, -1)
    })
  }

  function createNewTree(label = labelInput.trim() || 'S') {
    recordHistory()
    const root = createNode(label)
    setTree(root)
    setSelectedId(root.id)
    setLabelInput(root.label)
    setMovementStartId('')
    setMovements([])
    setSelectedMovementId('')
    setStatus(`Created root node ${root.label}.`)
  }

  function selectNode(id) {
    const node = findNode(tree, id)
    if (movementStartId) {
      if (movementStartId === id) {
        setStatus('Choose a different destination node for movement.')
        return
      }
      recordHistory()
      movementCounter += 1
      const movementId = `movement-${Date.now()}-${movementCounter}`
      setMovements((current) => [...current, { id: movementId, from: movementStartId, to: id, offsetX: 0, offsetY: 0 }])
      setMovementStartId('')
      setSelectedMovementId(movementId)
      setSelectedId(id)
      setLabelInput(node?.label || '')
      setFeatureInput('')
      setEditingFeatureIndex(null)
      setStatus('Movement arrow added.')
      return
    }
    setSelectedMovementId('')
    setSelectedId(id)
    setLabelInput(node?.label || '')
    setFeatureInput('')
    setEditingFeatureIndex(null)
    setStatus('')
  }

  function addChild() {
    const label = childInput.trim() || 'XP'
    const newNode = createNode(label)
    if (!tree || !selectedId) {
      createNewTree(label)
      setChildInput('XP')
      return
    }
    recordHistory()
    setTree((current) => updateNode(current, selectedId, (node) => ({ ...node, children: [...(node.children || []), newNode] })))
    setSelectedId(newNode.id)
    setLabelInput(label)
    setChildInput('XP')
    setStatus(`Added ${label}.`)
  }

  function addTemplateChild(templateNode, message) {
    if (!tree || !selectedId) {
      recordHistory()
      setTree(templateNode)
      setSelectedId(templateNode.id)
      setLabelInput(templateNode.label)
      setMovementStartId('')
      setMovements([])
      setSelectedMovementId('')
      setStatus(`Created ${templateNode.label} as the root node.`)
      return
    }
    recordHistory()
    setTree((current) => updateNode(current, selectedId, (node) => ({ ...node, children: [...(node.children || []), templateNode] })))
    setSelectedId(templateNode.id)
    setLabelInput(templateNode.label)
    setStatus(message)
  }

  function addBranchChildren(children, message) {
    if (!tree || !selectedId) {
      addTemplateChild(createNode('XP', { children }), message)
      return
    }
    recordHistory()
    setTree((current) => updateNode(current, selectedId, (node) => ({ ...node, children: [...(node.children || []), ...children] })))
    setSelectedMovementId('')
    setMovementStartId('')
    setStatus(message)
  }

  function addSelectedFeature(feature, message, editNewFeature = false) {
    if (!tree || !selectedId) {
      setStatus('Create or select a node before adding a feature.')
      return
    }
    const newFeatureIndex = selectedNode?.features?.length || 0
    recordHistory()
    setTree((current) => updateNode(current, selectedId, (node) => ({ ...node, features: [...(node.features || []), feature] })))
    if (editNewFeature) {
      setFeatureInput(feature)
      setEditingFeatureIndex(newFeatureIndex)
    }
    setStatus(message)
  }

  function addSelectedFeatures(features, message) {
    if (!tree || !selectedId) {
      setStatus('Create or select a node before adding features.')
      return
    }
    if (!features.length) return
    recordHistory()
    setTree((current) => updateNode(current, selectedId, (node) => ({ ...node, features: [...(node.features || []), ...features] })))
    setStatus(message)
  }

  function applyTemplate(action) {
    switch (action) {
      case 'nodeDown':
        addTemplateChild(createNode('X'), 'Added a node below the selected node.')
        break
      case 'nodeUp': {
        if (!tree || !selectedNode) {
          createNewTree('XP')
          break
        }
        recordHistory()
        const parent = createNode('XP', { children: [structuredClone(selectedNode)] })
        if (selectedId === tree.id) {
          setTree(parent)
        } else {
          setTree((current) => updateNode(current, selectedId, () => parent))
        }
        setSelectedId(parent.id)
        setLabelInput(parent.label)
        setStatus('Wrapped the selected node in a parent node.')
        break
      }
      case 'terminal':
        addTemplateChild(createNode('text'), 'Added a terminal text node.')
        break
      case 'triangle':
        addTemplateChild(createNode('text', { shape: 'triangle' }), 'Added a triangle placeholder.')
        break
      case 'case': {
        const feature = featureInput.trim() || '[CASE]'
        addSelectedFeature(feature, `Added ${feature}. Edit the text in the Feature box, then press Save.`, true)
        break
      }
      case 'theta':
        addSelectedFeature('<θ,θ>', 'Added theta-role notation to the selected node.')
        break
      case 'feature': {
        const features = parseFeatureInput(featureInput.trim() || '+FEATURE')
        const message = features.length === 1 ? `Added ${features[0]} to the selected node.` : `Added ${features.length} features to the selected node.`
        addSelectedFeatures(features, message)
        if (featureInput.trim()) setFeatureInput('')
        break
      }
      case 'unary':
        addBranchChildren([createNode('X')], 'Added a unary branch under the selected node.')
        break
      case 'binary':
        addBranchChildren([createNode('X'), createNode('Y')], 'Added a binary branch under the selected node.')
        break
      case 'ternary':
        addBranchChildren([createNode('X'), createNode('Y'), createNode('Z')], 'Added a ternary branch under the selected node.')
        break
      case 'adjunct':
        addBranchChildren([createNode('Adjunct'), createNode('XP')], 'Added an adjunct branch under the selected node.')
        break
      case 'xbar':
        addBranchChildren(
          [
            createNode('Spec'),
            createNode("X'", { children: [createNode('X'), createNode('Comp')] }),
          ],
          'Added an X-bar branch under the selected node.',
        )
        break
      case 'movement':
        if (!tree || !selectedId) {
          setStatus('Select a starting node before creating a movement arrow.')
          break
        }
        setMovementStartId(selectedId)
        setSelectedMovementId('')
        setStatus(`Movement started from ${selectedNode?.label || 'selected node'}. Click the destination node.`)
        break
      case 'linkFeature':
        addSelectedFeature('<θ>', 'Linked a feature marker to the selected node.')
        break
      default:
        break
    }
  }

  useEffect(() => {
    function handleHistoryShortcut(event) {
      const isUndoRedoShortcut = (event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === 'z'
      if (!isUndoRedoShortcut) return

      event.preventDefault()
      if (event.repeat || historyShortcutPressedRef.current) return
      historyShortcutPressedRef.current = true

      if (event.shiftKey) {
        redoTreeEdit()
        return
      }

      undoTreeEdit()
    }

    function resetHistoryShortcut(event) {
      if (event.key.toLowerCase() === 'z') {
        historyShortcutPressedRef.current = false
      }
    }

    window.addEventListener('keydown', handleHistoryShortcut)
    window.addEventListener('keyup', resetHistoryShortcut)
    return () => {
      window.removeEventListener('keydown', handleHistoryShortcut)
      window.removeEventListener('keyup', resetHistoryShortcut)
    }
  })

  useEffect(() => {
    function handleTemplateShortcut(event) {
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
      const template = treeTemplates.find((item) => item.key === event.key)
      if (!template) return

      event.preventDefault()
      applyTemplate(template.action)
    }

    window.addEventListener('keydown', handleTemplateShortcut)
    return () => window.removeEventListener('keydown', handleTemplateShortcut)
  })

  useEffect(() => {
    setLectureStep((currentStep) => Math.min(currentStep, maxLectureStep))
  }, [maxLectureStep])

  function toggleLectureMode() {
    setIsLectureMode((current) => !current)
    setLectureStep(0)
  }

  function previousLectureStep() {
    setLectureStep((currentStep) => Math.max(0, currentStep - 1))
  }

  function nextLectureStep() {
    setLectureStep((currentStep) => Math.min(maxLectureStep, currentStep + 1))
  }

  function toggleCanvasFullscreen() {
    if (!canvasRef.current) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
      return
    }
    canvasRef.current.requestFullscreen()
  }

  function autoArrangeTree() {
    if (!tree) {
      setStatus('Create a tree before auto arranging.')
      return
    }

    setIsLectureMode(false)
    setLectureStep(maxLectureStep)
    setDraggedMovementHandle(null)
    canvasRef.current?.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    setStatus('Auto arranged and re-centered the tree.')
  }

  function zoomIn() {
    setZoomLevel((current) => Math.min(2.5, Number((current + 0.15).toFixed(2))))
  }

  function zoomOut() {
    setZoomLevel((current) => Math.max(0.45, Number((current - 0.15).toFixed(2))))
  }
  //The resets zoom back to 100%, scrolls the canvas back to the top-left starting view and shows a status message
  function fitToScreen() {
    setZoomLevel(1)
    canvasRef.current?.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    setStatus('Fit tree to screen.')
  }

  function saveLabel() {
    const label = labelInput.trim()
    if (!label) return
    if (!tree || !selectedId) {
      createNewTree(label)
      return
    }
    recordHistory()
    setTree((current) => updateNode(current, selectedId, (node) => ({ ...node, label })))
    setStatus(`Renamed node to ${label}.`)
  }

  function deleteSelected() {
    if (!tree || !selectedId) {
      setStatus('There is no node to delete.')
      return
    }
    if (selectedId === tree.id) {
      recordHistory()
      setTree(null)
      setSelectedId('')
      setLabelInput('S')
      setMovementStartId('')
      setMovements([])
      setSelectedMovementId('')
      setStatus('Cleared the tree.')
      return
    }
    const deletedIds = collectNodeIds(selectedNode)
    recordHistory()
    setTree((current) => removeNode(current, selectedId))
    setMovements((current) => current.filter((movement) => !deletedIds.has(movement.from) && !deletedIds.has(movement.to)))
    setMovementStartId('')
    setSelectedMovementId('')
    setSelectedId(tree.id)
    setLabelInput(tree.label)
    setStatus('Node deleted.')
  }

  function addFeature() {
    const featureText = featureInput.trim()
    if (!featureText) return
    if (!tree || !selectedId) {
      setStatus('Create or select a node before adding a feature.')
      return
    }
    if (editingFeatureIndex !== null) {
      recordHistory()
      setTree((current) => updateNode(current, selectedId, (node) => ({
        ...node,
        features: node.features.map((currentFeature, index) => (index === editingFeatureIndex ? featureText : currentFeature)),
      })))
      setEditingFeatureIndex(null)
      setStatus(`Updated feature to ${featureText}.`)
      setFeatureInput('')
      return
    }
    const features = parseFeatureInput(featureText)
    if (!features.length) return
    recordHistory()
    setTree((current) => updateNode(current, selectedId, (node) => ({ ...node, features: [...(node.features || []), ...features] })))
    setStatus(features.length === 1 ? `Added ${features[0]}.` : `Added ${features.length} stacked features.`)
    setFeatureInput('')
  }

  function editFeature(index) {
    if (!selectedNode?.features?.[index]) return
    setEditingFeatureIndex(index)
    setFeatureInput(selectedNode.features[index])
    setStatus('Edit the feature text, then press Save.')
  }

  function removeFeature(index) {
    if (!tree || !selectedId) return
    recordHistory()
    setTree((current) => updateNode(current, selectedId, (node) => ({ ...node, features: node.features.filter((_, featureIndex) => featureIndex !== index) })))
    setEditingFeatureIndex(null)
    setFeatureInput('')
  }

  function flipSelectedSubtree() {
    if (!tree || !selectedId) {
      setStatus('Create or select a node before flipping a subtree.')
      return
    }
    if (!selectedNode?.children?.length) {
      setStatus('The selected node has no children to flip.')
      return
    }
    recordHistory()
    setTree((current) => updateNode(current, selectedId, flipSubtree))
    setStatus(`Flipped the subtree under ${selectedNode.label}.`)
  }

  function selectMovement(movementId) {
    setSelectedMovementId(movementId)
    setSelectedId('')
    setLabelInput('S')
    setFeatureInput('')
    setEditingFeatureIndex(null)
    setMovementStartId('')
    setStatus('Movement line selected. Use the movement controls to reshape it.')
  }

  function getSvgPoint(event) {
    if (!svgRef.current) return null
    const point = svgRef.current.createSVGPoint()
    point.x = event.clientX
    point.y = event.clientY
    const transformedPoint = point.matrixTransform(svgRef.current.getScreenCTM().inverse())
    return {
      x: transformedPoint.x - canvasOffsetX,
      y: transformedPoint.y,
    }
  }

  function startMovementHandleDrag(event, movementId, handle) {
    event.stopPropagation()
    selectMovement(movementId)
    recordHistory()
    setDraggedMovementHandle({ movementId, handle })
    setStatus('Drag the blue handle to shape the movement line.')
  }

  function dragMovementHandle(event) {
    if (!draggedMovementHandle) return
    const point = getSvgPoint(event)
    if (!point) return

    setMovements((current) => current.map((movement) => {
      if (movement.id !== draggedMovementHandle.movementId) return movement
      const anchors = getMovementAnchors(movement, nodePositions)
      if (!anchors) return movement

      if (draggedMovementHandle.handle === 'control') {
        return { ...movement, controlX: point.x, controlY: point.y }
      }

      if (draggedMovementHandle.handle === 'start') {
        return {
          ...movement,
          startOffsetX: point.x - (anchors.startX - (movement.startOffsetX || 0)),
          startOffsetY: point.y - (anchors.startY - (movement.startOffsetY || 0)),
        }
      }

      return {
        ...movement,
        endOffsetX: point.x - (anchors.endX - (movement.endOffsetX || 0)),
        endOffsetY: point.y - (anchors.endY - (movement.endOffsetY || 0)),
      }
    }))
  }

  function stopMovementHandleDrag() {
    setDraggedMovementHandle(null)
  }

  function adjustSelectedMovement(offsetXChange, offsetYChange) {
    if (!selectedMovementId) {
      setStatus('Select a movement line before adjusting it.')
      return
    }
    recordHistory()
    setMovements((current) => current.map((movement) => (
      movement.id === selectedMovementId
        ? {
          ...movement,
          offsetX: (movement.offsetX || 0) + offsetXChange,
          offsetY: (movement.offsetY || 0) + offsetYChange,
        }
        : movement
    )))
  }

  function updateSelectedMovement(field, value) {
    if (!selectedMovementId) return
    recordHistory()
    setMovements((current) => current.map((movement) => (
      movement.id === selectedMovementId ? { ...movement, [field]: Number(value), controlX: undefined, controlY: undefined } : movement
    )))
  }

  function resetSelectedMovement() {
    if (!selectedMovementId) return
    recordHistory()
    setMovements((current) => current.map((movement) => (
      movement.id === selectedMovementId
        ? {
          ...movement,
          offsetX: 0,
          offsetY: 0,
          startOffsetX: 0,
          startOffsetY: 0,
          endOffsetX: 0,
          endOffsetY: 0,
          controlX: undefined,
          controlY: undefined,
        }
        : movement
    )))
    setStatus('Movement line reset.')
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Could not read image data.'))
      reader.readAsDataURL(blob)
    })
  }

  async function getImageDataUrl(href) {
    const response = await fetch(new URL(href, window.location.href).href)
    const blob = await response.blob()
    return blobToDataUrl(blob)
  }

  async function getSerializedSvg({ inlineImages = false, screenshot = false } = {}) {
    if (!svgRef.current) return ''
    const clonedSvg = svgRef.current.cloneNode(true)
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')

    if (screenshot) {
      const bounds = svgRef.current.getBoundingClientRect()
      clonedSvg.setAttribute('width', String(Math.max(1, Math.round(bounds.width))))
      clonedSvg.setAttribute('height', String(Math.max(1, Math.round(bounds.height))))
    }

    const imageElements = Array.from(clonedSvg.querySelectorAll('image'))
    await Promise.all(imageElements.map(async (image) => {
      const href = image.getAttribute('href') || image.getAttribute('xlink:href')
      if (!href) return
      image.setAttribute('href', inlineImages ? await getImageDataUrl(href) : new URL(href, window.location.href).href)
    }))

    return new XMLSerializer().serializeToString(clonedSvg)
  }

  async function downloadSvg() {
    const source = await getSerializedSvg()
    if (!source) return
    downloadBlob(new Blob([source], { type: 'image/svg+xml;charset=utf-8' }), 'syntax-tree.svg')
    setStatus('SVG downloaded.')
  }

  function downloadJson() {
    const source = JSON.stringify({ tree, movements }, null, 2)
    downloadBlob(new Blob([source], { type: 'application/json;charset=utf-8' }), 'syntax-tree.json')
    setStatus('JSON downloaded.')
  }

  function renderSvgToCanvas({ screenshot = false } = {}) {
    return new Promise((resolve, reject) => {
      getSerializedSvg({ inlineImages: true, screenshot }).then((source) => {
        if (!source || !svgRef.current) {
          reject(new Error('No SVG canvas found.'))
          return
        }

        const bounds = svgRef.current.getBoundingClientRect()
        const outputWidth = screenshot ? Math.max(1, Math.round(bounds.width)) : canvasWidth
        const outputHeight = screenshot ? Math.max(1, Math.round(bounds.height)) : canvasHeight
        const image = new Image()
        const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(svgBlob)

        image.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = outputWidth
          canvas.height = outputHeight
          const context = canvas.getContext('2d')
          context.fillStyle = '#ffffff'
          context.fillRect(0, 0, canvas.width, canvas.height)
          context.drawImage(image, 0, 0, canvas.width, canvas.height)
          URL.revokeObjectURL(url)
          resolve(canvas)
        }

        image.onerror = () => {
          URL.revokeObjectURL(url)
          reject(new Error('Could not render the tree image.'))
        }

        image.src = url
      }).catch(reject)
    })
  }

  async function downloadPng() {
    const canvas = await renderSvgToCanvas({ screenshot: true })
    canvas.toBlob((blob) => {
      if (!blob) return
      downloadBlob(blob, 'syntax-tree.png')
      setStatus('PNG downloaded.')
    }, 'image/png')
  }

  function createPdfFromJpeg(jpegDataUrl, width, height) {
    const imageData = atob(jpegDataUrl.split(',')[1])
    const pageWidth = 612
    const pageHeight = Math.max(792, pageWidth * (height / width))
    const imageWidth = pageWidth - 72
    const imageHeight = imageWidth * (height / width)
    const imageX = 36
    const imageY = pageHeight - imageHeight - 36
    const contentStream = `q\n${imageWidth.toFixed(2)} 0 0 ${imageHeight.toFixed(2)} ${imageX} ${imageY.toFixed(2)} cm\n/Im0 Do\nQ`
    const objects = [
      '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
      '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
      `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight.toFixed(2)}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`,
      `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageData.length} >>\nstream\n${imageData}\nendstream\nendobj\n`,
      `5 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
    ]
    let pdf = '%PDF-1.4\n'
    const offsets = [0]
    objects.forEach((object) => {
      offsets.push(pdf.length)
      pdf += object
    })
    const xrefOffset = pdf.length
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
    offsets.slice(1).forEach((offset) => {
      pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
    })
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

    const bytes = new Uint8Array(pdf.length)
    for (let index = 0; index < pdf.length; index += 1) {
      bytes[index] = pdf.charCodeAt(index) & 0xff
    }
    return new Blob([bytes], { type: 'application/pdf' })
  }

  async function downloadPdf() {
    const canvas = await renderSvgToCanvas({ screenshot: true })
    const pdfBlob = createPdfFromJpeg(canvas.toDataURL('image/jpeg', 0.95), canvas.width, canvas.height)
    downloadBlob(pdfBlob, 'syntax-tree.pdf')
    setStatus('PDF downloaded.')
  }

  async function downloadTree(format) {
    if (!tree) {
      setStatus('Create a tree before downloading.')
      return
    }

    try {
      if (format === 'svg') await downloadSvg()
      if (format === 'png') await downloadPng()
      if (format === 'pdf') await downloadPdf()
      if (format === 'json') downloadJson()
    } catch {
      setStatus('Download failed. Try SVG or JSON instead.')
    }
  }

  function handleDownloadClick(format) {
    downloadTree(format)
    setIsDownloadMenuOpen(false)
  }

  return (
    <div className="syntax-tree-builder">
      <section className="tree-template-palette" aria-label="TreeForm template buttons">
        {treeTemplates.map((template) => (
          <button
            type="button"
            key={`${template.key}-${template.label}`}
            className={`tree-template-button template-action-${template.action}`}
            onClick={() => applyTemplate(template.action)}
          >
            <span className="template-key">{template.key || 'Tool'}</span>
            <TemplatePreview template={template} />
            <span className="template-label">{template.label}</span>
          </button>
        ))}
      </section>

      <div className="tree-workspace">
        <section className="tree-panel tree-editor" aria-label="Tree editing controls">
          <div className="tree-panel-header">
            <span>Selected</span>
          </div>

          <label className="tree-field">
            <span>{tree ? 'Label' : 'Root label'}</span>
            <div className="tree-inline-control tree-label-control">
              <select
                value={getLabelChoice(labelInput)}
                onChange={(event) => {
                  if (event.target.value !== 'Other') setLabelInput(event.target.value)
                }}
              >
                {commonConstituentLabels.map((label) => (
                  <option key={label} value={label}>{label}</option>
                ))}
                <option value="Other">Other</option>
              </select>
              <input value={labelInput} onChange={(event) => setLabelInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && saveLabel()} />
              <button type="button" onClick={saveLabel}>{tree ? 'Save' : 'Create'}</button>
            </div>
          </label>

          <label className="tree-field">
            <span>New child</span>
            <div className="tree-inline-control tree-label-control">
              <select
                value={getLabelChoice(childInput)}
                onChange={(event) => {
                  if (event.target.value !== 'Other') setChildInput(event.target.value)
                }}
              >
                {commonConstituentLabels.map((label) => (
                  <option key={label} value={label}>{label}</option>
                ))}
                <option value="Other">Other</option>
              </select>
              <input value={childInput} onChange={(event) => setChildInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addChild()} />
              <button type="button" onClick={addChild}>Add</button>
            </div>
          </label>

          <div className="tree-field tree-typography-controls">
            <span>Typography</span>
            <label>
              <span>Size</span>
              <input
                type="range"
                min="12"
                max="28"
                value={treeFontSize}
                onChange={(event) => setTreeFontSize(Number(event.target.value))}
              />
              <strong>{treeFontSize}px</strong>
            </label>
            <label>
              <span>Style</span>
              <select value={treeFontFamily} onChange={(event) => setTreeFontFamily(event.target.value)}>
                <option value="Georgia, 'Times New Roman', serif">Serif</option>
                <option value="system-ui, 'Segoe UI', Roboto, sans-serif">Sans</option>
                <option value="'Courier New', ui-monospace, monospace">Mono</option>
              </select>
            </label>
            <label>
              <span>Weight</span>
              <select value={treeFontWeight} onChange={(event) => setTreeFontWeight(event.target.value)}>
                <option value="400">Regular</option>
                <option value="600">Semi-bold</option>
                <option value="700">Bold</option>
                <option value="800">Heavy</option>
              </select>
            </label>
          </div>

          <label className="tree-field">
            <span>Feature</span>
            <div className="tree-inline-control">
              <input value={featureInput} placeholder="[+CASE], [+past], wh" onChange={(event) => setFeatureInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addFeature()} />
              <button type="button" onClick={addFeature}>{editingFeatureIndex === null ? 'Add' : 'Save'}</button>
            </div>
          </label>

          <div className="tree-feature-list">
            {selectedNode?.features?.length ? selectedNode.features.map((feature, index) => (
              <span key={`${feature}-${index}`}>
                <button type="button" className="tree-feature-value" onClick={() => editFeature(index)}>{feature}</button>
                <button type="button" className="tree-feature-remove" aria-label={`Remove ${feature}`} onClick={() => removeFeature(index)}>x</button>
              </span>
            )) : <em>{tree ? 'No features on this node' : 'Create a root node first'}</em>}
          </div>

          {selectedMovement && (
            <div className="tree-movement-controls">
              <span>Movement line</span>
              <label className="movement-slider">
                <span>Curve side</span>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="6"
                  value={selectedMovement.offsetX || 0}
                  onChange={(event) => updateSelectedMovement('offsetX', event.target.value)}
                />
              </label>
              <label className="movement-slider">
                <span>Curve height</span>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="6"
                  value={selectedMovement.offsetY || 0}
                  onChange={(event) => updateSelectedMovement('offsetY', event.target.value)}
                />
              </label>
              <div className="movement-control-grid">
                <button type="button" onClick={() => adjustSelectedMovement(0, -16)}>Up</button>
                <button type="button" onClick={() => adjustSelectedMovement(-16, 0)}>Left</button>
                <button type="button" onClick={() => adjustSelectedMovement(16, 0)}>Right</button>
                <button type="button" onClick={() => adjustSelectedMovement(0, 16)}>Down</button>
              </div>
              <button type="button" onClick={resetSelectedMovement}>Reset line</button>
            </div>
          )}

          <button type="button" className="tree-secondary" onClick={flipSelectedSubtree}>Flip subtree</button>
          <button type="button" className="tree-danger" onClick={deleteSelected}>{tree ? 'Delete selected node' : 'Clear tree'}</button>
        </section>

        <section ref={canvasRef} className="tree-canvas" aria-label="Syntax tree canvas">
          <div className="tree-presentation-tools">
            <button type="button" onClick={autoArrangeTree}>Auto arrange</button>
            <button type="button" onClick={zoomOut} aria-label="Zoom out">-</button>
            <span>{Math.round(zoomLevel * 100)}%</span>
            <button type="button" onClick={zoomIn} aria-label="Zoom in">+</button>
            <button type="button" onClick={fitToScreen}>Fit</button>
            <button type="button" onClick={toggleCanvasFullscreen}>Full screen</button>
            <button type="button" aria-pressed={isLectureMode} onClick={toggleLectureMode}>
              {isLectureMode ? 'Lecture on' : 'Lecture off'}
            </button>
            <button type="button" onClick={previousLectureStep} disabled={!isLectureMode || lectureStep === 0}>Back</button>
            <span>Step {isLectureMode ? lectureStep + 1 : maxLectureStep + 1}/{maxLectureStep + 1}</span>
            <button type="button" onClick={nextLectureStep} disabled={!isLectureMode || lectureStep === maxLectureStep}>Next</button>
          </div>
          <div className="tree-download-menu">
            <button
              type="button"
              className="tree-download-trigger"
              aria-haspopup="menu"
              aria-expanded={isDownloadMenuOpen}
              onClick={() => setIsDownloadMenuOpen((isOpen) => !isOpen)}
            >
              <span>Download</span>
              <span aria-hidden="true">⌄</span>
            </button>
            {isDownloadMenuOpen && (
              <div className="tree-download-options" role="menu">
                <button type="button" role="menuitem" onClick={() => handleDownloadClick('svg')}>SVG</button>
                <button type="button" role="menuitem" onClick={() => handleDownloadClick('png')}>PNG</button>
                <button type="button" role="menuitem" onClick={() => handleDownloadClick('pdf')}>PDF</button>
                <button type="button" role="menuitem" onClick={() => handleDownloadClick('json')}>JSON</button>
              </div>
            )}
          </div>
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={viewBox}
            preserveAspectRatio="xMidYMax meet"
            role="img"
            aria-label="Editable syntax tree"
            onMouseMove={dragMovementHandle}
            onMouseUp={stopMovementHandleDrag}
            onMouseLeave={stopMovementHandleDrag}
          >
            <defs>
              <marker id="movement-arrow" markerWidth="8" markerHeight="8" refX="6.5" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M 0 0 L 8 4 L 0 8 z" fill="#334155" />
              </marker>
            </defs>
            <rect width="100%" height="100%" fill="#ffffff" />
            <g className="tree-brand-mark" transform={`translate(${brandBlockX}, ${brandBlockY})`} aria-hidden="true">
              <image
                className="tree-brand-logo"
                href={utscLogo}
                x={-brandLogoWidth / 2}
                y={-brandLogoHeight / 2}
                width={brandLogoWidth}
                height={brandLogoHeight}
                preserveAspectRatio="xMidYMid meet"
              />
              <text className="tree-brand-department" x="0" y={brandLogoHeight / 2 + brandTextGap} textAnchor="middle">
                Department of Linguistic Studies
              </text>
            </g>
            {!tree && (
              <text x="50%" y="50%" textAnchor="middle" fill="#64748b" fontSize="18" fontWeight="700">
                Start with a root node or choose a template button.
              </text>
            )}
            <g transform={`translate(${canvasOffsetX}, 0)`}>
              {visibleEdges.map((edge) => (
                <line
                  key={`${edge.from}-${edge.to}`}
                  className="branch-line"
                  x1={edge.x1}
                  y1={edge.y1}
                  x2={edge.x2}
                  y2={edge.y2}
                  stroke="#24324a"
                  strokeWidth="5.2"
                  strokeLinecap="round"
                />
              ))}
              {visibleMovementPaths.map((movement) => (
                <g key={movement.id} className="movement-layer">
                  <path
                    className={movement.id === selectedMovementId ? 'movement-path selected' : 'movement-path'}
                    d={movement.d}
                    fill="none"
                    onClick={() => selectMovement(movement.id)}
                  />
                  {movement.id === selectedMovementId && (
                    <g className="movement-handles">
                      <line x1={movement.startX} y1={movement.startY} x2={movement.controlX} y2={movement.controlY} />
                      <line x1={movement.controlX} y1={movement.controlY} x2={movement.endX} y2={movement.endY} />
                      <circle
                        cx={movement.startX}
                        cy={movement.startY}
                        r="8"
                        onMouseDown={(event) => startMovementHandleDrag(event, movement.id, 'start')}
                      />
                      <circle
                        className="movement-control-handle"
                        cx={movement.controlX}
                        cy={movement.controlY}
                        r="7"
                        onMouseDown={(event) => startMovementHandleDrag(event, movement.id, 'control')}
                      />
                      <circle
                        cx={movement.endX}
                        cy={movement.endY}
                        r="8"
                        onMouseDown={(event) => startMovementHandleDrag(event, movement.id, 'end')}
                      />
                    </g>
                  )}
                </g>
              ))}
              {visibleNodes.map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  selectedId={selectedId}
                  onSelect={selectNode}
                  fontSize={treeFontSize}
                  fontFamily={treeFontFamily}
                  fontWeight={treeFontWeight}
                />
              ))}
            </g>
          </svg>
        </section>
      </div>

    </div>
  )
}
