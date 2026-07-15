import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { useApp } from '../context/AppContext'
import { Calendar } from 'lucide-react'

export default function HistoryPage() {
  const { t, currentUser, locale } = useApp()

  const workouts = useLiveQuery(() => {
    if (!currentUser) return []
    return db.workouts.where('userId').equals(currentUser.id).reverse().sortBy('createdAt')
  }, [currentUser?.id])

  const grouped = workouts?.reduce((acc, w) => {
    if (!acc[w.date]) acc[w.date] = []
    acc[w.date].push(w)
    return acc
  }, {} as Record<string, typeof workouts>) ?? {}

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
              {entries!.map(entry => (
                <div key={entry.id} className="border-b border-white/5 last:border-0 pb-2 last:pb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{entry.exerciseName}</span>
                    <span className="text-xs text-text-muted">{entry.sets.length} {t('sets')}</span>
                  </div>
                  <div className="flex gap-3 text-sm text-text-secondary">
                    {entry.sets.map((set, i) => (
                      <span key={i}>{set.weight}kg x {set.reps}</span>
                    ))}
                  </div>
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
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  })
}
