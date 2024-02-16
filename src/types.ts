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
}

export interface Connection {
  source: number
  target: number
}
