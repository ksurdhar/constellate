'use client'

import Constellation from '@/components/Constellation'
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

  // display selected week
  // determine startDate / endDate, pass those to datepicker
  // potentially change styles for selected week - use gentle highlight colors for habit labels
  //

  return (
    <Constellation nodeCount={15} width={600} height={450} />
    // <div className="flex flex-col items-center justify-center min-h-screen py-5 bg-soft-black text-lg">
    //   <div className="flex flex-row w-full max-w-4xl px-4">
    //     <div className="flex-1">
    //       <form onSubmit={handleSubmit} className="flex gap-2 flex-col">
    //         <div className="flex flex-col">
    //           <label className="text-slate-400" htmlFor="habitName">
    //             Habit
    //           </label>
    //           <input
    //             id="habitName"
    //             type="text"
    //             placeholder="name"
    //             className="bg-transparent border border-slate-600 placeholder:text-slate-700
    //              hover:border-slate-200 rounded focus:outline-none transition-colors focus:border-orange-yellow p-1 px-3"
    //             value={habitName}
    //             onChange={(e) => setHabitName(e.target.value)}
    //             required
    //           />
    //         </div>
    //         <div className="flex flex-col">
    //           <label className="text-slate-400" htmlFor="frequency">
    //             Frequency (weekly)
    //           </label>
    //           <select
    //             id="frequency"
    //             className="bg-transparent border border-slate-600
    //             hover:border-slate-200 rounded focus:outline-none transition-colors focus:border-orange-yellow p-1 px-3 h-[38px]"
    //             value={frequency}
    //             onChange={(e) => setFrequency(e.target.value)}
    //             required
    //           >
    //             {[...Array(7).keys()].map((num) => (
    //               <option key={num + 1} value={num + 1}>
    //                 {num + 1}x
    //               </option>
    //             ))}
    //           </select>
    //         </div>
    //         <button type="submit">Add</button>
    //       </form>
    //       <div>
    //         <h2>My Habits</h2>
    //         <ul>
    //           {habits.map(({ id, name, frequencyPerWeek }) => (
    //             <li key={id}>
    //               {name} - {frequencyPerWeek} times per week
    //               <button
    //                 onClick={() => handleDelete(id)}
    //                 style={{ marginLeft: '10px' }}
    //               >
    //                 Delete
    //               </button>
    //             </li>
    //           ))}
    //         </ul>
    //       </div>

    //     </div>
    //     <div className="flex-1 cal">
    //       <p>
    //         Selected date:{' '}
    //         {selectedDate
    //           ? format(selectedDate, 'dd MMM yyyy', { locale: enGB })
    //           : 'none'}
    //         .
    //       </p>
    //       <DatePickerCalendar
    //         date={selectedDate ? selectedDate : defaultDate}
    //         onDateChange={(date) => setSelectedDate(date)}
    //         locale={enGB}
    //       />
    //       <DailyHabits
    //         completedHabitIds={dailyEntry.completedHabitIds}
    //         habits={habits}
    //         onToggle={toggleDailyHabit}
    //       />
    //     </div>
    //   </div>
    // </div>
  )
}

export default Home
