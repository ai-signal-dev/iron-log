import { useState } from 'react'
import { Plus, Check } from 'lucide-react'
import { db, type Exercise, type WorkoutEntry, type WorkoutSet } from '../db'
import ExercisePicker from '../components/ExercisePicker'
import Timer from '../components/Timer'
import VoiceInput from '../components/VoiceInput'

interface ActiveExercise {
  exercise: Exercise
  weight: number
  sets: WorkoutSet[]
}

export default function WorkoutPage() {
  const [activeExercises, setActiveExercises] = useState<ActiveExercise[]>([])
  const [showPicker, setShowPicker] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showTimer, setShowTimer] = useState(false)
  const [currentReps, setCurrentReps] = useState(10)

  const today = new Date().toISOString().split('T')[0]

  const addExercise = (exercise: Exercise) => {
    setActiveExercises(prev => [...prev, { exercise, weight: 0, sets: [] }])
    setShowPicker(false)
    setCurrentIndex(activeExercises.length)
  }

  const updateWeight = (index: number, weight: number) => {
    setActiveExercises(prev =>
      prev.map((e, i) => i === index ? { ...e, weight: Math.max(0, weight) } : e)
    )
  }

  const completeSet = (index: number) => {
    const newSet: WorkoutSet = {
      weight: activeExercises[index].weight,
      reps: currentReps,
      completedAt: Date.now(),
    }
    setActiveExercises(prev =>
      prev.map((e, i) => i === index ? { ...e, sets: [...e.sets, newSet] } : e)
    )
    setShowTimer(true)
  }

  const saveWorkout = async () => {
    const entries: Omit<WorkoutEntry, 'id'>[] = activeExercises
      .filter(e => e.sets.length > 0)
      .map(e => ({
        exerciseId: e.exercise.id!,
        exerciseName: e.exercise.name,
        category: e.exercise.category,
        sets: e.sets,
        date: today,
        createdAt: Date.now(),
      }))

    if (entries.length > 0) {
      await db.workouts.bulkAdd(entries)
      setActiveExercises([])
      setCurrentIndex(0)
    }
  }

  const handleVoice = (transcript: string) => {
    // Parse voice input like "ベンチプレス 80キロ 10回 3セット"
    console.log('Voice transcript:', transcript)
    // TODO: Implement voice parsing
  }

  const current = activeExercises[currentIndex]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Workout</h1>
        <div className="flex items-center gap-2">
          <VoiceInput onResult={handleVoice} />
          <button onClick={() => setShowPicker(true)} className="p-3 bg-surface-hover rounded-full hover:bg-white/10">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {activeExercises.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-text-secondary mb-4">Start your workout</p>
          <button onClick={() => setShowPicker(true)} className="btn-primary">
            Add Exercise
          </button>
        </div>
      ) : (
        <>
          {/* Exercise tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {activeExercises.map((e, i) => (
              <button
                key={i}
                onClick={() => { setCurrentIndex(i); setShowTimer(false) }}
                className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  i === currentIndex ? 'bg-gradient-accent text-white' : 'bg-surface-hover text-text-secondary'
                }`}
              >
                {e.exercise.name}
              </button>
            ))}
          </div>

          {current && (
            <div className="space-y-4">
              {/* Weight input */}
              <div className="card p-4">
                <label className="text-sm text-text-secondary block mb-2">Weight (kg)</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateWeight(currentIndex, current.weight - 2.5)}
                    className="btn-secondary px-4 py-2"
                  >
                    -2.5
                  </button>
                  <input
                    type="number"
                    value={current.weight}
                    onChange={e => updateWeight(currentIndex, parseFloat(e.target.value) || 0)}
                    className="flex-1 text-center text-3xl font-light bg-transparent border-b border-white/10 
                               py-2 focus:outline-none focus:border-accent-from"
                  />
                  <button
                    onClick={() => updateWeight(currentIndex, current.weight + 2.5)}
                    className="btn-secondary px-4 py-2"
                  >
                    +2.5
                  </button>
                </div>
              </div>

              {/* Reps input */}
              <div className="card p-4">
                <label className="text-sm text-text-secondary block mb-2">Reps</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentReps(r => Math.max(1, r - 1))}
                    className="btn-secondary px-4 py-2"
                  >
                    -1
                  </button>
                  <span className="flex-1 text-center text-3xl font-light">{currentReps}</span>
                  <button
                    onClick={() => setCurrentReps(r => r + 1)}
                    className="btn-secondary px-4 py-2"
                  >
                    +1
                  </button>
                </div>
              </div>

              {/* Complete set button */}
              <button
                onClick={() => completeSet(currentIndex)}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4"
              >
                <Check size={20} /> Complete Set
              </button>

              {/* Timer */}
              {showTimer && <Timer onComplete={() => setShowTimer(false)} />}

              {/* Completed sets */}
              {current.sets.length > 0 && (
                <div className="card p-4">
                  <h3 className="text-sm text-text-secondary mb-3">Completed Sets</h3>
                  <div className="space-y-2">
                    {current.sets.map((set, i) => (
                      <div key={i} className="flex justify-between text-sm py-1.5 border-b border-white/5 last:border-0">
                        <span className="text-text-muted">Set {i + 1}</span>
                        <span>{set.weight} kg x {set.reps} reps</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Save button */}
          <button
            onClick={saveWorkout}
            className="w-full py-4 border border-accent-from/50 rounded-xl text-accent-from 
                       font-medium hover:bg-accent-from/10 transition-colors"
          >
            Finish Workout
          </button>
        </>
      )}

      {showPicker && <ExercisePicker onSelect={addExercise} onClose={() => setShowPicker(false)} />}
    </div>
  )
}
