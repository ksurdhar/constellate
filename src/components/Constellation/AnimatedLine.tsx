import { animated, useSpring } from 'react-spring'

interface AnimatedLineProps {
  x1: number
  y1: number
  x2: number
  y2: number
}

const AnimatedLine = ({ x1, y1, x2, y2 }: AnimatedLineProps) => {
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

  const dashLength = 5
  const gapLength = 5
  const totalDashLength = dashLength + gapLength

  const dashRepeat = Math.ceil(length / totalDashLength)
  const initialStrokeDashoffset = dashRepeat * totalDashLength
  const strokeDasharray = `${dashLength}, ${gapLength}`

  const animatedProps = useSpring({
    from: { strokeDashoffset: initialStrokeDashoffset },
    to: { strokeDashoffset: 0 },
    config: { duration: 8000 },
    reset: true,
    onRest: () => {
      animatedProps.strokeDashoffset.start({
        from: initialStrokeDashoffset,
        to: 0,
      })
    },
  })

  return (
    <animated.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="white"
      strokeWidth="1"
      strokeDasharray={strokeDasharray}
      style={animatedProps}
    />
  )
}

export default AnimatedLine
