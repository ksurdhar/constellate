import useConstellation from '@/hooks/UseConstellation'
import React, { useState } from 'react'
import ActiveLine from './ActiveLine'
import InactiveLine from './InactiveLine'
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

  const [activeNodeIndex, setActiveNodeIndex] = useState(0)
  const [activeConnectionIndex, setActiveConnectionIndex] = useState(-1) // Start from -1 since we activate nodes first

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (activeConnectionIndex < activeNodeIndex - 1) {
  //       setActiveConnectionIndex(activeNodeIndex - 1)
  //     } else if (activeNodeIndex < nodes.length) {
  //       setActiveNodeIndex(activeNodeIndex + 1)
  //     }
  //   }, 800)

  //   return () => clearInterval(interval)
  // }, [nodes.length, activeNodeIndex, activeConnectionIndex])

  return (
    <svg style={{ width, height, backgroundColor: 'transparent' }}>
      {connections.map((connection, idx) => {
        const sourceNode = nodes.find((n) => n.id === connection.source)
        const targetNode = nodes.find((n) => n.id === connection.target)

        // If either node is not found, do not render the line
        if (!sourceNode || !targetNode) return null

        return (
          <React.Fragment key={`${connection.source}-${connection.target}`}>
            <InactiveLine
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
            />
            <ActiveLine
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              isActive={idx <= activeConnectionIndex}
            />
          </React.Fragment>
        )
      })}
      {nodes.map((node, idx) => (
        <StarNode
          key={node.id}
          cx={node.x}
          cy={node.y}
          color="gold"
          isActive={idx < activeNodeIndex}
        />
      ))}
    </svg>
  )
}

export default Constellation
