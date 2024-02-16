import useConstellation from '@/hooks/UseConstellation'
import { Connection, Node } from '@/types'
import React, { useEffect, useState } from 'react'
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

  const [activeNodeIds, setActiveNodeIds] = useState<Set<number>>(new Set())
  const [activeLineIds, setActiveLineIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const interval = setInterval(() => {
      // Determine the next node and line to activate
      let nextNode: Node | undefined
      let nextLine: Connection | undefined

      if (activeNodeIds.size === 0) {
        // Activate the first primary node initially
        nextNode = nodes.find((node) => !node.branches)
      } else {
        // Find the last activated node
        const lastActiveNodeId = Array.from(activeNodeIds).pop()
        const lastActiveNode = nodes.find(
          (node) => node.id === lastActiveNodeId
        )

        // Determine the next node to activate: look for connected nodes in the order of connections
        for (const connection of connections) {
          const isSourceActive = activeNodeIds.has(connection.source)
          const isTargetActive = activeNodeIds.has(connection.target)
          if (isSourceActive && !isTargetActive) {
            nextNode = nodes.find((node) => node.id === connection.target)
            nextLine = connection
            break
          } else if (!isSourceActive && isTargetActive) {
            nextNode = nodes.find((node) => node.id === connection.source)
            nextLine = connection
            break
          }
        }

        // If no next node found in connections (end of branch), activate the next primary node
        if (!nextNode) {
          nextNode = nodes.find(
            (node) => !node.branches && !activeNodeIds.has(node.id)
          )
        }
      }

      // Update the active states
      if (nextNode) {
        setActiveNodeIds(new Set([...activeNodeIds, nextNode.id]))
      }
      if (nextLine) {
        setActiveLineIds(
          new Set([...activeLineIds, `${nextLine.source}-${nextLine.target}`])
        )
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [nodes, connections, activeNodeIds, activeLineIds])

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
            isActive={activeLineIds.has(
              `${connection.source}-${connection.target}`
            )}
          />
        )
      })}
      {nodes.map((node, idx) => (
        <StarNode
          key={node.id}
          cx={node.x}
          cy={node.y}
          color="gold"
          isActive={activeNodeIds.has(node.id)}
        />
      ))}
    </svg>
  )
}

export default Constellation
