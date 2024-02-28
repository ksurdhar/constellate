'use client'

import { ConstellationData, Constellations } from '@/types'
import { getWeekKey } from '@/utilities/dateUtils'
import generateConstellation from '@/utilities/generateConstellation'
import { createClient } from '@/utilities/supabase/client'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

const defaultConstellation = generateConstellation(15, 550, 400)
const defaultConstellations = {
  [getWeekKey(new Date())]: defaultConstellation,
}
// this will fail if server constellations exist but there is no constellation for week
// move default down to the server
export const useConstellations = (serverConstellations: Constellations) => {
  const { isSignedIn, user } = useUser()
  const supabase = createClient()

  const [constellations, setConstellations] = useState<Constellations>(() => {
    if (Object.keys(serverConstellations).length > 0) {
      return serverConstellations
    }
    return defaultConstellations
  })

  const [weeklyConstellation, setWeeklyConstellation] =
    useState<ConstellationData>(() => {
      if (Object.keys(serverConstellations).length > 0) {
        return serverConstellations[getWeekKey(new Date())]
      }
      return defaultConstellation
    })

  useEffect(() => {
    if (Object.keys(serverConstellations).length > 0) return
    const storedConstellations = JSON.parse(
      localStorage.getItem('constellations') || '{}'
    ) as Constellations

    if (Object.keys(storedConstellations).length > 0) {
      setConstellations(storedConstellations)
      if (storedConstellations[getWeekKey(new Date())]) {
        setWeeklyConstellation(storedConstellations[getWeekKey(new Date())])
      }
    } else {
      // replace with useEventEffect when available
      // https://react.dev/reference/react/experimental_useEffectEvent
      localStorage.setItem(
        'constellations',
        JSON.stringify(defaultConstellations)
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const regenerate = async (selectedDate: Date, habitCount: number) => {
    const weekKey = getWeekKey(selectedDate)
    const { nodes, connections } = generateConstellation(habitCount, 550, 400)
    const constellationId = constellations[weekKey]?.id
    const updatedConstellations = {
      ...constellations,
      [weekKey]: { nodes, connections },
    }
    setConstellations(updatedConstellations)
    setWeeklyConstellation({ nodes, connections })

    if (!isSignedIn) {
      localStorage.setItem(
        'constellations',
        JSON.stringify(updatedConstellations)
      )
    } else {
      const { error, data } = await supabase
        .from('constellations')
        .upsert(
          {
            id: constellationId,
            connections,
            nodes,
            week_key: weekKey,
            user_id: user.id,
          },
          { ignoreDuplicates: false }
        )
        .select()
      // handle error case by undoing optimistic update
      if (error) console.log('supabase error', error)
      if (!data) return
      console.log('constellation data', data)
      const updatedConstellations = {
        ...constellations,
        [weekKey]: { nodes, connections, id: data[0].id },
      }
      setConstellations(updatedConstellations)
    }
  }

  return {
    weeklyConstellation,
    setWeeklyConstellation,
    constellations,
    setConstellations,
    regenerate,
  }
}
