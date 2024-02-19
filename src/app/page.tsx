'use client'

import AddHabit from '@/components/AddHabit'
import Constellation from '@/components/Constellation/Constellation'
import DateSelector from '@/components/DateSelector'
import HabitTable from '@/components/HabitTable'
import WeeklyHabits from '@/components/WeeklyHabits'
import { default as generateConstellation } from '@/hooks/UseConstellation'
import { Connection, Habit, Node } from '@/types'
import { format, isSameWeek, startOfWeek } from 'date-fns'
import { useEffect, useState } from 'react'
import { animated, useSpring, useTransition } from 'react-spring'

// REMOVE ONCE ADDRESSED WITH FORK
const originalWarn = console.error
console.error = (...args) => {
  if (
    args[0].includes(
      'Support for defaultProps will be removed from function components in a future major release.'
    )
  ) {
    return
  }
  originalWarn(...args)
}

const normalizedDateString = (date: Date) => {
  return format(date, 'yyyy-MM-dd')
}

const getWeekKey = (date: Date): string => {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  return format(start, 'yyyy-MM-dd')
}

const getCompletedHabitsForWeek = (
  entries: Entries,
  selectedDate: Date | null
): string[] => {
  if (!selectedDate) return []

  return Object.keys(entries)
    .filter((key) => {
      return isSameWeek(key, normalizedDateString(selectedDate))
    })
    .reduce((acc: string[], key) => {
      const entry = entries[key]
      return acc.concat(entry.completedHabitIds)
    }, [])
}

interface Entry {
  completedHabitIds: string[]
}

interface ConstellationData {
  nodes: Node[]
  connections: Connection[]
}

type Entries = { [key: string]: Entry }

type Constellations = { [key: string]: ConstellationData }

const Home = () => {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: 'Exercise', frequencyPerWeek: 3 },
    { id: '2', name: 'Read', frequencyPerWeek: 5 },
    { id: '3', name: 'Meditate', frequencyPerWeek: 7 },
  ])
  const [nextId, setNextId] = useState('1')
  const addHabit = (e: React.FormEvent, name: string, frequency: string) => {
    e.preventDefault()

    const newHabit: Habit = {
      id: nextId,
      name,
      frequencyPerWeek: parseInt(frequency),
    }

    setHabits([...habits, newHabit])
    setNextId(nextId + 1)
  }

  const handleDelete = (id: string) => {
    setHabits(habits.filter((habit) => habit.id !== id))
  }

  const todaysDate = new Date()
  const [selectedDate, setSelectedDate] = useState<Date | null>(todaysDate)

  const [entries, setEntries] = useState<Entries>({
    [normalizedDateString(todaysDate)]: { completedHabitIds: [] },
  })

  const nodeCount = habits.reduce(
    (acc, habit) => acc + habit.frequencyPerWeek,
    0
  )

  const [constellations, setConstellations] = useState<Constellations>({
    [getWeekKey(todaysDate)]: generateConstellation(nodeCount, 550, 400),
  })

  useEffect(() => {
    const weekKey = getWeekKey(selectedDate || new Date())

    if (!constellations[weekKey]) {
      const { nodes, connections } = generateConstellation(nodeCount, 550, 400)
      setConstellations((prev) => ({
        ...prev,
        [weekKey]: { nodes, connections },
      }))
    }
  }, [selectedDate, constellations, nodeCount])

  const weeklyConstellation = constellations[
    getWeekKey(selectedDate || todaysDate)
  ] || { nodes: [], connections: [] }

  const dailyEntry =
    selectedDate && entries[normalizedDateString(selectedDate)]
      ? entries[normalizedDateString(selectedDate)]
      : { completedHabitIds: [] }

  const toggleDailyHabit = (habit: Habit) => {
    if (!selectedDate) return

    if (dailyEntry.completedHabitIds.includes(habit.id)) {
      dailyEntry.completedHabitIds = dailyEntry.completedHabitIds.filter(
        (id) => id !== habit.id
      )
    } else {
      dailyEntry.completedHabitIds.push(habit.id)
    }
    setEntries({
      ...entries,
      [normalizedDateString(selectedDate)]: dailyEntry,
    })
  }

  const [view, setView] = useState<'HABITS' | 'DAILY'>('DAILY')
  const [isFirstMount, setIsFirstMount] = useState(true)

  useEffect(() => {
    setIsFirstMount(false)
  }, [])

  const leftPanelTransitions = useTransition(view, {
    from: isFirstMount ? {} : { opacity: 0, x: -500 },
    enter: { opacity: 1, x: 0 },
    leave: { opacity: 0, x: -500 },
    config: { duration: 500 },
  })

  const { x } = useSpring({
    x: isFirstMount ? 0 : view === 'HABITS' ? 0 : -500, // need to adjust for daily
    config: { duration: 500 },
    from: { x: 0 },
  })

  const rightPanelTransitions = useTransition(view, {
    from: isFirstMount ? {} : { opacity: 0, x: 500 },
    enter: { opacity: 1, x: 0 },
    leave: { opacity: 0, x: 500 },
    config: { duration: 500 },
  })

  const completedWeeklyHabits = getCompletedHabitsForWeek(entries, selectedDate)

  return (
    <div className="bg-soft-black flex min-h-screen flex-col items-center justify-center py-5 text-lg">
      <div className="w-full max-w-4xl px-4 relative">
        {leftPanelTransitions((style, viewState) =>
          viewState === 'HABITS' ? (
            <animated.div
              style={style}
              className="min-w-fit gap-4 flex flex-col self-center absolute top-[-140px] left-[-40px]"
            >
              <AddHabit addHabit={addHabit} />
              <HabitTable habits={habits} handleDelete={handleDelete} />
            </animated.div>
          ) : null
        )}

        <animated.div
          style={{ transform: x.to((x) => `translate3d(${x}px, 0, 0)`) }}
          className="absolute top-[-220px] right-[-55px]"
        >
          <Constellation
            nodes={weeklyConstellation.nodes}
            connections={weeklyConstellation.connections}
            nodeCount={habits.reduce(
              (acc, habit) => acc + habit.frequencyPerWeek,
              0
            )}
            width={550}
            height={400}
            completedHabits={completedWeeklyHabits.length}
            toggleView={() => setView(view === 'HABITS' ? 'DAILY' : 'HABITS')}
          />
        </animated.div>
        {rightPanelTransitions((style, viewState) =>
          viewState === 'DAILY' ? (
            <animated.div
              style={style}
              className="cal flex flex-col gap-3 absolute top-[-140px] right-[-75px] w-[414px]"
            >
              <DateSelector
                selectedDate={selectedDate ? selectedDate : todaysDate}
                setSelectedDate={setSelectedDate}
              />
              <WeeklyHabits
                dailyCompletedHabits={dailyEntry.completedHabitIds}
                weeklyCompletedHabits={completedWeeklyHabits}
                habits={habits}
                onToggle={toggleDailyHabit}
              />
            </animated.div>
          ) : null
        )}
      </div>
    </div>
  )
}

export default Home
