import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Exercise, type Preset } from '../db'
import { useApp } from '../context/AppContext'
import { Plus, Trash2, X } from 'lucide-react'
import ExercisePicker from '../components/ExercisePicker'

export default function PresetsPage() {
  const { t, currentUser } = useApp()

  const presets = useLiveQuery(() => {
    if (!currentUser) return []
    return db.presets.where('userId').equals(currentUser.id).toArray()
  }, [currentUser?.id])

  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newExercises, setNewExercises] = useState<Preset['exercises']>([])
  const [showPicker, setShowPicker] = useState(false)

  const createPreset = async () => {
    if (!newName.trim() || newExercises.length === 0 || !currentUser) return
    await db.presets.add({ userId: currentUser.id, name: newName.trim(), exercises: newExercises })
    setNewName('')
    setNewExercises([])
    setShowCreate(false)
  }

  const deletePreset = async (id: number) => {
    await db.presets.delete(id)
  }

  const addExerciseToPreset = (exercise: Exercise) => {
    setNewExercises(prev => [
      ...prev,
      { exerciseId: exercise.id!, exerciseName: exercise.name, category: exercise.category }
    ])
    setShowPicker(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t('presets')}</h1>
        <button onClick={() => setShowCreate(!showCreate)} className="p-3 bg-surface-hover rounded-full hover:bg-white/10">
          {showCreate ? <X size={20} /> : <Plus size={20} />}
        </button>
      </div>

      {showCreate && (
        <div className="card p-4 space-y-4">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder={t('presetName')}
            className="w-full bg-surface-hover border border-white/5 rounded-xl px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-from"
          />
          <div className="space-y-2">
            {newExercises.map((e, i) => (
              <div key={i} className="flex items-center justify-between bg-surface-hover rounded-lg px-3 py-2">
                <span className="text-sm">{e.exerciseName}</span>
                <button onClick={() => setNewExercises(prev => prev.filter((_, idx) => idx !== i))} className="text-text-muted hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => setShowPicker(true)} className="btn-secondary w-full flex items-center justify-center gap-2">
            <Plus size={16} /> {t('addExercise')}
          </button>
          <button onClick={createPreset} className="btn-primary w-full">{t('savePreset')}</button>
        </div>
      )}

      {presets?.length === 0 && !showCreate && (
        <div className="card p-8 text-center"><p className="text-text-secondary">{t('noPresets')}</p></div>
      )}

      {presets?.map(preset => (
        <div key={preset.id} className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">{preset.name}</h3>
            <button onClick={() => deletePreset(preset.id!)} className="text-text-muted hover:text-red-400 p-1"><Trash2 size={16} /></button>
          </div>
          <div className="space-y-1">
            {preset.exercises.map((e, i) => (
              <div key={i} className="text-sm text-text-secondary py-1 border-b border-white/5 last:border-0">{e.exerciseName}</div>
            ))}
          </div>
        </div>
      ))}

      {showPicker && <ExercisePicker onSelect={addExerciseToPreset} onClose={() => setShowPicker(false)} />}
    </div>
  )
}
