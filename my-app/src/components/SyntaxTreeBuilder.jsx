import { useMemo, useRef, useState } from 'react'


//Got inspiration from the github: https://github.com/frekky/TreeForm.git



const colorOptions = ['#ffffff', '#eef6ff', '#eafaf0', '#fff4d6', '#fdecef', '#f3eefc', '#edf2f7', '#101828']
const horizontalGap = 112
const verticalGap = 98
const nodeWidth = 82
const nodeHeight = 36
const canvasMargin = 220
let nodeCounter = 0
let movementCounter = 0

// Buttons to create were for:
// node down, node up, terminal, triangle,
// case, theta roles, feature, unary, binary,
// ternary, adjuct, X-bar, movement, link features
// add feature

const treeTemplates = [
  { key: 'F1', label: 'Node Down', preview: ['|', 'X'], action: 'nodeDown' },
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
    color: '#ffffff',
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

function layoutTree(node, left = 0, depth = 0, nodes = [], edges = []) {
  const width = measureTree(node)
  const x = left + width / 2
  const y = depth * verticalGap + 34
  nodes.push({ ...node, x, y })

  let childLeft = left
  for (const child of node.children || []) {
    const childWidth = measureTree(child)
    const childX = childLeft + childWidth / 2
    const childY = (depth + 1) * verticalGap + 34
    edges.push({ from: node.id, to: child.id, x1: x, y1: y + nodeHeight / 2, x2: childX, y2: childY - nodeHeight / 2 })
    layoutTree(child, childLeft, depth + 1, nodes, edges)
    childLeft += childWidth
  }

  return { nodes, edges, width, height: (getDepth(node) + 1) * verticalGap + 70 }
}

function getDepth(node) {
  if (!node.children?.length) return 0
  return 1 + Math.max(...node.children.map(getDepth))
}

function FeatureLabel({ feature, y, onSelect }) {
  return (
    <g className="feature-label" onClick={onSelect}>
      <text
        x="0"
        y={y}
        textAnchor="middle"
        fill="#475569"
        fontSize="11"
        fontWeight="600"
      >
        {feature}
      </text>
      <line x1="-28" y1={y + 5} x2="28" y2={y + 5} stroke="#475569" strokeWidth="1.4" />
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

function TreeNode({ node, selectedId, onSelect }) {
  const isSelected = selectedId === node.id
  const textColor = node.color === '#101828' ? '#ffffff' : '#172033'
  const isTriangle = node.shape === 'triangle'

  if (isTriangle) {
    return (
      <g className="tree-node triangle-node" transform={`translate(${node.x}, ${node.y})`} onClick={() => onSelect(node.id)}>
        <polygon
          points={`0,${-nodeHeight / 2} ${-nodeWidth / 2},${nodeHeight / 2} ${nodeWidth / 2},${nodeHeight / 2}`}
          fill={isSelected ? '#eef6ff' : 'transparent'}
          stroke={isSelected ? '#1555c5' : '#24324a'}
          strokeWidth={isSelected ? '3' : '2'}
        />
        <text
          x="0"
          y={nodeHeight / 2 + 20}
          textAnchor="middle"
          fill="#172033"
          fontSize="14"
          fontWeight="700"
        >
          {node.label}
        </text>
        {node.features?.map((feature, index) => (
          <FeatureLabel
            key={`${node.id}-${feature}-${index}`}
            feature={feature}
            y={nodeHeight / 2 + 38 + index * 18}
            onSelect={() => onSelect(node.id)}
          />
        ))}
      </g>
    )
  }

  return (
    <g className="tree-node" transform={`translate(${node.x}, ${node.y})`}>
      <button type="button" aria-label={`Select ${node.label}`} tabIndex="-1" className="svg-button-reset" />
      <rect
        x={-nodeWidth / 2}
        y={-nodeHeight / 2}
        width={nodeWidth}
        height={nodeHeight}
        rx="6"
        fill={isSelected ? '#1555c5' : node.color}
        stroke={isSelected ? '#062d72' : '#24324a'}
        strokeWidth={isSelected ? '3' : '1.8'}
        onClick={() => onSelect(node.id)}
      />
      <text
        x="0"
        y="5"
        textAnchor="middle"
        fill={isSelected ? '#ffffff' : textColor}
        fontSize="14"
        fontWeight="700"
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
        />
      ))}
    </g>
  )
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
  const [status, setStatus] = useState('')
  const svgRef = useRef(null)

  const selectedNode = findNode(tree, selectedId)
  const layout = useMemo(() => (tree ? layoutTree(tree) : { nodes: [], edges: [], width: 640, height: 420 }), [tree])
  const nodePositions = useMemo(() => new Map(layout.nodes.map((node) => [node.id, node])), [layout.nodes])
  const movementPaths = useMemo(
    () => movements.map((movement) => getMovementPath(movement, nodePositions)).filter(Boolean),
    [movements, nodePositions],
  )
  const selectedMovement = movements.find((movement) => movement.id === selectedMovementId)
  const canvasWidth = Math.max(layout.width + canvasMargin * 2, 860)
  const canvasHeight = Math.max(layout.height + canvasMargin, 560)
  const canvasOffsetX = Math.max((canvasWidth - layout.width) / 2, canvasMargin)
  const viewBox = `0 0 ${canvasWidth} ${canvasHeight}`

  function createNewTree(label = labelInput.trim() || 'S') {
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
    setTree((current) => updateNode(current, selectedId, (node) => ({ ...node, children: [...(node.children || []), newNode] })))
    setSelectedId(newNode.id)
    setLabelInput(label)
    setChildInput('XP')
    setStatus(`Added ${label}.`)
  }

  function addTemplateChild(templateNode, message) {
    if (!tree || !selectedId) {
      setTree(templateNode)
      setSelectedId(templateNode.id)
      setLabelInput(templateNode.label)
      setMovementStartId('')
      setMovements([])
      setSelectedMovementId('')
      setStatus(`Created ${templateNode.label} as the root node.`)
      return
    }
    setTree((current) => updateNode(current, selectedId, (node) => ({ ...node, children: [...(node.children || []), templateNode] })))
    setSelectedId(templateNode.id)
    setLabelInput(templateNode.label)
    setStatus(message)
  }

  function addSelectedFeature(feature, message, editNewFeature = false) {
    if (!tree || !selectedId) {
      setStatus('Create or select a node before adding a feature.')
      return
    }
    const newFeatureIndex = selectedNode?.features?.length || 0
    setTree((current) => updateNode(current, selectedId, (node) => ({ ...node, features: [...(node.features || []), feature] })))
    if (editNewFeature) {
      setFeatureInput(feature)
      setEditingFeatureIndex(newFeatureIndex)
    }
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
        const feature = featureInput.trim() || '+FEATURE'
        addSelectedFeature(feature, `Added ${feature} to the selected node.`)
        if (featureInput.trim()) setFeatureInput('')
        break
      }
      case 'unary':
        addTemplateChild(createNode('XP', { children: [createNode('X')] }), 'Added a unary branch.')
        break
      case 'binary':
        addTemplateChild(createNode('XP', { children: [createNode('X'), createNode('Y')] }), 'Added a binary branch.')
        break
      case 'ternary':
        addTemplateChild(createNode('XP', { children: [createNode('X'), createNode('Y'), createNode('Z')] }), 'Added a ternary branch.')
        break
      case 'adjunct':
        addTemplateChild(createNode('XP', { children: [createNode('Adjunct'), createNode('XP')] }), 'Added an adjunct branch.')
        break
      case 'xbar':
        addTemplateChild(
          createNode('XP', {
            children: [
              createNode('Spec'),
              createNode("X'", { children: [createNode('X'), createNode('Comp')] }),
            ],
          }),
          'Added an X-bar template.',
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

  function saveLabel() {
    const label = labelInput.trim()
    if (!label) return
    if (!tree || !selectedId) {
      createNewTree(label)
      return
    }
    setTree((current) => updateNode(current, selectedId, (node) => ({ ...node, label })))
    setStatus(`Renamed node to ${label}.`)
  }

  function deleteSelected() {
    if (!tree || !selectedId) {
      setStatus('There is no node to delete.')
      return
    }
    if (selectedId === tree.id) {
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
    setTree((current) => removeNode(current, selectedId))
    setMovements((current) => current.filter((movement) => !deletedIds.has(movement.from) && !deletedIds.has(movement.to)))
    setMovementStartId('')
    setSelectedMovementId('')
    setSelectedId(tree.id)
    setLabelInput(tree.label)
    setStatus('Node deleted.')
  }

  function setNodeColor(color) {
    if (!tree || !selectedId) return
    setTree((current) => updateNode(current, selectedId, (node) => ({ ...node, color })))
  }

  function addFeature() {
    const feature = featureInput.trim()
    if (!feature) return
    if (!tree || !selectedId) {
      setStatus('Create or select a node before adding a feature.')
      return
    }
    if (editingFeatureIndex !== null) {
      setTree((current) => updateNode(current, selectedId, (node) => ({
        ...node,
        features: node.features.map((currentFeature, index) => (index === editingFeatureIndex ? feature : currentFeature)),
      })))
      setEditingFeatureIndex(null)
      setStatus(`Updated feature to ${feature}.`)
      setFeatureInput('')
      return
    }
    setTree((current) => updateNode(current, selectedId, (node) => ({ ...node, features: [...(node.features || []), feature] })))
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
    setMovements((current) => current.map((movement) => (
      movement.id === selectedMovementId ? { ...movement, [field]: Number(value), controlX: undefined, controlY: undefined } : movement
    )))
  }

  function resetSelectedMovement() {
    if (!selectedMovementId) return
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

  function downloadSvg() {
    if (!tree) {
      setStatus('Create a tree before downloading SVG.')
      return
    }
    if (!svgRef.current) return
    const serializer = new XMLSerializer()
    const source = serializer.serializeToString(svgRef.current)
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'syntax-tree.svg'
    link.click()
    URL.revokeObjectURL(url)
    setStatus('SVG downloaded.')
  }

  return (
    <div className="syntax-tree-builder">
      <div className="tree-workspace">
        <section className="tree-template-palette" aria-label="TreeForm template buttons">
          {treeTemplates.map((template) => (
            <button
              type="button"
              key={`${template.key}-${template.label}`}
              className="tree-template-button"
              onClick={() => applyTemplate(template.action)}
            >
              <span className="template-key">{template.key}</span>
              <span className="template-preview" aria-hidden="true">
                {template.preview.map((line, index) => (
                  <span key={`${template.label}-${line}-${index}`}>{line}</span>
                ))}
              </span>
              <span className="template-label">{template.label}</span>
            </button>
          ))}
        </section>

        <section className="tree-panel tree-editor" aria-label="Tree editing controls">
          <div className="tree-panel-header">
            <span>Selected</span>
            <strong>{selectedNode?.label || 'None'}</strong>
          </div>

          <label className="tree-field">
            <span>{tree ? 'Label' : 'Root label'}</span>
            <div className="tree-inline-control">
              <input value={labelInput} onChange={(event) => setLabelInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && saveLabel()} />
              <button type="button" onClick={saveLabel}>{tree ? 'Save' : 'Create'}</button>
            </div>
          </label>

          <label className="tree-field">
            <span>New child</span>
            <div className="tree-inline-control">
              <input value={childInput} onChange={(event) => setChildInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addChild()} />
              <button type="button" onClick={addChild}>Add</button>
            </div>
          </label>

          <div className="tree-field">
            <span>Color</span>
            <div className="tree-swatches">
              {colorOptions.map((color) => (
                <button
                  type="button"
                  key={color}
                  aria-label={`Set node color ${color}`}
                  className={selectedNode?.color === color ? 'active' : ''}
                  style={{ backgroundColor: color }}
                  onClick={() => setNodeColor(color)}
                />
              ))}
            </div>
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

        <section className="tree-canvas" aria-label="Syntax tree canvas">
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={viewBox}
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
            {!tree && (
              <text x="50%" y="50%" textAnchor="middle" fill="#64748b" fontSize="18" fontWeight="700">
                Start with a root node or choose a template button.
              </text>
            )}
            <g transform={`translate(${canvasOffsetX}, 0)`}>
              {layout.edges.map((edge) => (
                <line key={`${edge.from}-${edge.to}`} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke="#334155" strokeWidth="2" />
              ))}
              {movementPaths.map((movement) => (
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
              {layout.nodes.map((node) => (
                <TreeNode key={node.id} node={node} selectedId={selectedId} onSelect={selectNode} />
              ))}
            </g>
          </svg>
        </section>
      </div>

      <div className="tree-actions">
        <button type="button" onClick={() => createNewTree()}>New root</button>
        <button type="button" onClick={downloadSvg}>Download SVG</button>
      </div>

      <div className="tree-status" role="status">{status || 'Click any node to edit it. Add children to build the phrase structure, then export SVG for slides or handouts.'}</div>
    </div>
  )
}
