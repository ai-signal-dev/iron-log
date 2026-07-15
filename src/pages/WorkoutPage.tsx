import { useState, useRef, useCallback } from 'react'
import { Plus, Check, Trash2, Mic } from 'lucide-react'
import { db, type Exercise, type WorkoutEntry, type WorkoutSet } from '../db'
import { useApp } from '../context/AppContext'
import { parseVoiceInput } from '../utils/voiceParser'
import ExercisePicker from '../components/ExercisePicker'
import Timer from '../components/Timer'

interface ActiveExercise {
  exercise: Exercise
  weight: number
  sets: WorkoutSet[]
  currentReps: number
}

const QUICK_WEIGHTS = [30, 40, 50, 60, 70, 80, 90, 100, 110, 120]

export default function WorkoutPage() {
  const { t, currentUser, locale } = useApp()
  const [activeExercises, setActiveExercises] = useState<ActiveExercise[]>([])
  const [showPicker, setShowPicker] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [showTimer, setShowTimer] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const today = new Date().toISOString().split('T')[0]

  const getExerciseDisplayName = (exercise: Exercise) => {
    if (locale === 'ja' && exercise.nameJa) return exercise.nameJa
    return exercise.name
  }

  // Voice input
  const toggleVoice = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert(locale === 'ja'
        ? 'このブラウザは音声認識に対応していません。Chrome/Edgeをお使いください。'
        : 'Speech recognition is not supported. Please use Chrome or Edge.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = locale === 'ja' ? 'ja-JP' : 'en-US'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript
      if (!transcript) return

      const parsed = await parseVoiceInput(transcript)
      for (const entry of parsed) {
        if (entry.exercise) {
          const existingIdx = activeExercises.findIndex(
            e => e.exercise.id === entry.exercise!.id
          )
          if (existingIdx >= 0 && entry.weight > 0 && entry.reps > 0) {
            for (let i = 0; i < entry.sets; i++) {
              const newSet: WorkoutSet = { weight: entry.weight, reps: entry.reps, completedAt: Date.now() }
              setActiveExercises(prev => prev.map((e, idx) =>
                idx === existingIdx ? { ...e, weight: entry.weight, sets: [...e.sets, newSet] } : e
              ))
            }
          } else {
            const sets: WorkoutSet[] = []
            if (entry.weight > 0 && entry.reps > 0) {
              for (let i = 0; i < entry.sets; i++) {
                sets.push({ weight: entry.weight, reps: entry.reps, completedAt: Date.now() })
              }
            }
            setActiveExercises(prev => [...prev, {
              exercise: entry.exercise!,
              weight: entry.weight || 0,
              sets,
              currentReps: entry.reps || 10,
            }])
          }
        }
      }
    }

    recognition.onerror = (e: any) => {
      console.error('Speech recognition error:', e.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    try {
      recognition.start()
      recognitionRef.current = recognition
      setIsListening(true)
    } catch (e) {
      console.error('Failed to start speech recognition:', e)
      setIsListening(false)
    }
  }, [isListening, locale, activeExercises])

  const addExercise = (exercise: Exercise) => {
    setActiveExercises(prev => [...prev, { exercise, weight: 0, sets: [], currentReps: 10 }])
    setShowPicker(false)
    setExpandedIndex(activeExercises.length)
  }

  const updateWeight = (index: number, weight: number) => {
    setActiveExercises(prev =>
      prev.map((e, i) => i === index ? { ...e, weight: Math.max(0, weight) } : e)
    )
  }

  const updateReps = (index: number, reps: number) => {
    setActiveExercises(prev =>
      prev.map((e, i) => i === index ? { ...e, currentReps: Math.max(1, reps) } : e)
    )
  }

  const completeSet = (index: number) => {
    const ex = activeExercises[index]
    const newSet: WorkoutSet = { weight: ex.weight, reps: ex.currentReps, completedAt: Date.now() }
    setActiveExercises(prev =>
      prev.map((e, i) => i === index ? { ...e, sets: [...e.sets, newSet] } : e)
    )
    setShowTimer(true)
  }

  const removeExercise = (index: number) => {
    setActiveExercises(prev => prev.filter((_, i) => i !== index))
    if (expandedIndex === index) setExpandedIndex(null)
  }

  const saveWorkout = async () => {
    if (!currentUser) return
    const entries: Omit<WorkoutEntry, 'id'>[] = activeExercises
      .filter(e => e.sets.length > 0)
      .map(e => ({
        userId: currentUser.id,
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
      setExpandedIndex(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <h1 className="text-2xl font-semibold">{t('todaysDashboard')}</h1>

      {/* Voice Input - Large prominent button */}
      <div className="card p-4 glow">
        <button
          onClick={toggleVoice}
          className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl transition-all duration-200 ${
            isListening
              ? 'bg-gradient-accent text-white animate-pulse'
              : 'bg-surface-hover text-text-secondary hover:text-text-primary hover:bg-white/10'
          }`}
        >
          <Mic size={24} />
          <span className="text-lg font-medium">
            {isListening ? t('listening') : t('voiceHint')}
          </span>
        </button>
      </div>

      {/* Today's exercises dashboard */}
      {activeExercises.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-text-secondary mb-4">{t('noExercisesYet')}</p>
          <button onClick={() => setShowPicker(true)} className="btn-primary">
            {t('addExercise')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {activeExercises.map((item, index) => (
            <div key={index} className="card overflow-hidden">
              {/* Exercise header - always visible */}
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div>
                  <span className="font-medium">{getExerciseDisplayName(item.exercise)}</span>
                  {item.sets.length > 0 && (
                    <span className="ml-2 text-xs text-text-muted">
                      {item.sets.length} {t('sets')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {item.sets.length > 0 && (
                    <span className="text-sm text-text-secondary">
                      {item.sets[item.sets.length - 1].weight}kg x {item.sets[item.sets.length - 1].reps}
                    </span>
                  )}
                  <button
                    onClick={e => { e.stopPropagation(); removeExercise(index) }}
                    className="p-1 text-text-muted hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </button>

              {/* Expanded: weight/reps input */}
              {expandedIndex === index && (
                <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
                  {/* Quick weight buttons */}
                  <div>
                    <label className="text-xs text-text-muted block mb-1.5">{t('quickWeight')}</label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {QUICK_WEIGHTS.map(w => (
                        <button
                          key={w}
                          onClick={() => updateWeight(index, w)}
                          className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                            item.weight === w
                              ? 'bg-gradient-accent text-white'
                              : 'bg-surface-hover text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fine weight adjustment */}
                  <div>
                    <label className="text-xs text-text-muted block mb-1.5">{t('weightKg')}</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateWeight(index, item.weight - 2.5)} className="btn-secondary px-3 py-1.5 text-sm">-2.5</button>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={item.weight || ''}
                        onChange={e => updateWeight(index, parseFloat(e.target.value) || 0)}
                        className="flex-1 text-center text-2xl font-light bg-transparent border-b border-white/10 py-1 
                                   focus:outline-none focus:border-accent-from min-w-0"
                      />
                      <button onClick={() => updateWeight(index, item.weight + 2.5)} className="btn-secondary px-3 py-1.5 text-sm">+2.5</button>
                    </div>
                  </div>

                  {/* Reps */}
                  <div>
                    <label className="text-xs text-text-muted block mb-1.5">{t('reps')}</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateReps(index, item.currentReps - 1)} className="btn-secondary px-3 py-1.5 text-sm">-1</button>
                      <span className="flex-1 text-center text-2xl font-light">{item.currentReps}</span>
                      <button onClick={() => updateReps(index, item.currentReps + 1)} className="btn-secondary px-3 py-1.5 text-sm">+1</button>
                    </div>
                  </div>

                  {/* Complete set */}
                  <button
                    onClick={() => completeSet(index)}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                  >
                    <Check size={18} /> {t('completeSet')}
                  </button>

                  {/* Timer */}
                  {showTimer && expandedIndex === index && (
                    <Timer onComplete={() => setShowTimer(false)} />
                  )}

                  {/* Completed sets for this exercise */}
                  {item.sets.length > 0 && (
                    <div className="space-y-1 pt-2 border-t border-white/5">
                      {item.sets.map((set, si) => (
                        <div key={si} className="flex justify-between text-sm py-1">
                          <span className="text-text-muted">{t('set')} {si + 1}</span>
                          <span>{set.weight}kg x {set.reps}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Add more + Finish */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowPicker(true)}
              className="flex-1 btn-secondary flex items-center justify-center gap-2 py-3"
            >
              <Plus size={18} /> {t('addExercise')}
            </button>
            <button
              onClick={saveWorkout}
              className="flex-1 py-3 border border-accent-from/50 rounded-xl text-accent-from font-medium hover:bg-accent-from/10 transition-colors"
            >
              {t('finishWorkout')}
            </button>
          </div>
        </div>
      )}

      {showPicker && <ExercisePicker onSelect={addExercise} onClose={() => setShowPicker(false)} />}
    </div>
  )
}
