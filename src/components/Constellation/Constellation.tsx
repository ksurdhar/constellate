'use client'

import { FaCaretRight } from 'react-icons/fa6'

import { Connection, Node } from '@/types'
import React, { useEffect, useState } from 'react'
import ActiveLine from './ActiveLine'
import InactiveLine from './InactiveLine'
import StarNode from './StarNode'

interface ConstellationProps {
  nodes: Node[]
  connections: Connection[]
  nodeCount: number
  width: number
  height: number
  completedHabits: number
  toggleView: () => void
}

const Constellation: React.FC<ConstellationProps> = ({
  nodes,
  connections,
  nodeCount,
  width,
  height,
  completedHabits,
  toggleView,
}) => {
  const [activeNodeIndex, setActiveNodeIndex] = useState(completedHabits)
  const [activeConnectionIndex, setActiveConnectionIndex] = useState(-1)
  const [isHovered, setIsHovered] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setActiveNodeIndex(completedHabits)
    setActiveConnectionIndex(completedHabits - 2)
  }, [completedHabits])

  useEffect(() => {
    // hack to prevent nextjs from complaining
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoaded) {
    return null
  }

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
          opacity: isHovered ? 0.3 : 1,
        }}
      >
        {connections.map((connection, idx) => {
          const sourceNode = nodes.find((n) => n.id === connection.source)
          const targetNode = nodes.find((n) => n.id === connection.target)

          // If either node is not found, do not render the line
          if (!sourceNode || !targetNode) return null

          return (
            <React.Fragment
              key={`${sourceNode.x}-${sourceNode.y}-${targetNode.x}-${targetNode.y}`}
            >
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
            key={`${node.x}-${node.y}`}
            cx={node.x}
            cy={node.y}
            color="gold"
            isActive={idx < activeNodeIndex}
          />
        ))}
      </svg>
      <div
        className="absolute inset-0 flex justify-center items-center transition-opacity duration-500 ease-in-out cursor-pointer flex-col gap-2"
        style={{ opacity: isHovered ? 1 : 0 }}
      >
        <span className="text-zinc-200 text-sm bg-black/5">
          Each star represents a weekly habit to complete.
        </span>
        <span className="text-zinc-200 text-sm bg-black/5">
          As you track habits, this constellation will connect.
        </span>
        <button
          onClick={() => toggleView()}
          className="text-yellow-400 text-sm rounded-md hover:bg-yellow-400/15 py-1 px-2 flex gap-1 align-middle"
        >
          <FaCaretRight className="self-center text-xl" />
          Track Habits
        </button>
      </div>
    </div>
  )
}

export default Constellation
