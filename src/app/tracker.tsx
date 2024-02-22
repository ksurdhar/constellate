'use client'

import AddHabit from '@/components/AddHabit'
import Constellation from '@/components/Constellation/Constellation'
import DateSelector from '@/components/DateSelector'
import HabitTable from '@/components/HabitTable'
import WeeklyHabits from '@/components/WeeklyHabits'
import { useHabits } from '@/hooks/UseHabits'
import { usePanelTransitions } from '@/hooks/UsePanelTransitions'
import { ConstellationData, Constellations, Entries, Entry } from '@/types'
import {
  getCompletedHabitsForWeek,
  getWeekKey,
  getWeeklyEntries,
  normalizedDateString,
} from '@/utilities/dateUtils'
import { default as generateConstellation } from '@/utilities/generateConstellation'
import { useEffect, useState } from 'react'
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from 'react-icons/md'
import { animated } from 'react-spring'

const Home = () => {
  const { habits, addHabit, deleteHabit } = useHabits()

  const nodeCount = habits.reduce(
    (acc, habit) => acc + habit.frequencyPerWeek,
    0
  )

  const todaysDate = new Date()

  const defaultConstellation = generateConstellation(nodeCount, 550, 400)

  const [constellations, setConstellations] = useState<Constellations>({
    [getWeekKey(todaysDate)]: defaultConstellation,
  })

  useEffect(() => {
    const storedConstellations = JSON.parse(
      localStorage.getItem('constellations') || '{}'
    ) as Constellations

    if (Object.keys(storedConstellations).length > 0) {
      setConstellations(storedConstellations)
    }
  }, [])

  const [weeklyConstellation, setWeeklyConstellation] =
    useState<ConstellationData>(defaultConstellation)

  useEffect(() => {
    const storedConstellations = JSON.parse(
      localStorage.getItem('constellations') || '{}'
    ) as Constellations

    if (
      Object.keys(storedConstellations).length > 0 &&
      storedConstellations[getWeekKey(new Date())]
    ) {
      setWeeklyConstellation(storedConstellations[getWeekKey(new Date())])
    }
  }, [])

  const [selectedDate, setSelectedDate] = useState<Date | null>(todaysDate)
  const [entries, setEntries] = useState<Entries>({
    [getWeekKey(todaysDate)]: { completedHabitIds: [] },
  })

  useEffect(() => {
    const storedEntries = JSON.parse(
      localStorage.getItem('entries') || '{}'
    ) as Entries

    if (Object.keys(storedEntries).length > 0) {
      setEntries(storedEntries)
    }
  }, [])

  const updateDate = (date: Date | null) => {
    setSelectedDate(date)
    const weekKey = getWeekKey(date || new Date())

    if (!constellations[weekKey]) {
      // generate new constellation + set
      const { nodes, connections } = generateConstellation(nodeCount, 550, 400)
      const updatedConstellations = {
        ...constellations,
        [weekKey]: { nodes, connections },
      }
      setConstellations(updatedConstellations)
      localStorage.setItem(
        'constellations',
        JSON.stringify(updatedConstellations)
      )
      setWeeklyConstellation({ nodes, connections })
    } else if (weeklyConstellation !== constellations[weekKey]) {
      // just sets previous constellation
      setWeeklyConstellation(constellations[weekKey])
    }
  }

  const regenerate = () => {
    const weekKey = getWeekKey(selectedDate || new Date())

    const { nodes, connections } = generateConstellation(nodeCount, 550, 400)
    const updatedConstellations = {
      ...constellations,
      [weekKey]: { nodes, connections },
    }
    setConstellations(updatedConstellations)
    localStorage.setItem(
      'constellations',
      JSON.stringify(updatedConstellations)
    )
    setWeeklyConstellation({ nodes, connections })
  }

  // listens for changes to nodeCount (modifications to habits) and updates constellations
  useEffect(() => {
    const weekKey = getWeekKey(selectedDate || new Date())
    if (constellations[weekKey].nodes.length !== nodeCount) {
      const { nodes, connections } = generateConstellation(nodeCount, 550, 400)
      const updatedConstellations = {
        ...constellations,
        [weekKey]: { nodes, connections },
      }
      setConstellations(updatedConstellations)
      localStorage.setItem(
        'constellations',
        JSON.stringify(updatedConstellations)
      )
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
      localStorage.setItem('entries', JSON.stringify(updatedEntries))
    }
  }, [nodeCount, constellations, selectedDate, entries, habits])

  const dailyEntry =
    selectedDate && entries[normalizedDateString(selectedDate)]
      ? entries[normalizedDateString(selectedDate)]
      : { completedHabitIds: [] }

  const [view, setView] = useState<'HABITS' | 'DAILY'>('DAILY')

  const { leftPanelTransitions, centerPanelX, rightPanelTransitions } =
    usePanelTransitions(view)

  const completedWeeklyHabits = getCompletedHabitsForWeek(entries, selectedDate)

  return (
    <>
      <nav className="flex flex-col gap-3 m-6 absolute right-0 text-sm font-semibold  text-zinc-500 ">
        <div
          onClick={() => setView('DAILY')}
          className={`${
            view === 'DAILY' ? 'text-yellow-400/75' : ''
          } cursor-pointer transition-colors hover:text-zinc-200`}
        >
          TRACKER
        </div>
        <div
          onClick={() => setView('HABITS')}
          className={`${
            view === 'HABITS' ? 'text-yellow-400/75' : ''
          } cursor-pointer transition-colors hover:text-zinc-200`}
        >
          HABITS
        </div>
        <div className="cursor-pointer transition-colors hover:text-zinc-200">
          FAQ
        </div>
      </nav>
      <div className="flex min-h-screen flex-col items-center justify-center py-5 text-lg">
        <div className="w-full max-w-4xl px-4 relative">
          {leftPanelTransitions((style, viewState) =>
            viewState === 'HABITS' ? (
              <animated.div
                style={style}
                className="min-w-fit gap-4 flex flex-col self-center absolute top-[-140px] left-[-40px]"
              >
                <AddHabit addHabit={addHabit} />
                <HabitTable habits={habits} handleDelete={deleteHabit} />
              </animated.div>
            ) : null
          )}

          {view === 'DAILY' && (
            <button
              title="Go to Habits"
              onClick={() => setView('HABITS')}
              className="text-zinc-700 absolute rounded-md hover:bg-zinc-400/15 hover:text-zinc-400 duration-300 transition-colors py-1 px-2 flex gap-1 align-middle text-4xl left-[-130px] top-[50%]"
            >
              <MdOutlineKeyboardArrowLeft />
            </button>
          )}

          <animated.div
            style={{
              transform: centerPanelX.to(
                (centerPanelX) => `translate3d(${centerPanelX}px, 0, 0)`
              ),
            }}
            className={`absolute top-[-220px] ${
              view === 'HABITS' ? 'right-[-80px]' : 'right-[-90px]'
            } `}
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
              view={view}
              toggleView={() => setView(view === 'HABITS' ? 'DAILY' : 'HABITS')}
            />
          </animated.div>
          {view === 'HABITS' && (
            <button
              onClick={() => setView('DAILY')}
              title="Go to Tracker"
              className="text-zinc-700 absolute rounded-md hover:bg-zinc-400/15 hover:text-zinc-400 duration-300 transition-colors py-1 px-2 flex gap-1 align-middle text-4xl right-[-130px] top-[50%]"
            >
              <MdOutlineKeyboardArrowRight />
            </button>
          )}
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
                    const updatedEntries = {
                      ...entries,
                      [normalizedDateString(selectedDate)]: updatedEntry,
                    }
                    setEntries(updatedEntries)
                    localStorage.setItem(
                      'entries',
                      JSON.stringify(updatedEntries)
                    )
                  }}
                />
              </animated.div>
            ) : null
          )}
        </div>
      </div>
    </>
  )
}

export default Home
