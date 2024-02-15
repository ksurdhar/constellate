import React, { useEffect, useState } from 'react'
import { animated, useSpring } from 'react-spring'

interface Node {
  id: number
  x: number
  y: number
  direction?: number
  branches?: boolean
}

interface Connection {
  source: number
  target: number
}

interface AnimatedLineProps {
  x1: number
  y1: number
  x2: number
  y2: number
}

const AnimatedLine = ({ x1, y1, x2, y2 }: AnimatedLineProps) => {
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

  const dashLength = 5
  const gapLength = 5
  const totalDashLength = dashLength + gapLength

  // Calcu how many times the dash pattern will repeat over the line length
  // ensures a smooth looping animation

  const dashRepeat = Math.ceil(length / totalDashLength)
  const initialStrokeDashoffset = dashRepeat * totalDashLength
  const strokeDasharray = `${dashLength}, ${gapLength}`

  const animatedProps = useSpring({
    from: { strokeDashoffset: initialStrokeDashoffset },
    to: { strokeDashoffset: 0 },
    config: { duration: 8000 },
    reset: true,
    onRest: () => {
      animatedProps.strokeDashoffset.start({
        from: initialStrokeDashoffset,
        to: 0,
      })
    },
  })

  return (
    <animated.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="white"
      strokeWidth="1"
      strokeDasharray={strokeDasharray}
      style={animatedProps}
    />
  )
}

function centerNodesOnCanvas(
  nodes: Node[],
  width: number,
  height: number
): Node[] {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity

  nodes.forEach((node) => {
    minX = Math.min(minX, node.x)
    maxX = Math.max(maxX, node.x)
    minY = Math.min(minY, node.y)
    maxY = Math.max(maxY, node.y)
  })

  const shapeCenterX = (minX + maxX) / 2
  const shapeCenterY = (minY + maxY) / 2
  const canvasCenterX = width / 2
  const canvasCenterY = height / 2
  const translateX = canvasCenterX - shapeCenterX
  const translateY = canvasCenterY - shapeCenterY

  return nodes.map((node) => ({
    ...node,
    x: node.x + translateX,
    y: node.y + translateY,
  }))
}

// Helper function to calculate a new point given a starting point, distance, and angle
function calculateNewPoint(
  x: number,
  y: number,
  angle: number,
  distance: number
): { x: number; y: number } {
  return {
    x: x + Math.cos(angle) * distance,
    y: y + Math.sin(angle) * distance,
  }
}
function calculateBranchingAngle(direction: number): number {
  const baseAngle = direction > 0 ? Math.PI / 2 : (3 * Math.PI) / 2 // π/2 for up, 3π/2 for down
  // Random angle within 45 degrees of the base angle
  const angleVariance = ((Math.random() - 0.5) * Math.PI) / 2 // ±45 degrees in radians
  return baseAngle + angleVariance
}
function adjustContinuingBranchAngle(previousAngle: number): number {
  // Calculate a new angle by adjusting the previous angle within ±45 degrees (π/4 radians)
  const angleAdjustment = ((Math.random() - 0.5) * Math.PI) / 2 // Random adjustment within ±45 degrees
  return previousAngle + angleAdjustment
}

interface ConstellationProps {
  nodeCount: number
  width: number
  height: number
}

