import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Exercise, type MuscleGroup } from '../db'
import { useApp } from '../context/AppContext'
import { Search, X, PenLine } from 'lucide-react'
import type { TranslationKey } from '../i18n'

const categoryKeys: { key: MuscleGroup; labelKey: TranslationKey }[] = [
  { key: 'chest', labelKey: 'chest' },
  { key: 'back', labelKey: 'back' },
  { key: 'legs', labelKey: 'legs' },
  { key: 'shoulders', labelKey: 'shoulders' },
  { key: 'arms', labelKey: 'arms' },
  { key: 'core', labelKey: 'core' },
]

interface ExercisePickerProps {
  onSelect: (exercise: Exercise) => void
  onClose: () => void
}

export default function ExercisePicker({ onSelect, onClose }: ExercisePickerProps) {
  const { t } = useApp()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<MuscleGroup | null>(null)
  const [showCustom, setShowCustom] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customCategory, setCustomCategory] = useState<MuscleGroup>('chest')

  const exercises = useLiveQuery(() => {
    if (selectedCategory) {
      return db.exercises.where('category').equals(selectedCategory).toArray()
    }
    return db.exercises.orderBy('name').toArray()
  }, [selectedCategory])

  const filtered = exercises?.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  const handleAddCustom = async () => {
    if (!customName.trim()) return
    const id = await db.exercises.add({
      name: customName.trim(),
      category: customCategory,
      isCustom: true,
    })
    const exercise = await db.exercises.get(id)
    if (exercise) onSelect(exercise)
    setCustomName('')
    setShowCustom(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full max-w-lg mx-auto bg-surface border-t border-white/5 rounded-t-3xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h2 className="text-lg font-medium">{t('selectExercise')}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCustom(!showCustom)}
              className={`p-2 rounded-lg transition-colors ${showCustom ? 'text-accent-from' : 'text-text-muted hover:text-text-primary'}`}
            >
              <PenLine size={18} />
            </button>
            <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary">
              <X size={20} />
            </button>
          </div>
        </div>

        {showCustom ? (
          <div className="p-4 space-y-3">
            <input
              type="text"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddCustom()}
              placeholder={t('exerciseName')}
              autoFocus
              className="w-full bg-surface-hover border border-white/5 rounded-xl px-4 py-2.5 
                         text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-from"
            />
            <div className="flex gap-2 flex-wrap">
              {categoryKeys.map(({ key, labelKey }) => (
                <button
                  key={key}
                  onClick={() => setCustomCategory(key)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    customCategory === key ? 'bg-gradient-accent text-white' : 'bg-surface-hover text-text-secondary'
                  }`}
                >
                  {t(labelKey)}
                </button>
              ))}
            </div>
            <button onClick={handleAddCustom} className="btn-primary w-full">
              {t('add')}
            </button>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-white/5">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t('searchExercises')}
                  className="w-full bg-surface-hover border border-white/5 rounded-xl pl-9 pr-4 py-2.5 
                             text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-from"
                />
              </div>

              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap transition-colors ${
                    !selectedCategory ? 'bg-gradient-accent text-white' : 'bg-surface-hover text-text-secondary'
                  }`}
                >
                  {t('all')}
                </button>
                {categoryKeys.map(({ key, labelKey }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap transition-colors ${
                      selectedCategory === key ? 'bg-gradient-accent text-white' : 'bg-surface-hover text-text-secondary'
                    }`}
                  >
                    {t(labelKey)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {filtered.map(exercise => (
                <button
                  key={exercise.id}
                  onClick={() => onSelect(exercise)}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-surface-hover transition-colors"
                >
                  <span className="text-text-primary">{exercise.name}</span>
                  <span className="ml-2 text-xs text-text-muted">{t(exercise.category as TranslationKey)}</span>
                </button>
              ))}
              {filtered.length === 0 && search && (
                <div className="text-center py-6">
                  <p className="text-text-muted text-sm mb-3">"{search}" not found</p>
                  <button
                    onClick={() => { setCustomName(search); setShowCustom(true) }}
                    className="btn-secondary text-sm"
                  >
                    {t('add')} "{search}"
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
