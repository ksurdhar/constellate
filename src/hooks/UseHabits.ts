'use client'

import { Habit } from '@/types'
import { createClient } from '@/utilities/supabase/client'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

const defaultHabits = [
  { id: '1', name: 'Exercise', frequency: 3 },
  { id: '2', name: 'Read', frequency: 5 },
  { id: '3', name: 'Meditate', frequency: 7 },
]

export const useHabits = (serverHabits?: Habit[]) => {
  const [habits, setHabits] = useState<Habit[]>(
    serverHabits ? serverHabits : defaultHabits
  )
  const [nextId, setNextId] = useState(habits.length + 1)

  const { isSignedIn, user } = useUser()
  const supabase = createClient()

  useEffect(() => {
    if (serverHabits) return
    const storedHabits = JSON.parse(
      localStorage.getItem('habits') || '[]'
    ) as Habit[]

    if (storedHabits.length > 0) {
      setHabits(storedHabits)
      setNextId(storedHabits.length + 1)
    }
  }, [serverHabits])

  const addHabit = async (name: string, frequency: string) => {
    if (!isSignedIn) {
      const newHabit = {
        id: String(nextId),
        name,
        frequency: parseInt(frequency),
      }
      const updatedHabits = habits.concat(newHabit)
      setHabits(updatedHabits)
      setNextId(nextId + 1)

      localStorage.setItem('habits', JSON.stringify(updatedHabits))
    } else {
      const { error, data } = await supabase
        .from('habits')
        .insert({ name, frequency: frequency, user_id: user.id })
        .select()
      if (error) console.log('supabase error', error)
      if (!data) return
      const newHabit = {
        id: data[0].id,
        name,
        frequency: parseInt(frequency),
      }
      const updatedHabits = habits.concat(newHabit)
      setHabits(updatedHabits)
    }
  }

  const deleteHabit = async (id: string) => {
    const updatedHabits = habits.filter((habit) => habit.id !== id)
    setHabits(updatedHabits)

    if (!isSignedIn) {
      localStorage.setItem('habits', JSON.stringify(updatedHabits))
    } else {
      const { error } = await supabase.from('habits').delete().eq('id', id)
      if (error) console.log('supabase error', error)
    }
  }

  return { habits, addHabit, deleteHabit }
}
