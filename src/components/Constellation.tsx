import React, { useEffect, useState } from 'react'
import { animated, useSpring } from 'react-spring'

interface Node {
  id: number
  x: number
  y: number
}

interface Connection {
  source: number
  target: number
}

interface ConstellationProps {
  nodeCount: number
  width: number
  height: number
}

interface AnimatedLineProps {
  x1: number
  y1: number
  x2: number
  y2: number
}

const AnimatedLine = ({ x1, y1, x2, y2 }: AnimatedLineProps) => {
  // Calculate the length of the line
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

  const animatedProps = useSpring({
    from: { strokeDashoffset: 0 },
    to: { strokeDashoffset: -length },
    config: { duration: 8000 },
    reset: true,
    onRest: () => {
      animatedProps.strokeDashoffset.start({ from: 0, to: -length })
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
      strokeDasharray={`5, 5`}
      style={animatedProps}
    />
  )
}

const Constellation: React.FC<ConstellationProps> = ({
  nodeCount,
  width,
  height,
}) => {
  const [nodes, setNodes] = useState<Node[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  useEffect(() => {
    const primaryNodeCount = Math.ceil(nodeCount * 0.65) // 60-70%, adjusted to 65% as a middle ground
    const margin = width * 0.1 // Equal margin on both sides of the canvas
    const nodeSpacing = (width - 2 * margin) / (primaryNodeCount - 1)

    let previousY = height * 0.2 + Math.random() * height * 0.6 // Initial Y within middle 60% of canvas height

    const primaryNodes: Node[] = []

    for (let i = 0; i < primaryNodeCount; i++) {
      const x = margin + i * nodeSpacing
      let y

      if (i === 0) {
        y = previousY // Use the initially calculated Y for the first node
      } else {
        // For subsequent nodes, calculate Y based on the previous node's Y and a random angle within 70 degrees
        const angleDelta = (Math.random() - 0.5) * 70 // Random angle change within 70 degrees
        // Convert angleDelta to radians and calculate Y change
        const deltaY = Math.tan((angleDelta * Math.PI) / 180) * nodeSpacing
        y = Math.max(0, Math.min(height, previousY + deltaY)) // Ensure y stays within canvas bounds
        previousY = y // Update previousY for the next node
      }

      primaryNodes.push({ id: i, x, y })
    }

    const primaryConnections: Connection[] = primaryNodes
      .slice(0, -1)
      .map((node, index) => ({
        source: node.id,
        target: node.id + 1,
      }))

    const totalNodesCount =
      primaryNodeCount + Math.round((nodeCount - primaryNodeCount) * 0.6) // Adjust based on your requirement for secondary nodes
    let secondaryNodes: Node[] = []
    let allConnections: Connection[] = [...primaryConnections] // Start with primary connections

    for (let i = primaryNodeCount; i < totalNodesCount; i++) {
      // Decide whether to start a new branch or continue from an existing one
      const continueBranch = Math.random() < 0.6 && secondaryNodes.length > 0 // 60% chance to continue a branch if possible
      let branchBaseNode: Node

      if (continueBranch && secondaryNodes.length > 0) {
        // Continue from the last secondary node
        branchBaseNode = secondaryNodes[secondaryNodes.length - 1]
      } else {
        // Start a new branch from a random primary node
        const randomPrimaryNodeIndex = Math.floor(
          Math.random() * primaryNodeCount
        )
        branchBaseNode = primaryNodes[randomPrimaryNodeIndex]
      }

      const branchDirection = Math.random() < 0.5 ? 1 : -1 // 1 for up, -1 for down
      const x = continueBranch
        ? branchBaseNode.x + nodeSpacing
        : branchBaseNode.x // If continuing a branch, move right; otherwise, use the same x
      // Determine y based on branch direction and ensure it's within canvas bounds
      let y =
        branchBaseNode.y +
        branchDirection * nodeSpacing * (Math.random() * 0.5 + 0.5) // Adjust the multiplier for variation in branch length

      y = Math.max(0, Math.min(height, y)) // Ensure y stays within canvas bounds

      const newBranchNode: Node = { id: i, x, y }
      secondaryNodes.push(newBranchNode)

      // Create a connection either back to the branch base node or continue from the previous branch node
      const connectionSourceId =
        continueBranch && secondaryNodes.length > 1 ? i - 1 : branchBaseNode.id
      allConnections.push({
        source: connectionSourceId,
        target: newBranchNode.id,
      })
    }

    const finalNodes = [...primaryNodes, ...secondaryNodes]

    setNodes(finalNodes)
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
