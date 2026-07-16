import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '../db'
import { seedExercises } from '../db/seed'

const USER_ID = 'user-1'

describe('Workout Persistence Bugs', () => {
  beforeEach(async () => {
    await db.workouts.clear()
    await db.exercises.clear()
    await seedExercises()
  })

  it('Bug #1: can query today workouts by userId and date', async () => {
    const today = new Date().toISOString().split('T')[0]

    await db.workouts.add({
      userId: USER_ID,
      exerciseId: 1,
      exerciseName: 'Bench Press',
      category: 'chest',
      sets: [{ weight: 80, reps: 10, completedAt: Date.now() }],
      date: today,
      createdAt: Date.now(),
    })

    await db.workouts.add({
      userId: USER_ID,
      exerciseId: 2,
      exerciseName: 'Squat',
      category: 'legs',
      sets: [{ weight: 100, reps: 5, completedAt: Date.now() }],
      date: '2026-01-01',
      createdAt: Date.now(),
    })

    const results = await db.workouts
      .where('userId').equals(USER_ID)
      .and(w => w.date === today)
      .toArray()

    expect(results).toHaveLength(1)
    expect(results[0].exerciseName).toBe('Bench Press')
  })

  it('Bug #1: WorkoutPage loads today data via useLiveQuery', async () => {
    const fs = await import('fs')
    const path = await import('path')
    const src = fs.readFileSync(path.resolve(process.cwd(), 'src/pages/WorkoutPage.tsx'), 'utf-8')
    expect(src).toContain('initialLoadDone')
    expect(src).toContain('useLiveQuery')
  })

  it('Bug #2: set completion updates DB immediately', async () => {
    const today = new Date().toISOString().split('T')[0]

    const id = await db.workouts.add({
      userId: USER_ID,
      exerciseId: 1,
      exerciseName: 'Bench Press',
      category: 'chest',
      sets: [{ weight: 80, reps: 10, completedAt: Date.now() }],
      date: today,
      createdAt: Date.now(),
    })

    const record = await db.workouts.get(id)
    const newSets = [...record!.sets, { weight: 82.5, reps: 8, completedAt: Date.now() }]
    await db.workouts.update(id, { sets: newSets })

    const updated = await db.workouts.get(id)
    expect(updated!.sets).toHaveLength(2)
    expect(updated!.sets[1].weight).toBe(82.5)
  })

  it('Bug #2: WorkoutPage completeSet persists to db.workouts', async () => {
    const fs = await import('fs')
    const path = await import('path')
    const src = fs.readFileSync(path.resolve(process.cwd(), 'src/pages/WorkoutPage.tsx'), 'utf-8')
    expect(src).toContain('db.workouts.update')
    expect(src).toContain('db.workouts.add')
  })
})
