import React from 'react'
import { animated, easings, useSpring } from 'react-spring'

interface ActiveLineProps {
  x1: number
  y1: number
  x2: number
  y2: number
  isActive: boolean
}

const ActiveLine: React.FC<ActiveLineProps> = ({
  x1,
  y1,
  x2,
  y2,
  isActive,
}) => {
  const { x, y } = useSpring({
    from: { x: x1, y: y1 },
    to: { x: isActive ? x2 : x1, y: isActive ? y2 : y1 },
    config: { duration: 1100, easing: easings.easeInOutExpo },
  })

  return (
    <svg style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <animated.line
        x1={x1}
        y1={y1}
        x2={x}
        y2={y}
        stroke="gold"
        strokeWidth="2"
      />
    </svg>
  )
}

export default React.memo(ActiveLine)
