import React, { useEffect, useState } from 'react'
import { animated, useSpring } from 'react-spring'

interface InactiveLineProps {
  x1: number
  y1: number
  x2: number
  y2: number
}

const InactiveLine: React.FC<InactiveLineProps> = ({ x1, y1, x2, y2 }) => {
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
    onRest: () => {
      inactiveStyles.strokeDashoffset.start({
        from: initialStrokeDashoffset,
        to: 0,
      })
    },
  })

  const fadeStyles = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    reset: true,
    config: { duration: 2000 },
  })

  return (
    <svg style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <animated.line
        {...commonProps}
        stroke="white"
        strokeWidth="1"
        strokeDasharray={strokeDasharray}
        style={{ ...inactiveStyles, ...fadeStyles }}
      />
    </svg>
  )
}

export default React.memo(InactiveLine)
