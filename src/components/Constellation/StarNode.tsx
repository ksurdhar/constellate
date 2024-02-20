import React, { useEffect, useState } from 'react'
import { animated, config, useSpring, useTransition } from 'react-spring'

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
    let haloTimeout: number
    let interval: number
    let showHaloTimeout: number

    const toggleHalo = () => {
      showHaloTimeout = window.setTimeout(() => setShowHalo(true), 550)
      if (haloTimeout) clearTimeout(haloTimeout)
      haloTimeout = window.setTimeout(() => setShowHalo(false), 1200)
    }

    if (isActive) {
      toggleHalo()
      interval = window.setInterval(toggleHalo, 8000)
    }

    return () => {
      if (haloTimeout) clearTimeout(haloTimeout)
      if (interval) clearInterval(interval)
      if (showHaloTimeout) clearTimeout(showHaloTimeout)
      setShowHalo(false)
    }
  }, [isActive])

  const transitions = useTransition(true, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 1000 },
  })

  const fillStyles = useSpring({
    fill: isActive ? color : 'rgba(12, 14, 18, 0.99)',
    stroke: isActive ? color : 'white',
    config: { duration: 500 },
  })

  return transitions((style, item) =>
    item ? (
      <>
        {showHalo && <Halo cx={cx} cy={cy} color={color} showHalo={showHalo} />}
        <animated.circle
          cx={cx}
          cy={cy}
          r="3"
          style={{ ...style, ...fillStyles }}
          strokeWidth="1"
        />
      </>
    ) : (
      ''
    )
  )
}

export default React.memo(StarNode)
