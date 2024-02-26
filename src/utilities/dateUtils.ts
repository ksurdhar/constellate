import { Entries } from '@/types'
import { format, isSameWeek, startOfWeek } from 'date-fns'

export const getDayKey = (date: Date) => {
  return format(date, 'yyyy-MM-dd')
}

export const getWeekKey = (date: Date): string => {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  return getDayKey(start)
}

export const getWeeklyEntries = (entries: Entries, date: Date): Entries => {
  const weekKey = getWeekKey(date)
  const weeklyEntries: Entries = {}
  Object.keys(entries)
    .filter((key) => isSameWeek(key, weekKey))
    .map((key) => (weeklyEntries[key] = entries[key]))
  return weeklyEntries
}

export const getCompletedHabitsForWeek = (
  entries: Entries,
  selectedDate: Date | null
): string[] => {
  if (!selectedDate) return []

  return Object.keys(entries)
    .filter((key) => {
      return isSameWeek(key, getDayKey(selectedDate))
    })
    .reduce((acc: string[], key) => {
      const entry = entries[key]
      return acc.concat(entry.completedHabitIds)
    }, [])
}
