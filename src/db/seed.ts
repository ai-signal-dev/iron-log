import { db, type Exercise } from './index'

const exercises: Omit<Exercise, 'id'>[] = [
  // Chest
  { name: 'Bench Press', category: 'chest', isCustom: false },
  { name: 'Incline Bench Press', category: 'chest', isCustom: false },
  { name: 'Decline Bench Press', category: 'chest', isCustom: false },
  { name: 'Dumbbell Bench Press', category: 'chest', isCustom: false },
  { name: 'Incline Dumbbell Press', category: 'chest', isCustom: false },
  { name: 'Dumbbell Fly', category: 'chest', isCustom: false },
  { name: 'Cable Fly', category: 'chest', isCustom: false },
  { name: 'Chest Press Machine', category: 'chest', isCustom: false },
  { name: 'Pec Deck', category: 'chest', isCustom: false },
  { name: 'Push Up', category: 'chest', isCustom: false },
  { name: 'Dips (Chest)', category: 'chest', isCustom: false },

  // Back
  { name: 'Deadlift', category: 'back', isCustom: false },
  { name: 'Barbell Row', category: 'back', isCustom: false },
  { name: 'Dumbbell Row', category: 'back', isCustom: false },
  { name: 'Lat Pulldown', category: 'back', isCustom: false },
  { name: 'Seated Cable Row', category: 'back', isCustom: false },
  { name: 'T-Bar Row', category: 'back', isCustom: false },
  { name: 'Pull Up', category: 'back', isCustom: false },
  { name: 'Chin Up', category: 'back', isCustom: false },
  { name: 'Face Pull', category: 'back', isCustom: false },
  { name: 'Hyperextension', category: 'back', isCustom: false },
  { name: 'Rack Pull', category: 'back', isCustom: false },
  { name: 'Pendlay Row', category: 'back', isCustom: false },

  // Legs
  { name: 'Squat', category: 'legs', isCustom: false },
  { name: 'Front Squat', category: 'legs', isCustom: false },
  { name: 'Leg Press', category: 'legs', isCustom: false },
  { name: 'Hack Squat', category: 'legs', isCustom: false },
  { name: 'Romanian Deadlift', category: 'legs', isCustom: false },
  { name: 'Leg Extension', category: 'legs', isCustom: false },
  { name: 'Leg Curl', category: 'legs', isCustom: false },
  { name: 'Bulgarian Split Squat', category: 'legs', isCustom: false },
  { name: 'Lunge', category: 'legs', isCustom: false },
  { name: 'Calf Raise', category: 'legs', isCustom: false },
  { name: 'Seated Calf Raise', category: 'legs', isCustom: false },
  { name: 'Hip Thrust', category: 'legs', isCustom: false },
  { name: 'Goblet Squat', category: 'legs', isCustom: false },

  // Shoulders
  { name: 'Overhead Press', category: 'shoulders', isCustom: false },
  { name: 'Dumbbell Shoulder Press', category: 'shoulders', isCustom: false },
  { name: 'Arnold Press', category: 'shoulders', isCustom: false },
  { name: 'Lateral Raise', category: 'shoulders', isCustom: false },
  { name: 'Front Raise', category: 'shoulders', isCustom: false },
  { name: 'Rear Delt Fly', category: 'shoulders', isCustom: false },
  { name: 'Upright Row', category: 'shoulders', isCustom: false },
  { name: 'Shrug', category: 'shoulders', isCustom: false },
  { name: 'Cable Lateral Raise', category: 'shoulders', isCustom: false },
  { name: 'Machine Shoulder Press', category: 'shoulders', isCustom: false },

  // Arms
  { name: 'Barbell Curl', category: 'arms', isCustom: false },
  { name: 'Dumbbell Curl', category: 'arms', isCustom: false },
  { name: 'Hammer Curl', category: 'arms', isCustom: false },
  { name: 'Preacher Curl', category: 'arms', isCustom: false },
  { name: 'Concentration Curl', category: 'arms', isCustom: false },
  { name: 'Cable Curl', category: 'arms', isCustom: false },
  { name: 'Tricep Pushdown', category: 'arms', isCustom: false },
  { name: 'Overhead Tricep Extension', category: 'arms', isCustom: false },
  { name: 'Skull Crusher', category: 'arms', isCustom: false },
  { name: 'Close Grip Bench Press', category: 'arms', isCustom: false },
  { name: 'Dips (Tricep)', category: 'arms', isCustom: false },
  { name: 'Wrist Curl', category: 'arms', isCustom: false },

  // Core
  { name: 'Crunch', category: 'core', isCustom: false },
  { name: 'Plank', category: 'core', isCustom: false },
  { name: 'Hanging Leg Raise', category: 'core', isCustom: false },
  { name: 'Cable Crunch', category: 'core', isCustom: false },
  { name: 'Ab Roller', category: 'core', isCustom: false },
  { name: 'Russian Twist', category: 'core', isCustom: false },
  { name: 'Decline Sit Up', category: 'core', isCustom: false },
  { name: 'Side Plank', category: 'core', isCustom: false },
  { name: 'Woodchop', category: 'core', isCustom: false },
]

export async function seedExercises() {
  const count = await db.exercises.count()
  if (count === 0) {
    await db.exercises.bulkAdd(exercises)
  }
}
