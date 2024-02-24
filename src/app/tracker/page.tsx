import Tracker from '@/components/Tracker'
import { Habit } from '@/types'
import { createClient } from '@/utilities/supabase/server'

import { auth } from '@clerk/nextjs'

const Home = async () => {
  const { userId } = auth()
  let serverHabits: Habit[] | undefined
  if (userId) {
    const supabase = createClient()
    const { data: habits } = await supabase
      .from('habits')
      .select()
      .eq('user_id', userId)
    serverHabits = habits as Habit[]
  }

  return <Tracker serverHabits={serverHabits} />
}

export default Home
