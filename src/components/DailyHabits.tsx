import { Habit } from '@/types'
import HabitCheckbox from './HabitCheckbox'

interface DailyHabitsProps {
  habits: Habit[]
  completedHabitIds: string[]
  onToggle: (habit: Habit) => void
}

const DailyHabits = ({
  habits,
  completedHabitIds,
  onToggle,
}: DailyHabitsProps) => {
  return (
    <>
      {habits.map((habit) => (
        <HabitCheckbox
          key={habit.name}
          habit={habit}
          checked={completedHabitIds.includes(habit.id)}
          onToggle={onToggle}
        />
      ))}
    </>
  )
}

export default DailyHabits
