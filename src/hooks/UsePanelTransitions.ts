import { useEffect, useState } from 'react'
import { useSpring, useTransition } from 'react-spring'

export const usePanelTransitions = (view: string) => {
  const [isFirstMount, setIsFirstMount] = useState(true)
  const [allowAnimation, setAllowAnimation] = useState(false)

  useEffect(() => {
    setIsFirstMount(false)

    const timer = setTimeout(() => {
      setAllowAnimation(true)
    }, 1)

    return () => clearTimeout(timer)
  }, [])

  const leftPanelTransitions = useTransition(view, {
    from: isFirstMount ? {} : { opacity: 0, x: -500 },
    enter: { opacity: 1, x: 0 },
    leave: { opacity: 0, x: -500 },
    config: { duration: 500 },
  })

  const { x } = useSpring({
    to: { x: isFirstMount ? 0 : view === 'HABITS' ? 0 : -500 },
    from: { x: 0 },
    config: { duration: 500 },
    immediate: !allowAnimation,
  })

  const rightPanelTransitions = useTransition(view, {
    from: isFirstMount ? {} : { opacity: 0, x: 500 },
    enter: { opacity: 1, x: 0 },
    leave: { opacity: 0, x: 500 },
    config: { duration: 500 },
  })

  return {
    leftPanelTransitions,
    centerPanelX: x,
    rightPanelTransitions,
  }
}
