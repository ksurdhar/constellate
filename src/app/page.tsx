'use client'

import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { useState } from 'react'
import { DatePickerCalendar } from 'react-nice-dates'
import 'react-nice-dates/build/style.css'

interface Habit {
  id: number
  name: string
  frequencyPerWeek: number
}

const Home = () => {
  const [habitName, setHabitName] = useState('')
  const [frequency, setFrequency] = useState('1')
  const [habits, setHabits] = useState<Habit[]>([])
  const [nextId, setNextId] = useState(1)
  const [date, setDate] = useState<Date | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newHabit = {
      id: nextId,
      name: habitName,
      frequencyPerWeek: parseInt(frequency),
    }

    setHabits([...habits, newHabit])
    setNextId(nextId + 1) // Increment the nextId for uniqueness
    setHabitName('')
    setFrequency('1')
  }

  const handleDelete = (id: number) => {
    setHabits(habits.filter((habit) => habit.id !== id))
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-5 bg-soft-black text-lg">
      <div className="flex flex-row w-full max-w-4xl px-4">
        <div className="flex-1">
          <div className="checkbox-wrapper-4">
            <input className="inp-cbx" id="japanese" type="checkbox" />
            <label className="cbx" htmlFor="japanese">
              <span>
                <svg width="12px" height="10px">
                  <use xlinkHref="#check-4"></use>
                </svg>
              </span>
              <span>Practice Japanese</span>
            </label>
            <svg className="inline-svg">
              <symbol id="check-4" viewBox="0 0 12 10">
                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
              </symbol>
            </svg>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 flex-col">
            <div className="flex flex-col">
              <label className="text-slate-400" htmlFor="habitName">
                Habit
              </label>
              <input
                id="habitName"
                type="text"
                placeholder="name"
                className="bg-transparent border border-slate-600 placeholder:text-slate-700
                 hover:border-slate-200 rounded focus:outline-none transition-colors focus:border-orange-yellow p-1 px-3"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-slate-400" htmlFor="frequency">
                Frequency (weekly)
              </label>
              <select
                id="frequency"
                className="bg-transparent border border-slate-600 
                hover:border-slate-200 rounded focus:outline-none transition-colors focus:border-orange-yellow p-1 px-3 h-[38px]"
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
            <button type="submit">Add</button>
          </form>
          <h2>My Habits</h2>
          <ul>
            {habits.map(({ id, name, frequencyPerWeek }) => (
              <li key={id}>
                {name} - {frequencyPerWeek} times per week
                <button
                  onClick={() => handleDelete(id)}
                  style={{ marginLeft: '10px' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 cal">
          <p>
            Selected date:{' '}
            {date ? format(date, 'dd MMM yyyy', { locale: enGB }) : 'none'}.
          </p>
          <DatePickerCalendar
            date={date ? date : new Date()}
            onDateChange={setDate}
            locale={enGB}
          />
        </div>
      </div>
    </div>
  )
}

export default Home
