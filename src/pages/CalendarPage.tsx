import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type MuscleGroup } from '../db'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const categoryColors: Record<MuscleGroup, string> = {
  chest: '#ef4444',
  back: '#3b82f6',
  legs: '#22c55e',
  shoulders: '#f59e0b',
  arms: '#8b5cf6',
  core: '#06b6d4',
}

const categoryLabels: Record<MuscleGroup, string> = {
  chest: 'Chest',
  back: 'Back',
  legs: 'Legs',
  shoulders: 'Shoulders',
  arms: 'Arms',
  core: 'Core',
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })

  const workouts = useLiveQuery(() => {
    const start = `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, '0')}-01`
    const endMonth = currentMonth.month === 11 ? 0 : currentMonth.month + 1
    const endYear = currentMonth.month === 11 ? currentMonth.year + 1 : currentMonth.year
    const end = `${endYear}-${String(endMonth + 1).padStart(2, '0')}-01`
    return db.workouts.where('date').between(start, end, true, false).toArray()
  }, [currentMonth])

  const dayCategories = workouts?.reduce((acc, w) => {
    const day = parseInt(w.date.split('-')[2])
    if (!acc[day]) acc[day] = new Set()
    acc[day].add(w.category)
    return acc
  }, {} as Record<number, Set<MuscleGroup>>) ?? {}

  const daysInMonth = new Date(currentMonth.year, currentMonth.month + 1, 0).getDate()
  const firstDayOfWeek = new Date(currentMonth.year, currentMonth.month, 1).getDay()

  const prevMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 }
      return { ...prev, month: prev.month - 1 }
    })
  }

  const nextMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 }
      return { ...prev, month: prev.month + 1 }
    })
  }

  const monthLabel = new Date(currentMonth.year, currentMonth.month).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Calendar</h1>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 hover:bg-surface-hover rounded-lg">
            <ChevronLeft size={20} />
          </button>
          <span className="font-medium">{monthLabel}</span>
          <button onClick={nextMonth} className="p-2 hover:bg-surface-hover rounded-lg">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-text-muted mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const categories = dayCategories[day]
            return (
              <div
                key={day}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm relative ${
                  categories ? 'bg-surface-hover' : ''
                }`}
              >
                <span className={categories ? 'text-text-primary' : 'text-text-muted'}>
                  {day}
                </span>
                {categories && (
                  <div className="flex gap-0.5 mt-0.5">
                    {Array.from(categories).map(cat => (
                      <div
                        key={cat}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: categoryColors[cat] }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="card p-4">
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(categoryColors) as MuscleGroup[]).map(cat => (
            <div key={cat} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: categoryColors[cat] }}
              />
              <span className="text-xs text-text-secondary">{categoryLabels[cat]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
