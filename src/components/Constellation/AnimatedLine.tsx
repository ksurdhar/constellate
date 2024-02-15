import React from 'react'
import { animated, useSpring } from 'react-spring'

interface AnimatedLineProps {
  x1: number
  y1: number
  x2: number
  y2: number
  isActive: boolean
}

const AnimatedLine: React.FC<AnimatedLineProps> = ({
  x1,
  y1,
  x2,
  y2,
  isActive,
}) => {
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
  const dashLength = 5
  const gapLength = 5
  const totalDashLength = dashLength + gapLength
  const dashRepeat = Math.ceil(length / totalDashLength)
  const initialStrokeDashoffset = dashRepeat * totalDashLength
  const strokeDasharray = `${dashLength}, ${gapLength}`

  const originalAnimatedProps = useSpring({
    from: { strokeDashoffset: initialStrokeDashoffset },
    to: { strokeDashoffset: 0 },
    config: { duration: 8000 },
    reset: true,
    onRest: () => {
      originalAnimatedProps.strokeDashoffset.start({
        from: initialStrokeDashoffset,
        to: 0,
      })
    },
  })

  const activeAnimatedProps = useSpring({
    from: { opacity: 0.4 },
    to: { opacity: 1 },
    config: { duration: 2000 },
    loop: { reverse: true },
  })

  if (isActive) {
    return (
      <svg style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <animated.line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="gold"
          strokeWidth="2"
          style={{
            ...activeAnimatedProps,
          }}
        />
      </svg>
    )
  } else {
    // Original inactive state
    return (
      <svg style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <animated.line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="white"
          strokeWidth="1"
          strokeDasharray={strokeDasharray}
          style={originalAnimatedProps}
        />
      </svg>
    )
  }
}

export default AnimatedLine
