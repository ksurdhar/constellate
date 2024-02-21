'use client'

import { GrPowerCycle } from 'react-icons/gr'

import { Connection, Node } from '@/types'
import React, { useEffect, useRef, useState } from 'react'
import { FaCaretRight } from 'react-icons/fa'
import ActiveLine from './ActiveLine'
import InactiveLine from './InactiveLine'
import StarNode from './StarNode'

interface ConstellationProps {
  nodes: Node[]
  connections: Connection[]
  nodeCount: number
  width: number
  height: number
  view: 'HABITS' | 'DAILY'
  completedHabits: number
  toggleView: () => void
  regenerate: () => void
}

const Constellation: React.FC<ConstellationProps> = ({
  nodes,
  connections,
  nodeCount,
  width,
  height,
  completedHabits,
  toggleView,
  view,
  regenerate,
}) => {
  const [activeNodeIndex, setActiveNodeIndex] = useState(0)
  const [activeConnectionIndex, setActiveConnectionIndex] = useState(-1)
  const [isHovered, setIsHovered] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const prevNodeRef = useRef<string>(
    nodes.length > 0 ? `${nodes[0].x}-${nodes[0].y}` : 'empty'
  )

  useEffect(() => {
    let timeoutId: number

    // Update the node signature to detect constellation changes
    const prevNodeSignature = prevNodeRef.current
    prevNodeRef.current =
      nodes.length > 0 ? `${nodes[0].x}-${nodes[0].y}` : 'empty'
    const isNewConstellation = prevNodeSignature !== prevNodeRef.current

    let startIndex = isNewConstellation ? 0 : Math.max(0, completedHabits)

    const updateIndicies = () => {
      if (
        (isNewConstellation && startIndex <= completedHabits) ||
        (!isNewConstellation && startIndex !== completedHabits - 1)
      ) {
        setActiveNodeIndex(startIndex)
        setActiveConnectionIndex(startIndex - 2)

        const stepSize =
          isNewConstellation || startIndex < completedHabits ? 1 : -1
        startIndex += stepSize

        const continueCondition = isNewConstellation
          ? startIndex <= completedHabits
          : startIndex !== completedHabits

        if (continueCondition) {
          const delay = isNewConstellation ? 300 : 0 // only incrementally draw if new constellation
          timeoutId = window.setTimeout(updateIndicies, delay)
        }
      }
    }

    updateIndicies()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [completedHabits, nodes])

  useEffect(() => {
    // hack to prevent nextjs from complaining about SSR
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
        Add habits to begin forming a constellation.
      </div>
    )
  }

  return (
    <div style={{ width, height }} className="relative">
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
          Go to {view === 'HABITS' ? 'Tracker' : 'Habits'}
        </button>
      </div>

      <div
        className={`absolute h-[max-content] inset-0 flex cursor-pointer flex-row-reverse hover:opacity-100 transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          onClick={regenerate}
          className="text-zinc-600 absolute text-xs rounded-md hover:bg-zinc-400/15 hover:text-zinc-400 transition-colors py-1 px-2 flex gap-1 align-middle"
        >
          <GrPowerCycle className="self-center text-base" />
          REGENERATE
        </button>
      </div>
    </div>
  )
}

export default Constellation
