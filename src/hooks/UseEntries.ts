import { Entries, Entry } from '@/types'
import { getWeekKey, normalizedDateString } from '@/utilities/dateUtils'
import { useEffect, useState } from 'react'

export const useEntries = (selectedDate: Date, serverEntries?: Entry[]) => {
  const [entries, setEntries] = useState<Entries>({
    [getWeekKey(selectedDate)]: { completedHabitIds: [] },
  })

  useEffect(() => {
    const storedEntries = JSON.parse(
      localStorage.getItem('entries') || '{}'
    ) as Entries

    if (Object.keys(storedEntries).length > 0) {
      setEntries(storedEntries)
    }
  }, [])

  const dailyEntry =
    selectedDate && entries[normalizedDateString(selectedDate)]
      ? entries[normalizedDateString(selectedDate)]
      : { completedHabitIds: [] }

  return { entries, setEntries, dailyEntry }
}
