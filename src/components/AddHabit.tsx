'use client'

import { useState } from 'react'

interface AddHabitProps {
  addHabit: (name: string, frequency: string) => void
}

const AddHabit = ({ addHabit }: AddHabitProps) => {
  const [name, setName] = useState('')
  const [frequency, setFrequency] = useState('1')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        addHabit(name, frequency)
        setName('')
      }}
      className="flex gap-2 items-end"
    >
      <div className="flex flex-col">
        <label
          className="text-zinc-400 text-xs font-semibold pb-2"
          htmlFor="habitName"
        >
          Habit
        </label>
        <input
          autoFocus={true}
          autoComplete={'off'}
          id="habitName"
          type="text"
          placeholder="Habit name"
          className="rounded border border-zinc-700 bg-transparent py-2 px-3 text-base transition-colors placeholder:text-zinc-500 hover:border-zinc-200 focus:border-orange-yellow focus:outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
  )
}

export default AddHabit
