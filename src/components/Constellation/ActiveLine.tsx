import React, { useEffect } from 'react'
import { animated, useSpring } from 'react-spring'

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
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

  useEffect(() => {
    if (isActive) {
      setSpring({
        reset: true,
        from: { strokeDashoffset: length },
        strokeDashoffset: 0,
      })
    }
  }, [isActive, length])

  const [{ strokeDashoffset }, setSpring] = useSpring(() => ({
    strokeDashoffset: length,
    from: { strokeDashoffset: length },
    config: { duration: 1000 },
  }))

  const activeStyles = useSpring({
    opacity: isActive ? 1 : 0,
    config: { duration: 500 },
  })

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
          strokeDasharray: length,
          strokeDashoffset,
          ...activeStyles,
        }}
      />
    </svg>
  )
}

export default React.memo(ActiveLine)
