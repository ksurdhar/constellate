import Tracker from '@/components/Tracker'
import { Constellations, Entries, Habit } from '@/types'
import { createClient } from '@/utilities/supabase/server'

import { auth } from '@clerk/nextjs'

const Home = async () => {
  const { userId } = auth()
  let serverHabits: Habit[] | undefined
  let serverEntries: Entries = {}
  let serverConstellations: Constellations = {}

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

    if (entries) {
      entries.forEach((entry) => {
        serverEntries[entry.day_key] = {
          completedHabitIds: entry.completed_habits,
        }
      })
    }

    const { data: constellations } = await supabase
      .from('constellations')
      .select()
      .eq('user_id', userId)

    if (constellations) {
      constellations.forEach((constellation) => {
        serverConstellations[constellation.week_key] = {
          nodes: constellation.nodes,
          connections: constellation.connections,
          id: constellation.id,
        }
      })
    }
  }

  return (
    <Tracker
      serverHabits={serverHabits}
      serverEntries={serverEntries}
      serverConstellations={serverConstellations}
    />
  )
}

export default Home
