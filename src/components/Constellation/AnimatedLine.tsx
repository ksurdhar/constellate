import React, { useEffect, useState } from 'react'
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

  const [_, forceAnimation] = useState(false)

  useEffect(() => {
    forceAnimation(true)
  }, [])

  const commonProps = {
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
    strokeWidth: '2',
  }

  const inactiveStyles = useSpring({
    from: { strokeDashoffset: initialStrokeDashoffset },
    to: { strokeDashoffset: 0 },
    config: { duration: 8000 },
    reset: true,
    opacity: isActive ? 0 : 1,
    onRest: () => {
      inactiveStyles.strokeDashoffset.start({
        from: initialStrokeDashoffset,
        to: 0,
      })
    },
  })

  const activeStyles = useSpring({
    opacity: isActive ? 1 : 0,
    config: { duration: 2000 },
    loop: isActive ? { reverse: true } : false,
  })

  return (
    <svg style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <animated.line
        {...commonProps}
        stroke="white"
        strokeWidth="1"
        strokeDasharray={strokeDasharray}
        style={inactiveStyles}
      />
      <animated.line
        {...commonProps}
        stroke="gold"
        strokeWidth="2"
        style={activeStyles}
      />
    </svg>
  )
}

export default React.memo(AnimatedLine)
