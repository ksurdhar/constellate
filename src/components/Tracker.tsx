'use client'

import AddHabit from '@/components/AddHabit'
import Constellation from '@/components/Constellation/Constellation'
import DateSelector from '@/components/DateSelector'
import HabitTable from '@/components/HabitTable'
import WeeklyHabits from '@/components/WeeklyHabits'
import { useConstellations } from '@/hooks/UseConstellations'
import { useEntries } from '@/hooks/UseEntries'
import { useHabits } from '@/hooks/UseHabits'
import { Constellations, Entries, Entry, Habit } from '@/types'
import {
  getCompletedHabitsForWeek,
  getWeekKey,
  getWeeklyProgress,
} from '@/utilities/dateUtils'
import { SignOutButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from 'react-icons/md'

interface TrackerProps {
  serverHabits?: Habit[]
  serverEntries: Entries
  serverConstellations: Constellations
}

const Tracker = ({
  serverHabits,
  serverEntries,
  serverConstellations,
}: TrackerProps) => {
  const { habits, addHabit, deleteHabit } = useHabits(serverHabits)
  const habitCount = habits.reduce((acc, habit) => acc + habit.frequency, 0)

  const {
    weeklyConstellation,
    setWeeklyConstellation,
    constellations,
    regenerate,
  } = useConstellations(serverConstellations)

  const todaysDate = new Date()

  const [selectedDate, setSelectedDate] = useState<Date | null>(todaysDate)

  const { entries, dailyEntry, updateEntry } = useEntries(
    serverEntries,
    selectedDate || todaysDate
  )

  const [view, setView] = useState<'HABITS' | 'DAILY'>('DAILY')

  const completedWeeklyHabits = getCompletedHabitsForWeek(entries, selectedDate)
  const weeklyProgress = getWeeklyProgress(habits, completedWeeklyHabits)

  return (
    <>
      <Link
        href="/"
        className="absolute m-5 text-xl font-semibold left-0 text-zinc-500 cursor-pointer transition-colors hover:text-zinc-200"
      >
        C✩
      </Link>
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
      <div
        className={`flex min-h-screen flex-col items-center justify-center py-5 text-lg pb-[20vh] lg:pb-0`}
      >
        <LayoutGroup>
          <AnimatePresence initial={false} mode="wait">
            <div className="flex flex-row">
              <motion.button
                initial={{ opacity: view === 'DAILY' ? 0 : 1 }}
                animate={{ opacity: view === 'DAILY' ? 1 : 0 }}
                title="Go to Habits"
                onClick={() => setView('HABITS')}
                className="text-zinc-700 rounded-md hover:bg-zinc-400/15  hover:text-zinc-400 duration-300 transition-colors py-1 px-2 flex gap-1 align-middle self-center text-4xl"
              >
                <MdOutlineKeyboardArrowLeft />
              </motion.button>

              <motion.div
                className={`w-full flex justify-center gap-4 items-center ${
                  view === 'HABITS' ? 'flex-col-reverse' : 'flex-col'
                } lg:flex-row `}
              >
                {view === 'HABITS' && (
                  <motion.div
                    initial={{ opacity: 0, x: -300 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ease: 'easeInOut', duration: 0.7 }}
                    className="gap-4 flex flex-col self-center"
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
                      }}
                    />
                  </motion.div>
                )}

                <motion.div
                  layout
                  transition={{ ease: 'easeInOut', duration: 0.65 }}
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
                    weeklyProgress={weeklyProgress}
                    regenerate={() =>
                      regenerate(selectedDate || new Date(), habitCount)
                    }
                    view={view}
                    toggleView={() =>
                      setView(view === 'HABITS' ? 'DAILY' : 'HABITS')
                    }
                  />
                </motion.div>

                {view === 'DAILY' && (
                  <motion.div
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ease: 'easeInOut', duration: 0.7 }}
                    className="cal flex flex-col gap-4 justify-center"
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
                  </motion.div>
                )}
              </motion.div>
              <motion.button
                initial={{ opacity: view === 'HABITS' ? 0 : 1 }}
                animate={{ opacity: view === 'HABITS' ? 1 : 0 }}
                onClick={() => setView('DAILY')}
                title="Go to Tracker"
                className="text-zinc-700 rounded-md hover:bg-zinc-400/15 hover:text-zinc-400 duration-300 transition-colors py-1 px-2 flex gap-1 align-middle self-center text-4xl"
              >
                <MdOutlineKeyboardArrowRight />
              </motion.button>
            </div>
          </AnimatePresence>
        </LayoutGroup>
      </div>
      <div className="absolute bottom-5 left-[calc(50%_-_97px)] text-zinc-600 hover:text-zinc-200 cursor-pointer transition-colors">
        <a href="https://github.com/ksurdhar">Made with ♡ by ksurdhar</a>
      </div>
    </>
  )
}

export default Tracker
