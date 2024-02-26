'use client'

import AddHabit from '@/components/AddHabit'
import Constellation from '@/components/Constellation/Constellation'
import DateSelector from '@/components/DateSelector'
import HabitTable from '@/components/HabitTable'
import WeeklyHabits from '@/components/WeeklyHabits'
import { useConstellations } from '@/hooks/UseConstellations'
import { useEntries } from '@/hooks/UseEntries'
import { useHabits } from '@/hooks/UseHabits'
import { usePanelTransitions } from '@/hooks/UsePanelTransitions'
import { Entries, Entry, Habit } from '@/types'
import {
  getCompletedHabitsForWeek,
  getWeekKey,
  getWeeklyEntries,
} from '@/utilities/dateUtils'
import { SignOutButton, SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'
import { useState } from 'react'
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from 'react-icons/md'
import { animated } from 'react-spring'

interface TrackerProps {
  serverHabits?: Habit[]
  serverEntries: Entries
}

const Tracker = ({ serverHabits, serverEntries }: TrackerProps) => {
  const { habits, addHabit, deleteHabit } = useHabits(serverHabits)
  const habitCount = habits.reduce((acc, habit) => acc + habit.frequency, 0)

  const {
    weeklyConstellation,
    setWeeklyConstellation,
    constellations,
    regenerate,
  } = useConstellations()

  const todaysDate = new Date()

  const [selectedDate, setSelectedDate] = useState<Date | null>(todaysDate)

  const { entries, setEntries, dailyEntry, updateEntry } = useEntries(
    serverEntries,
    selectedDate || todaysDate
  )

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
        <SignedIn>
          <SignOutButton>
            <div className="cursor-pointer transition-colors hover:text-zinc-200">
              LOGOUT
            </div>
          </SignOutButton>
        </SignedIn>
        <SignedOut>
          <div className="cursor-pointer transition-colors hover:text-zinc-200">
            <Link href="/sign-in">LOGIN</Link>
          </div>
        </SignedOut>
      </nav>
      <div className="flex min-h-screen flex-col items-center justify-center py-5 text-lg">
        <div className="w-full max-w-4xl px-4 relative">
          {leftPanelTransitions((style, viewState) =>
            viewState === 'HABITS' ? (
              <animated.div
                style={style}
                className="min-w-fit gap-4 flex flex-col self-center absolute top-[-140px] left-[-40px]"
              >
                <AddHabit
                  addHabit={(name, frequency) => {
                    addHabit(name, frequency)
                    regenerate(
                      selectedDate || new Date(),
                      habitCount + parseInt(frequency)
                    )
                  }}
                />
                <HabitTable
                  habits={habits}
                  handleDelete={(id, frequency) => {
                    deleteHabit(id)
                    regenerate(
                      selectedDate || new Date(),
                      habitCount - frequency
                    )
                    const weeklyEntries = getWeeklyEntries(
                      entries,
                      selectedDate || new Date()
                    )
                    const updatedEntries = { ...weeklyEntries }
                    Object.keys(weeklyEntries).forEach((key) => {
                      updatedEntries[key] = {
                        ...updatedEntries[key],
                        completedHabitIds: updatedEntries[
                          key
                        ].completedHabitIds.filter((id) =>
                          habits.some((habit) => habit.id === id)
                        ),
                      }
                    })
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
                (acc, habit) => acc + habit.frequency,
                0
              )}
              width={550}
              height={400}
              completedHabits={completedWeeklyHabits.length}
              regenerate={() =>
                regenerate(selectedDate || new Date(), habitCount)
              }
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
                  setSelectedDate={(date: Date | null) => {
                    setSelectedDate(date)
                    const weekKey = getWeekKey(date || new Date())

                    if (!constellations[weekKey]) {
                      regenerate(date || new Date(), habitCount)
                    } else if (
                      weeklyConstellation !== constellations[weekKey]
                    ) {
                      setWeeklyConstellation(constellations[weekKey])
                    }
                  }}
                />
                <WeeklyHabits
                  dailyEntry={dailyEntry}
                  weeklyCompletedHabits={completedWeeklyHabits}
                  habits={habits}
                  updateEntry={(updatedEntry: Entry) => {
                    if (!selectedDate) return
                    updateEntry(updatedEntry, selectedDate)
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

export default Tracker
