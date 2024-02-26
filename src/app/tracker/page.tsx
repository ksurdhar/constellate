import Tracker from '@/components/Tracker'
import { Entries, Habit } from '@/types'
import { createClient } from '@/utilities/supabase/server'

import { auth } from '@clerk/nextjs'

const Home = async () => {
  const { userId } = auth()
  let serverHabits: Habit[] | undefined
  let serverEntries: Entries = {}

  if (userId) {
    const supabase = createClient()
    const { data: habits } = await supabase
      .from('habits')
      .select()
      .eq('user_id', userId)
    serverHabits = habits as Habit[]

    const { data: entries } = await supabase
      .from('entries')
      .select()
      .eq('user_id', userId)

    console.log('supabase entries', entries)
    if (entries) {
      entries.forEach((entry) => {
        serverEntries[entry.day_key] = {
          completedHabitIds: entry.completed_habits,
        }
      })
      console.log('serverEntries', serverEntries)
    }
  }

  return <Tracker serverHabits={serverHabits} serverEntries={serverEntries} />
}

export default Home
