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
      primaryNodeCount + Math.round((nodeCount - primaryNodeCount) * 0.6)
    let secondaryNodes: Node[] = []
    let allConnections: Connection[] = [...primaryConnections]

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

    let isBranching = false
    let branchNodeCount = 0

    for (let i = primaryNodeCount; i < nodeCount; i++) {
      let branchBaseNode: Node
      let angle: number

      if (isBranching && branchNodeCount < 2) {
        // Continue the branch if it doesn't have at least two nodes
        const lastSecondaryNode = secondaryNodes[secondaryNodes.length - 1]
        branchBaseNode = lastSecondaryNode
        angle = adjustContinuingBranchAngle(lastSecondaryNode.direction!)
        branchNodeCount++ // Increment the count for the current branch
      } else if (
        !isBranching ||
        (isBranching && branchNodeCount >= 2 && Math.random() < 0.6)
      ) {
        // Either start a new branch or continue branching with a new base node if the current branch has at least two nodes
        isBranching = true // Mark that we are starting or continuing a branch
        branchNodeCount = 1 // Reset or start the count for a new branch

        do {
          const randomPrimaryNodeIndex = Math.floor(
            Math.random() * primaryNodeCount
          )
          branchBaseNode = primaryNodes[randomPrimaryNodeIndex]
        } while (branchBaseNode.branches === true)

        const direction = Math.random() < 0.5 ? 1 : -1
        angle = calculateBranchingAngle(direction)
        branchBaseNode.direction = angle
        branchBaseNode.branches = true
      } else {
        // Continue adding to the current branch without changing the base node
        const lastSecondaryNode = secondaryNodes[secondaryNodes.length - 1]
        branchBaseNode = lastSecondaryNode
        angle = adjustContinuingBranchAngle(lastSecondaryNode.direction!)
        branchNodeCount++ // Continue to increment the count for the current branch
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
        branchNodeCount === 1
          ? branchBaseNode.id
          : secondaryNodes[secondaryNodes.length - 2].id
      allConnections.push({
        source: connectionSourceId,
        target: newBranchNode.id,
      })

      // Check if we should end the current branch
      if (branchNodeCount >= 2 && Math.random() < 0.4) {
        isBranching = false // End the current branch
      }
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