const Constellation: React.FC<ConstellationProps> = ({
  nodeCount,
  width,
  height,
}) => {
  const [nodes, setNodes] = useState<Node[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  useEffect(() => {
    const maxPrimaryNodes = 14
    const primaryPercentage = 0.55

    const primaryNodeCount = Math.ceil(
      Math.min(nodeCount * primaryPercentage, maxPrimaryNodes)
    )

    const margin = width * 0.1 // Equal margin
    const nodeSpacing = (width - 2 * margin) / (primaryNodeCount - 1)
    let previousY = height / 2 // Center y-axis

    const primaryNodes: Node[] = []

    for (let i = 0; i < primaryNodeCount; i++) {
      const x = margin + i * nodeSpacing
      let y

      if (i === 0) {
        y = previousY // first node
      } else {
        // For others calc Y based on prev node's Y and random angle within 70 degrees
        const angleDelta = (Math.random() - 0.5) * 70
        // Convert angleDelta to radians and calculate Y change
        const deltaY = Math.tan((angleDelta * Math.PI) / 180) * nodeSpacing
        y = Math.max(0, Math.min(height, previousY + deltaY)) // Ensure stays within canvas bounds
        previousY = y
      }

      primaryNodes.push({ id: i, x, y })
    }

    const primaryConnections: Connection[] = primaryNodes
      .slice(0, -1)
      .map((node) => ({
        source: node.id,
        target: node.id + 1,
      }))

    let secondaryNodes: Node[] = []
    let allConnections: Connection[] = [...primaryConnections]

    let isBranching = false
    let branchLength = 0

    // Add branching nodes
    for (let i = primaryNodeCount; i < nodeCount; i++) {
      let branchBaseNode: Node
      let angle: number

      if (!isBranching) {
        // start a new branch
        isBranching = true
        branchLength = 1

        do {
          const randomPrimaryIdx = Math.floor(Math.random() * primaryNodeCount)
          branchBaseNode = primaryNodes[randomPrimaryIdx]
        } while (branchBaseNode.branches === true)

        const direction = Math.random() < 0.5 ? 1 : -1
        angle = calculateBranchingAngle(direction)
        branchBaseNode.direction = angle
        branchBaseNode.branches = true
      } else {
        // continue adding to existing branch
        const lastSecondaryNode = secondaryNodes[secondaryNodes.length - 1]
        branchBaseNode = lastSecondaryNode
        angle = adjustContinuingBranchAngle(lastSecondaryNode.direction!)
        branchLength++
      }

      const { x, y } = calculateNewPoint(
        branchBaseNode.x,
        branchBaseNode.y,
        angle,
        nodeSpacing
      )
      const newY = Math.max(0, Math.min(height, y))

      const newBranchNode: Node = {
        id: i,
        x,
        y: newY,
        direction: angle,
      }
      secondaryNodes.push(newBranchNode)

      const connectionSourceId =
        branchLength === 1
          ? branchBaseNode.id
          : secondaryNodes[secondaryNodes.length - 2].id
      allConnections.push({
        source: connectionSourceId,
        target: newBranchNode.id,
      })

      // chance to form additional connection
      if (Math.random() < 0.25) {
        const branchBaseNodeIndex = primaryNodes.findIndex(
          (node) => node.id === branchBaseNode.id
        )

        const eligiblePrimaryNodes = primaryNodes.filter((_, idx) => {
          if (idx === branchBaseNodeIndex) return false // Exclude the current base node itself

          const minIndex = Math.max(0, branchBaseNodeIndex - branchLength - 1)
          const maxIndex = branchBaseNodeIndex - 1 // ensure we're looking back from the current base node

          return idx >= minIndex && idx <= maxIndex
        })

        if (eligiblePrimaryNodes.length > 0) {
          const randomTargetIdx = Math.floor(
            Math.random() * eligiblePrimaryNodes.length
          )
          const targetNode = eligiblePrimaryNodes[randomTargetIdx]

          allConnections.push({
            source: newBranchNode.id,
            target: targetNode.id,
          })
        }
      }

      // Check if we should end the current branch
      if (branchLength >= 2 && Math.random() < 0.5) {
        isBranching = false
      }
    }

    const allNodes = [...primaryNodes, ...secondaryNodes]

    const centeredNodes = centerNodesOnCanvas(allNodes, width, height)

    setNodes(centeredNodes)
    setConnections(allConnections)
  }, [nodeCount, width, height])

  const animationProps = useSpring({ opacity: 1, from: { opacity: 0 } })

  return (
    <svg style={{ width, height, backgroundColor: 'black' }}>
      {nodes.map((node) => (
        <animated.circle
          key={node.id}
          cx={node.x}
          cy={node.y}
          r="3" // Slightly reduce the node radius
          fill="white"
          style={animationProps}
        />
      ))}
      {connections.map((connection) => {
        const sourceNode = nodes.find((n) => n.id === connection.source)
        const targetNode = nodes.find((n) => n.id === connection.target)

        // If either node is not found, do not render the line
        if (!sourceNode || !targetNode) return null

        return (
          <AnimatedLine
            key={`${connection.source}-${connection.target}`}
            x1={sourceNode.x}
            y1={sourceNode.y}
            x2={targetNode.x}
            y2={targetNode.y}
          />
        )
      })}
    </svg>
  )
}

export default Constellation
