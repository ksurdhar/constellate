import useConstellation from '@/hooks/UseConstellation'
import React from 'react'
import AnimatedLine from './AnimatedLine'
import StarNode from './StarNode'

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
  const { nodes, connections } = useConstellation(nodeCount, width, height)

  return (
    <svg style={{ width, height, backgroundColor: 'black' }}>
      {connections.map((connection, idx) => {
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
            isActive={idx < 3}
          />
        )
      })}
      {nodes.map((node, idx) => (
        <StarNode
          key={node.id}
          cx={node.x}
          cy={node.y}
          color="gold" // Or any other color
          isActive={idx < 3}
        />
      ))}
    </svg>
  )
}

export default Constellation
