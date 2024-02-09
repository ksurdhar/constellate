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
    const horizontalMargin = width / (nodeCount * 2) // Margin from the edge of the screen
    const verticalVariance = height * 0.4 // Set the vertical variance
    const fuzz = 20 // Adjust this value to increase or decrease the fuzziness

    // Manually set the first and last nodes
    const firstNode: Node = {
      id: 0,
      x: horizontalMargin,
      y: Math.random() * height,
    }
    const lastNode: Node = {
      id: nodeCount - 1,
      x: width - horizontalMargin,
      y: Math.random() * height,
    }

    // Distribute the remaining nodes
    const newNodes: Node[] = [firstNode]

    // Randomly decide which nodes will be "branch" nodes, up to 25% of them
    const branchNodeIndices = new Set<number>()
    while (branchNodeIndices.size < nodeCount * 0.25) {
      const randomIndex = Math.floor(Math.random() * (nodeCount - 2)) + 1 // Avoid first and last nodes
      branchNodeIndices.add(randomIndex)
    }

    for (let i = 1; i < nodeCount - 1; i++) {
      const baseX =
        horizontalMargin +
        (width - 2 * horizontalMargin) * (i / (nodeCount - 1))
      const newX = baseX + (Math.random() - 0.5) * fuzz
      const newY =
        Math.max(
          verticalVariance,
          Math.min(
            height - verticalVariance,
            height / 2 + (Math.random() - 0.5) * verticalVariance
          )
        ) +
        (Math.random() - 0.5) * fuzz // Apply fuzz to y
      newNodes.push({ id: i, x: newX, y: newY })
    }

    // Add the last node
    newNodes.push(lastNode)
    setNodes(newNodes)

    // Primary connections for linear structure
    const primaryConnections: Connection[] = newNodes
      .slice(0, -1)
      .map((node) => ({
        source: node.id,
        target: node.id + 1,
      }))

    // Function to calculate the angle between two lines
    const angleBetweenLines = (line1: Connection, line2: Connection) => {
      const dx1 = newNodes[line1.target].x - newNodes[line1.source].x
      const dy1 = newNodes[line1.target].y - newNodes[line1.source].y
      const dx2 = newNodes[line2.target].x - newNodes[line2.source].x
      const dy2 = newNodes[line2.target].y - newNodes[line2.source].y
      const angle1 = Math.atan2(dy1, dx1)
      const angle2 = Math.atan2(dy2, dx2)
      const diff = Math.abs(angle1 - angle2)
      return Math.min(diff, 2 * Math.PI - diff)
    }

    // Additional connections for branches with angle constraint
    const additionalConnections: Connection[] = []
    newNodes.forEach((node, index) => {
      // Create branches for selected nodes
      if (branchNodeIndices.has(index)) {
        const branchLength = 1 + Math.floor(Math.random() * 4)
        // Choose a direction for the branch: up or down
        const branchDirection = Math.random() < 0.5 ? -1 : 1
        const branchTargetIndex = index + branchDirection * branchLength
        if (branchTargetIndex > 0 && branchTargetIndex < nodeCount - 1) {
          const newConnection = {
            source: node.id,
            target: newNodes[branchTargetIndex].id,
          }
          const angles = primaryConnections.map((pc) =>
            angleBetweenLines(pc, newConnection)
          )
          // Check if the new connection forms an angle less than 120 degrees with all primary connections
          if (angles.every((angle) => angle <= (120 * Math.PI) / 180)) {
            additionalConnections.push(newConnection)
          }
        }
      }
    })

    const uniqueConnections = [
      ...primaryConnections,
      ...additionalConnections,
    ].filter(
      (con, index, self) =>
        index ===
        self.findIndex(
          (t) => t.source === con.source && t.target === con.target
        )
    )
    setConnections(uniqueConnections)
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
