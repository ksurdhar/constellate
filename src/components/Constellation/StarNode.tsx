import React, { useEffect, useState } from 'react'
import { animated, config, useSpring } from 'react-spring'

interface HaloProps {
  cx: number
  cy: number
  color: string
  showHalo: boolean
}

const Halo: React.FC<HaloProps> = ({ cx, cy, color, showHalo }) => {
  const [props, set] = useSpring(() => ({
    r: 3,
    opacity: 1,
    config: config.gentle,
    onRest: () => {
      if (showHalo) {
        set({ opacity: 0, immediate: true })
        set({ r: 3, opacity: 1, immediate: false })
      }
    },
  }))

  useEffect(() => {
    if (showHalo) {
      set({ r: 10, opacity: 0 })
    } else {
      set({ r: 3, opacity: 1, immediate: true })
    }
  }, [showHalo, set])

  return (
    <animated.circle
      cx={cx}
      cy={cy}
      r={props.r}
      fill="none"
      stroke={color}
      strokeWidth="2"
      style={{
        opacity: props.opacity,
      }}
    />
  )
}

interface StarNodeProps {
  cx: number
  cy: number
  color: string
  isActive?: boolean
}

const StarNode: React.FC<StarNodeProps> = ({
  cx,
  cy,
  color,
  isActive = true,
}) => {
  const [showHalo, setShowHalo] = useState(false)

  useEffect(() => {
    const toggleHalo = () => {
      setTimeout(() => setShowHalo(true), 800)
      setTimeout(() => setShowHalo(false), 2000)
    }

    if (isActive) {
      toggleHalo()

      const interval = window.setInterval(() => {
        toggleHalo()
      }, 8000)

      return () => clearInterval(interval)
    }
  }, [isActive])

  const [_, forceAnimation] = useState(false)

  useEffect(() => {
    forceAnimation(true)
  }, [])

  const style = useSpring({
    fill: isActive ? color : 'rgba(12, 14, 18, 0.99)',
    stroke: isActive ? color : 'white',
    config: { duration: 800 }, // Transition duration of 800ms
  })

  return (
    <>
      {showHalo && <Halo cx={cx} cy={cy} color={color} showHalo={showHalo} />}
      <animated.circle
        cx={cx}
        cy={cy}
        r="3"
        fill={isActive ? color : 'rgba(12, 14, 18, 0.99)'}
        stroke={isActive ? color : 'white'}
        strokeWidth="1"
        style={style}
      />
    </>
  )
}

export default React.memo(StarNode)
