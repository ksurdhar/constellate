'use client'

import Constellation from '@/components/Constellation/Constellation'
import { Habit } from '@/types'
import { useState } from 'react'
import 'react-nice-dates/build/style.css'

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
  const [habitName, setHabitName] = useState('')
  const [frequency, setFrequency] = useState('1')
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: 'Exercise', frequencyPerWeek: 3 },
    { id: '2', name: 'Read', frequencyPerWeek: 5 },
    { id: '3', name: 'Meditate', frequencyPerWeek: 7 },
  ])
  const [nextId, setNextId] = useState('1')
  const defaultDate = new Date()
  const [selectedDate, setSelectedDate] = useState<Date | null>(defaultDate)
  const [entries, setEntries] = useState<Entries>({
    [normalizeDate(defaultDate)]: { completedHabitIds: [] },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newHabit: Habit = {
      id: nextId,
      name: habitName,
      frequencyPerWeek: parseInt(frequency),
    }

    setHabits([...habits, newHabit])
    setNextId(nextId + 1) // Increment the nextId for uniqueness
    setHabitName('')
    setFrequency('1')
  }

  const handleDelete = (id: string) => {
    setHabits(habits.filter((habit) => habit.id !== id))
  }

  // const dailyEntry =
  //   selectedDate && entries[normalizeDate(selectedDate)]
  //     ? entries[normalizeDate(selectedDate)]
  //     : { completedHabitIds: [] }

  // const toggleDailyHabit = (habit: Habit) => {
  //   if (!selectedDate) return

  //   if (dailyEntry.completedHabitIds.includes(habit.id)) {
  //     dailyEntry.completedHabitIds = dailyEntry.completedHabitIds.filter(
  //       (id) => id !== habit.id
  //     )
  //   } else {
  //     dailyEntry.completedHabitIds.push(habit.id)
  //   }
  //   setEntries({
  //     ...entries,
  //     [normalizeDate(selectedDate)]: dailyEntry,
  //   })
  //   console.log(entries)
  // }

  // display selected week
  // determine startDate / endDate, pass those to datepicker
  // potentially change styles for selected week - use gentle highlight colors for habit labels
  //

  return (
    <div className="bg-soft-black flex min-h-screen flex-col items-center justify-center py-5 text-lg">
      <div className="flex w-full max-w-4xl flex-row px-4">
        <div className="min-w-fit flex-1 gap-4 flex flex-col">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex flex-col">
              <label
                className="text-zinc-400 text-xs font-semibold pb-2"
                htmlFor="habitName"
              >
                Habit
              </label>
              <input
                id="habitName"
                type="text"
                placeholder="Habit name"
                className="rounded border border-zinc-700 bg-transparent py-2 px-3 text-base transition-colors placeholder:text-zinc-500 hover:border-zinc-200 focus:border-orange-yellow focus:outline-none"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col">
              <label
                className="text-zinc-400 text-xs font-semibold pb-2"
                htmlFor="frequency"
              >
                Frequency (weekly)
              </label>
              <select
                id="frequency"
                className="rounded border border-zinc-700 bg-transparent py-[9px] px-3 text-base transition-colors placeholder:text-zinc-500 hover:border-zinc-200 focus:border-orange-yellow focus:outline-none"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                required
              >
                {[...Array(7).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}x
                  </option>
                ))}
              </select>
            </div>
            <button
              className="w-max min-w-[72px] max-h-[42px] self-end border border-solid border-yellow-600 text-yellow-400 px-3 py-2 rounded-md text-base outline-none transition-colors ease-in hover:bg-yellow-400/15 focus:bg-yellow-400/15 
              focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-opacity-50 focus-visible:ring-offset-2 focus-visible:ring-offset-yellow-400 focus-visible:ring-offset-opacity-50"
              type="submit"
            >
              Add
            </button>
          </form>
          <div className="overflow-x-auto rounded-lg border border-zinc-700">
            <table className="border-collapse w-full select-auto text-left text-zinc-400">
              <thead className="pb-2 text-xs [&>tr]:border-b [&>tr]:border-zinc-700 [&>tr]:bg-transparent [&>tr]:hover:bg-transparent ">
                <tr className="[&.selected]:bg-gray-100 [&.inserting]:bg-transparent hover:bg-gray-100">
                  <th className="py-3 px-4 font-extrabold w-[65%]">Habit</th>
                  <th className="py-3 px-4 font-extrabold">Frequency</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {habits.map(({ id, name, frequencyPerWeek }) => (
                  <tr key={id}>
                    <td className="py-3 px-4">{name}</td>
                    <td className="py-3 px-4">
                      {frequencyPerWeek}{' '}
                      <button onClick={() => handleDelete(id)}>x</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="cal flex-1">
          <Constellation nodeCount={10} width={550} height={400} />
          {/* <p>
            Selected date:{' '}
            {selectedDate
              ? format(selectedDate, 'dd MMM yyyy', { locale: enGB })
              : 'none'}
            .
          </p>
          <DatePickerCalendar
            date={selectedDate ? selectedDate : defaultDate}
            onDateChange={(date) => setSelectedDate(date)}
            locale={enGB}
          />
          <DailyHabits
            completedHabitIds={dailyEntry.completedHabitIds}
            habits={habits}
            onToggle={toggleDailyHabit}
          /> */}
        </div>
      </div>
    </div>
  )
}

export default Home
