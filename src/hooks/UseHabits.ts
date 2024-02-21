import { Habit } from '@/types'
import { useState } from 'react'

export const useHabits = (initialHabits: Habit[] = []) => {
  const [habits, setHabits] = useState(initialHabits)
  const [nextId, setNextId] = useState(initialHabits.length + 1)

  const addHabit = (name: string, frequencyPerWeek: string) => {
    const newHabit = {
      id: String(nextId),
      name,
      frequencyPerWeek: parseInt(frequencyPerWeek),
    }
    setHabits(habits.concat(newHabit))
    setNextId(nextId + 1)
  }

  const deleteHabit = (id: string) => {
    setHabits(habits.filter((habit) => habit.id !== id))
  }

  return { habits, addHabit, deleteHabit }
}
