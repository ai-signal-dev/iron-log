import { db, type Exercise } from '../db'

export interface ParsedVoiceEntry {
  exercise: Exercise | null
  exerciseName: string
  weight: number
  reps: number
  sets: number
}

// Convert Japanese numbers to digits
function jaToNumber(str: string): number {
  const map: Record<string, number> = {
    '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
    '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
    '百': 100,
  }
  // Handle simple numbers like "十" = 10, "二十" = 20
  let result = 0
  let current = 0
  for (const char of str) {
    if (map[char] !== undefined) {
      if (char === '十') {
        result += (current || 1) * 10
        current = 0
      } else if (char === '百') {
        result += (current || 1) * 100
        current = 0
      } else {
        current = map[char]
      }
    }
  }
  return result + current
}

function extractJaNumber(text: string, suffix: string): number {
  // Try to find Japanese number before a suffix like '回'
  const idx = text.indexOf(suffix)
  if (idx <= 0) return 0
  const before = text.slice(Math.max(0, idx - 5), idx)
  return jaToNumber(before)
}

export async function parseVoiceInput(transcript: string): Promise<ParsedVoiceEntry[]> {
  const exercises = await db.exercises.toArray()
  const results: ParsedVoiceEntry[] = []

  // Normalize transcript
  const normalized = transcript
    .replace(/キログラム/g, 'kg')
    .replace(/キロ/g, 'kg')
    .replace(/レップ/g, '回')
    .replace(/レップス/g, '回')
    .replace(/rep(s)?/gi, '回')
    .replace(/セット/g, 'set')

  // Split by common separators
  const segments = normalized.split(/[、。,.]/).filter(s => s.trim())

  for (const segment of segments) {
    const trimmed = segment.trim()
    
    // Find exercise match
    let matchedExercise: Exercise | null = null
    let exerciseName = ''
    
    for (const ex of exercises) {
      const names = [ex.name.toLowerCase(), ex.nameJa || ''].filter(Boolean)
      for (const name of names) {
        if (name && trimmed.toLowerCase().includes(name.toLowerCase())) {
          if (!matchedExercise || name.length > exerciseName.length) {
            matchedExercise = ex
            exerciseName = ex.nameJa || ex.name
          }
        }
      }
    }

    // Extract weight (kg)
    const weightMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*kg/i)
    const weight = weightMatch ? parseFloat(weightMatch[1]) : 0

    // Extract reps
    const repsMatch = trimmed.match(/(\d+)\s*回/)
    const reps = repsMatch ? parseInt(repsMatch[1]) : extractJaNumber(trimmed, '回')

    // Extract sets
    const setsMatch = trimmed.match(/(\d+)\s*set/i)
    const sets = setsMatch ? parseInt(setsMatch[1]) : 1

    if (matchedExercise || weight > 0 || reps > 0) {
      results.push({
        exercise: matchedExercise,
        exerciseName: exerciseName || trimmed,
        weight,
        reps,
        sets,
      })
    }
  }

  return results
}
