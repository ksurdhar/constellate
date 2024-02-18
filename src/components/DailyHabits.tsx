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
    <div className="flex flex-col flex-1 justify-center">
      {habits.map((habit) => (
        <HabitCheckbox
          key={habit.name}
          habit={habit}
          checked={completedHabitIds.includes(habit.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}

export default DailyHabits
