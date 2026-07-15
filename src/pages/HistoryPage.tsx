import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type WorkoutEntry, type WorkoutSet } from '../db'
import { useApp } from '../context/AppContext'
import { Calendar, Pencil, Trash2, Check, X } from 'lucide-react'

export default function HistoryPage() {
  const { t, currentUser, locale } = useApp()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editSets, setEditSets] = useState<WorkoutSet[]>([])

  const workouts = useLiveQuery(() => {
    if (!currentUser) return []
    return db.workouts.where('userId').equals(currentUser.id).reverse().sortBy('createdAt')
  }, [currentUser?.id])

  const grouped = workouts?.reduce((acc, w) => {
    if (!acc[w.date]) acc[w.date] = []
    acc[w.date].push(w)
    return acc
  }, {} as Record<string, WorkoutEntry[]>) ?? {}

  const startEdit = (entry: WorkoutEntry) => {
    setEditingId(entry.id!)
    setEditSets([...entry.sets])
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditSets([])
  }

  const saveEdit = async () => {
    if (editingId === null) return
    await db.workouts.update(editingId, { sets: editSets })
    setEditingId(null)
    setEditSets([])
  }

  const deleteEntry = async (id: number) => {
    await db.workouts.delete(id)
  }

  const updateSetWeight = (setIndex: number, weight: number) => {
    setEditSets(prev => prev.map((s, i) => i === setIndex ? { ...s, weight } : s))
  }

  const updateSetReps = (setIndex: number, reps: number) => {
    setEditSets(prev => prev.map((s, i) => i === setIndex ? { ...s, reps } : s))
  }

  const removeSet = (setIndex: number) => {
    setEditSets(prev => prev.filter((_, i) => i !== setIndex))
  }

  const addSet = () => {
    const last = editSets[editSets.length - 1]
    setEditSets(prev => [...prev, { weight: last?.weight || 0, reps: last?.reps || 10, completedAt: Date.now() }])
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t('history')}</h1>

      {Object.keys(grouped).length === 0 ? (
        <div className="card p-8 text-center">
          <Calendar size={32} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-secondary">{t('noWorkouts')}</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, entries]) => (
          <div key={date} className="card p-4">
            <h2 className="text-sm text-text-muted mb-3">{formatDate(date, locale)}</h2>
            <div className="space-y-3">
              {entries.map(entry => (
                <div key={entry.id} className="border-b border-white/5 last:border-0 pb-3 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{entry.exerciseName}</span>
                    <div className="flex items-center gap-1">
                      {editingId === entry.id ? (
                        <>
                          <button onClick={saveEdit} className="p-1.5 text-green-400 hover:bg-green-400/10 rounded-lg">
                            <Check size={14} />
                          </button>
                          <button onClick={cancelEdit} className="p-1.5 text-text-muted hover:text-text-primary rounded-lg">
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(entry)} className="p-1.5 text-text-muted hover:text-accent-from rounded-lg">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => deleteEntry(entry.id!)} className="p-1.5 text-text-muted hover:text-red-400 rounded-lg">
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {editingId === entry.id ? (
                    <div className="space-y-2">
                      {editSets.map((set, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <span className="text-text-muted w-12">{t('set')} {i + 1}</span>
                          <input
                            type="number"
                            inputMode="decimal"
                            value={set.weight}
                            onChange={e => updateSetWeight(i, parseFloat(e.target.value) || 0)}
                            className="w-16 bg-surface-hover border border-white/10 rounded-lg px-2 py-1 text-center text-text-primary min-w-0"
                          />
                          <span className="text-text-muted">kg x</span>
                          <input
                            type="number"
                            inputMode="numeric"
                            value={set.reps}
                            onChange={e => updateSetReps(i, parseInt(e.target.value) || 0)}
                            className="w-12 bg-surface-hover border border-white/10 rounded-lg px-2 py-1 text-center text-text-primary min-w-0"
                          />
                          <button onClick={() => removeSet(i)} className="p-1 text-text-muted hover:text-red-400">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      <button onClick={addSet} className="text-xs text-accent-from hover:text-accent-to">
                        + {t('add')} {t('set')}
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3 text-sm text-text-secondary flex-wrap">
                      {entry.sets.map((set, i) => (
                        <span key={i}>{set.weight}kg x {set.reps}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric', weekday: 'short',
  })
}
