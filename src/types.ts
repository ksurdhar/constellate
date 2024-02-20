export type Habit = {
  id: string
  name: string
  frequencyPerWeek: number
}

export interface Node {
  id: number
  x: number
  y: number
  direction?: number
  branches?: boolean
  isBranchNode?: boolean
}

export interface Connection {
  source: number
  target: number
}

export interface Entry {
  completedHabitIds: string[]
}

export interface ConstellationData {
  nodes: Node[]
  connections: Connection[]
}

export type Entries = { [key: string]: Entry }

export type Constellations = { [key: string]: ConstellationData }
