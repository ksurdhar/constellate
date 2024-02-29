import { Entries, Entry } from '@/types'
import { getDayKey } from '@/utilities/dateUtils'
import { createClient } from '@/utilities/supabase/client'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

// this will fail if server entries exist but there is no entry for day
// add generation to the server
export const useEntries = (serverEntries: Entries, selectedDate: Date) => {
  const [entries, setEntries] = useState<Entries>(() => {
    if (Object.keys(serverEntries).length > 0) return serverEntries
    return {
      [getDayKey(selectedDate)]: { completedHabitIds: [] },
    }
  })

  const { isSignedIn, user } = useUser()
  const supabase = createClient()

  useEffect(() => {
    if (Object.keys(serverEntries).length > 0) return
    const storedEntries = JSON.parse(
      localStorage.getItem('entries') || '{}'
    ) as Entries

    if (Object.keys(storedEntries).length > 0) {
      setEntries(storedEntries)
    }
  }, [serverEntries])

  const dailyEntry =
    selectedDate && entries[getDayKey(selectedDate)]
      ? entries[getDayKey(selectedDate)]
      : { completedHabitIds: [] }

  const updateEntry = async (entry: Entry, selectedDate: Date) => {
    const updatedEntries = {
      ...entries,
      [getDayKey(selectedDate)]: entry,
    }
    setEntries(updatedEntries)

    if (!isSignedIn) {
      localStorage.setItem('entries', JSON.stringify(updatedEntries))
    } else {
      const { error, data } = await supabase
        .from('entries')
        .upsert(
          {
            id: entry.id,
            completed_habits: entry.completedHabitIds,
            day_key: getDayKey(selectedDate),
            user_id: user.id,
          },
          { ignoreDuplicates: false }
        )
        .select()
      // handle error case by undoing optimistic update
      if (error) console.log('supabase error', error)
      if (!data) return
      const updatedEntries = {
        ...entries,
        [getDayKey(selectedDate)]: {
          ...entry,
          id: data[0].id,
        },
      }
      setEntries(updatedEntries)
    }
  }

  return { entries, dailyEntry, updateEntry }
}
