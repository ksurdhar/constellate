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
    const newNodes: Node[] = Array.from({ length: nodeCount }).map(
      (_, index) => ({
        id: index,
        x: Math.random() * width,
        y: Math.random() * height,
      })
    )
    setNodes(newNodes)

    // Function to calculate distance between two nodes
    const distance = (nodeA: Node, nodeB: Node) =>
      Math.sqrt((nodeA.x - nodeB.x) ** 2 + (nodeA.y - nodeB.y) ** 2)

    // Create connections based on proximity and degree of nodes
    const newConnections: Connection[] = []
    newNodes.forEach((node) => {
      const sortedNodes = newNodes
        .filter((otherNode) => otherNode.id !== node.id)
        .sort((a, b) => distance(node, a) - distance(node, b))

      // Connect to the closest node to form a path
      newConnections.push({ source: node.id, target: sortedNodes[0].id })

      // Randomly decide if we should connect to the second closest node
      if (Math.random() > 0.5) {
        newConnections.push({ source: node.id, target: sortedNodes[1].id })
      }

      // Introduce a small chance to connect to a third node, simulating a 'hub'
      if (Math.random() > 0.8 && sortedNodes.length > 2) {
        newConnections.push({ source: node.id, target: sortedNodes[2].id })
      }
    })

    // Remove duplicate connections
    const uniqueConnections = newConnections.filter(
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
          r="5"
          fill="white"
          style={animationProps}
        />
      ))}
      {connections.map((connection) => (
        <line
          key={`${connection.source}-${connection.target}`}
          x1={nodes.find((node) => node.id === connection.source)!.x}
          y1={nodes.find((node) => node.id === connection.source)!.y}
          x2={nodes.find((node) => node.id === connection.target)!.x}
          y2={nodes.find((node) => node.id === connection.target)!.y}
          stroke="white"
          strokeDasharray="5,5"
        />
      ))}
    </svg>
  )
}

export default Constellation
