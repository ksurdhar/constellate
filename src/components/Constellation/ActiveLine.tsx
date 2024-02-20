import React from 'react'
import { animated, useTransition } from 'react-spring'

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
  const transitions = useTransition(isActive, {
    from: { x: x1, y: y1, opacity: 0 },
    enter: { x: x2, y: y2, opacity: 1 },
    leave: { x: x1, y: y1, opacity: 0 },
    config: { duration: 500 },
  })

  return transitions((style, item) =>
    item ? (
      <animated.line
        x1={x1}
        y1={y1}
        x2={style.x}
        y2={style.y}
        stroke="gold"
        strokeWidth="2"
        style={{ opacity: style.opacity }}
      />
    ) : (
      ''
    )
  )
}

export default React.memo(ActiveLine)
