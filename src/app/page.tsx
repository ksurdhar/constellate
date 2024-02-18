'use client'

import AddHabitForm from '@/components/AddHabitForm'
import Constellation from '@/components/Constellation/Constellation'
import DailyHabits from '@/components/DailyHabits'
import HabitTable from '@/components/HabitTable'
import { Habit } from '@/types'
import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { DatePickerCalendar } from 'react-nice-dates'
import 'react-nice-dates/build/style.css'
import { animated, useSpring, useTransition } from 'react-spring'

interface Entry {
  completedHabitIds: string[] // display empty checkboxes for every habit, add only if checked
}

type Entries = { [key: string]: Entry }

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

const normalizeDate = (date: Date) => {
  return date.toISOString().slice(0, 10)
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
    [normalizeDate(todaysDate)]: { completedHabitIds: [] },
  })

  // get entries for current week

  const dailyEntry =
    selectedDate && entries[normalizeDate(selectedDate)]
      ? entries[normalizeDate(selectedDate)]
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
      [normalizeDate(selectedDate)]: dailyEntry,
    })
    console.log(entries)
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
    config: { duration: 600 },
  })

  const { x } = useSpring({
    x: isFirstMount ? 0 : view === 'HABITS' ? 0 : -500,
    config: { duration: 600 },
    from: { x: 0 },
  })

  const rightPanelTransitions = useTransition(view, {
    from: isFirstMount ? {} : { opacity: 0, x: 500 },
    enter: { opacity: 1, x: 0 },
    leave: { opacity: 0, x: 500 },
    config: { duration: 600 },
  })

  return (
    <div className="bg-soft-black flex min-h-screen flex-col items-center justify-center py-5 text-lg">
      <div className="w-full max-w-4xl px-4 relative">
        {leftPanelTransitions((style, viewState) =>
          viewState === 'HABITS' ? (
            <animated.div
              style={style}
              className="min-w-fit flex-1 gap-4 flex flex-col self-center absolute top-[-120px] left-[-40px]"
            >
              <AddHabitForm addHabit={addHabit} />
              <HabitTable habits={habits} handleDelete={handleDelete} />
            </animated.div>
          ) : null
        )}

        <animated.div
          style={{ transform: x.to((x) => `translate3d(${x}px, 0, 0)`) }}
          className="flex-1 absolute top-[-200px] right-[-55px]"
        >
          <Constellation
            nodeCount={habits.reduce(
              (acc, habit) => acc + habit.frequencyPerWeek,
              0
            )}
            width={550}
            height={400}
            toggleView={() => setView(view === 'HABITS' ? 'DAILY' : 'HABITS')}
          />
        </animated.div>
        {rightPanelTransitions((style, viewState) =>
          viewState === 'DAILY' ? (
            <animated.div
              style={style}
              className="cal flex-1 absolute top-[-200px] right-[-80px] w-[550px] h-[600px]"
            >
              <p>
                Selected date:{' '}
                {selectedDate
                  ? format(selectedDate, 'dd MMM yyyy', { locale: enGB })
                  : 'none'}
                .
              </p>
              <div className="flex gap-3">
                <div className="flex-[2] h-96">
                  <DatePickerCalendar
                    date={selectedDate ? selectedDate : todaysDate}
                    onDateChange={(date) => setSelectedDate(date)}
                    locale={enGB}
                  />
                </div>
                <DailyHabits
                  completedHabitIds={dailyEntry.completedHabitIds}
                  habits={habits}
                  onToggle={toggleDailyHabit}
                />
              </div>
            </animated.div>
          ) : null
        )}
      </div>
    </div>
  )
}

export default Home
