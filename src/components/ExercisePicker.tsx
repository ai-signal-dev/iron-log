import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Exercise, type MuscleGroup } from '../db'
import { Search, X } from 'lucide-react'

const categoryLabels: Record<MuscleGroup, string> = {
  chest: 'Chest',
  back: 'Back',
  legs: 'Legs',
  shoulders: 'Shoulders',
  arms: 'Arms',
  core: 'Core',
}

interface ExercisePickerProps {
  onSelect: (exercise: Exercise) => void
  onClose: () => void
}

export default function ExercisePicker({ onSelect, onClose }: ExercisePickerProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<MuscleGroup | null>(null)

  const exercises = useLiveQuery(() => {
    let query = db.exercises.orderBy('name')
    if (selectedCategory) {
      query = db.exercises.where('category').equals(selectedCategory)
    }
    return query.toArray()
  }, [selectedCategory])

  const filtered = exercises?.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full max-w-lg mx-auto bg-surface border-t border-white/5 rounded-t-3xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h2 className="text-lg font-medium">Select Exercise</h2>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search exercises..."
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
              All
            </button>
            {(Object.keys(categoryLabels) as MuscleGroup[]).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === cat ? 'bg-gradient-accent text-white' : 'bg-surface-hover text-text-secondary'
                }`}
              >
                {categoryLabels[cat]}
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
              <span className="ml-2 text-xs text-text-muted">{categoryLabels[exercise.category]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
