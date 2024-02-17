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
  const [activeConnectionIndex, setActiveConnectionIndex] = useState(-1)
  const [isHovered, setIsHovered] = useState(false)

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

  if (nodeCount === 0) {
    return (
      <div
        style={{ height, width }}
        className="self-center text-center flex justify-around flex-col text-zinc-500"
      >
        Add weekly habits to form a constellation.
      </div>
    )
  }

  return (
    <div
      style={{ width, height }}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        className="transition-opacity duration-500 ease-in-out"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          opacity: isHovered ? 0.4 : 1,
        }}
      >
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
      <div
        className="absolute inset-0 flex justify-center items-center transition-opacity duration-500 ease-in-out cursor-pointer"
        style={{ opacity: isHovered ? 1 : 0 }}
      >
        <span className="text-zinc-100 text-base bg-black/5">
          As you track habits, this constellation will connect.
        </span>
      </div>
    </div>
  )
}

export default Constellation
