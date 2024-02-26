export type Habit = {
  id: string
  name: string
  frequency: number
}

export interface Entry {
  id?: string
  completedHabitIds: string[]
}

export type Entries = { [key: string]: Entry }

export interface ConstellationNode {
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

export interface ConstellationData {
  nodes: ConstellationNode[]
  connections: Connection[]
}

export type Constellations = { [key: string]: ConstellationData }
