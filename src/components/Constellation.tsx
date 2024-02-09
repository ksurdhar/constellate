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
    const fuzz = 10 // Adjust this value to increase or decrease the fuzziness

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

    for (let i = 1; i < nodeCount - 1; i++) {
      const prevNode = newNodes[newNodes.length - 1]
      const newX =
        prevNode.x +
        (width - 2 * horizontalMargin) / (nodeCount - 1) +
        (Math.random() - 0.5) * fuzz
      const newY =
        Math.max(
          verticalVariance,
          Math.min(
            height - verticalVariance,
            prevNode.y + (Math.random() - 0.5) * verticalVariance
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

    // Additional connections for hubs and clusters
    const additionalConnections: Connection[] = []
    newNodes.forEach((node, index) => {
      // Skip the first and last nodes
      if (index === 0 || index === nodeCount - 1) return

      // Create a hub by connecting to a non-adjacent node
      if (Math.random() > 0.7) {
        const targetIndex = Math.random() > 0.5 ? index - 2 : index + 2
        if (targetIndex >= 0 && targetIndex < nodeCount) {
          additionalConnections.push({ source: node.id, target: targetIndex })
        }
      }

      // Connect to one of the nearest nodes above or below to form clusters
      const isUpperHalf = node.y < height / 2
      const neighborNode = isUpperHalf
        ? newNodes[Math.min(index + 1, nodeCount - 1)] // Node above
        : newNodes[Math.max(index - 1, 0)] // Node below
      if (neighborNode && Math.random() > 0.3) {
        additionalConnections.push({ source: node.id, target: neighborNode.id })
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
      {connections.map((connection) => (
        <line
          key={`${connection.source}-${connection.target}`}
          x1={nodes[connection.source].x}
          y1={nodes[connection.source].y}
          x2={nodes[connection.target].x}
          y2={nodes[connection.target].y}
          stroke="white"
          strokeWidth="1" // Make the lines a bit thinner for a more delicate look
          strokeDasharray="5,5"
        />
      ))}
    </svg>
  )
}

export default Constellation
