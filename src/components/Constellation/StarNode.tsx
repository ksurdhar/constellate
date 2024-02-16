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
      setShowHalo(true)
      setTimeout(() => setShowHalo(false), 1000)
    }

    if (isActive) {
      toggleHalo()

      const interval = window.setInterval(() => {
        toggleHalo()
      }, 4000)

      return () => clearInterval(interval)
    }
  }, [isActive])

  return (
    <>
      {showHalo && <Halo cx={cx} cy={cy} color={color} showHalo={showHalo} />}
      <animated.circle
        cx={cx}
        cy={cy}
        r="3"
        fill={isActive ? color : 'black'}
        stroke={isActive ? color : 'white'}
        strokeWidth="1"
      />
    </>
  )
}

export default React.memo(StarNode)
