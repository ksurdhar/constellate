import { Habit } from '@/types'
import { useEffect, useState } from 'react'

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const defaultHabits: Habit[] = [
      { id: '1', name: 'Exercise', frequencyPerWeek: 3 },
      { id: '2', name: 'Read', frequencyPerWeek: 5 },
      { id: '3', name: 'Meditate', frequencyPerWeek: 7 },
    ]
    const storedHabits = JSON.parse(
      localStorage.getItem('habits') || '[]'
    ) as Habit[]
    return storedHabits.length ? storedHabits : defaultHabits
  })
  const [nextId, setNextId] = useState(habits.length + 1)

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits))
  }, [habits])

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
