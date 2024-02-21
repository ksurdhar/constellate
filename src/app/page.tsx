'use client'

import AddHabit from '@/components/AddHabit'
import Constellation from '@/components/Constellation/Constellation'
import DateSelector from '@/components/DateSelector'
import HabitTable from '@/components/HabitTable'
import WeeklyHabits from '@/components/WeeklyHabits'
import { default as generateConstellation } from '@/hooks/UseConstellation'
import {
  ConstellationData,
  Constellations,
  Entries,
  Entry,
  Habit,
} from '@/types'
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

const getWeeklyEntries = (entries: Entries, date: Date): Entries => {
  const weekKey = getWeekKey(date)
  const weeklyEntries: Entries = {}
  Object.keys(entries)
    .filter((key) => isSameWeek(key, weekKey))
    .map((key) => (weeklyEntries[key] = entries[key]))
  return weeklyEntries
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

  const defaultConstellation = generateConstellation(nodeCount, 550, 400)
  const [constellations, setConstellations] = useState<Constellations>({
    [getWeekKey(todaysDate)]: defaultConstellation,
  })

  const [weeklyConstellation, setWeeklyConstellation] =
    useState<ConstellationData>(defaultConstellation)

  // potentially generates new constellations when the date changes
  const updateDate = (date: Date | null) => {
    setSelectedDate(date)

    const weekKey = getWeekKey(date || new Date())

    if (!constellations[weekKey]) {
      const { nodes, connections } = generateConstellation(nodeCount, 550, 400)
      setConstellations({
        ...constellations,
        [weekKey]: { nodes, connections },
      })
      setWeeklyConstellation({ nodes, connections })
    } else if (weeklyConstellation !== constellations[weekKey]) {
      setWeeklyConstellation(constellations[weekKey])
    }
  }

  const regenerate = () => {
    const weekKey = getWeekKey(selectedDate || new Date())

    const { nodes, connections } = generateConstellation(nodeCount, 550, 400)
    setConstellations({
      ...constellations,
      [weekKey]: { nodes, connections },
    })
    setWeeklyConstellation({ nodes, connections })
  }

  // listens for changes to nodeCount (modifications to habits) and updates constellations
  useEffect(() => {
    const weekKey = getWeekKey(selectedDate || new Date())
    if (constellations[weekKey].nodes.length !== nodeCount) {
      const { nodes, connections } = generateConstellation(nodeCount, 550, 400)
      setConstellations({
        ...constellations,
        [weekKey]: { nodes, connections },
      })
      setWeeklyConstellation({ nodes, connections })

      const weeklyEntries = getWeeklyEntries(
        entries,
        selectedDate || new Date()
      )

      // remove completedHabitIds that no longer exist
      const updatedEntries = { ...weeklyEntries }
      Object.keys(weeklyEntries).forEach((key) => {
        updatedEntries[key] = {
          ...updatedEntries[key],
          completedHabitIds: updatedEntries[key].completedHabitIds.filter(
            (id) => habits.some((habit) => habit.id === id)
          ),
        }
      })
      setEntries(updatedEntries)
    }
  }, [nodeCount, constellations, selectedDate, entries, habits])

  const dailyEntry =
    selectedDate && entries[normalizedDateString(selectedDate)]
      ? entries[normalizedDateString(selectedDate)]
      : { completedHabitIds: [] }

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
            regenerate={regenerate}
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
                setSelectedDate={updateDate}
              />
              <WeeklyHabits
                dailyEntry={dailyEntry}
                weeklyCompletedHabits={completedWeeklyHabits}
                habits={habits}
                updateEntry={(updatedEntry: Entry) => {
                  if (!selectedDate) return
                  setEntries({
                    ...entries,
                    [normalizedDateString(selectedDate)]: updatedEntry,
                  })
                }}
              />
            </animated.div>
          ) : null
        )}
      </div>
    </div>
  )
}

export default Home
