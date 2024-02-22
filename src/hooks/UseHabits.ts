'use client'

import { Habit } from '@/types'
import { useEffect, useState } from 'react'

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: 'Exercise', frequencyPerWeek: 3 },
    { id: '2', name: 'Read', frequencyPerWeek: 5 },
    { id: '3', name: 'Meditate', frequencyPerWeek: 7 },
  ])
  const [nextId, setNextId] = useState(habits.length + 1)

  useEffect(() => {
    const storedHabits = JSON.parse(
      localStorage.getItem('habits') || '[]'
    ) as Habit[]

    if (storedHabits.length) {
      setHabits(storedHabits)
      setNextId(storedHabits.length + 1)
    }
  }, [])

  const addHabit = (name: string, frequencyPerWeek: string) => {
    const newHabit = {
      id: String(nextId),
      name,
      frequencyPerWeek: parseInt(frequencyPerWeek),
    }
    const updatedHabits = habits.concat(newHabit)
    setHabits(updatedHabits)
    localStorage.setItem('habits', JSON.stringify(updatedHabits))
    setNextId(nextId + 1)
  }

  const deleteHabit = (id: string) => {
    const updatedHabits = habits.filter((habit) => habit.id !== id)
    setHabits(updatedHabits)
    localStorage.setItem('habits', JSON.stringify(updatedHabits))
  }

  return { habits, addHabit, deleteHabit }
}
