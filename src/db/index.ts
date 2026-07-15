import Dexie, { type Table } from 'dexie'

export interface Exercise {
  id?: number
  name: string
  nameJa?: string
  category: MuscleGroup
  isCustom: boolean
  userId?: string
}

export type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core'

export interface WorkoutSet {
  weight: number
  reps: number
  completedAt: number
}

export interface WorkoutEntry {
  id?: number
  userId: string
  exerciseId: number
  exerciseName: string
  category: MuscleGroup
  sets: WorkoutSet[]
  date: string // YYYY-MM-DD
  createdAt: number
}

export interface Preset {
  id?: number
  userId: string
  name: string
  exercises: { exerciseId: number; exerciseName: string; category: MuscleGroup }[]
}

export interface TimerSetting {
  id?: number
  minutes: number
  seconds: number
}

class IronLogDB extends Dexie {
  exercises!: Table<Exercise>
  workouts!: Table<WorkoutEntry>
  presets!: Table<Preset>
  timerSettings!: Table<TimerSetting>

  constructor() {
    super('iron-log')
    this.version(3).stores({
      exercises: '++id, name, category, isCustom, userId',
      workouts: '++id, userId, exerciseId, exerciseName, date, category, createdAt',
      presets: '++id, userId, name',
      timerSettings: '++id',
    })
  }
}

export const db = new IronLogDB()
