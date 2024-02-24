'use client'

import { ConstellationData, Constellations } from '@/types'
import { getWeekKey } from '@/utilities/dateUtils'
import generateConstellation from '@/utilities/generateConstellation'
import { useEffect, useState } from 'react'

const defaultConstellation = generateConstellation(15, 550, 400)

export const useConstellations = (serverConstellations?: Constellations) => {
  const defaultConstellations = {
    [getWeekKey(new Date())]: defaultConstellation,
  }

  const [constellations, setConstellations] = useState<Constellations>(
    serverConstellations ? serverConstellations : defaultConstellations
  )

  const [weeklyConstellation, setWeeklyConstellation] =
    useState<ConstellationData>(() => {
      if (
        serverConstellations &&
        serverConstellations[getWeekKey(new Date())]
      ) {
        return serverConstellations[getWeekKey(new Date())]
      } else {
        return defaultConstellation
      }
    })

  useEffect(() => {
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

  const regenerate = (selectedDate: Date, habitCount: number) => {
    const weekKey = getWeekKey(selectedDate || new Date())
    const { nodes, connections } = generateConstellation(habitCount, 550, 400)
    const updatedConstellations = {
      ...constellations,
      [weekKey]: { nodes, connections },
    }
    setConstellations(updatedConstellations)
    localStorage.setItem(
      'constellations',
      JSON.stringify(updatedConstellations)
    )
    setWeeklyConstellation({ nodes, connections })
  }

  return {
    weeklyConstellation,
    setWeeklyConstellation,
    constellations,
    setConstellations,
    regenerate,
  }
}
