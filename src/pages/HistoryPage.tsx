import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { Calendar } from 'lucide-react'

export default function HistoryPage() {
  const workouts = useLiveQuery(() =>
    db.workouts.orderBy('createdAt').reverse().limit(50).toArray()
  )

  const grouped = workouts?.reduce((acc, w) => {
    if (!acc[w.date]) acc[w.date] = []
    acc[w.date].push(w)
    return acc
  }, {} as Record<string, typeof workouts>) ?? {}

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">History</h1>

      {Object.keys(grouped).length === 0 ? (
        <div className="card p-8 text-center">
          <Calendar size={32} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-secondary">No workouts recorded yet</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, entries]) => (
          <div key={date} className="card p-4">
            <h2 className="text-sm text-text-muted mb-3">{formatDate(date)}</h2>
            <div className="space-y-3">
              {entries!.map(entry => (
                <div key={entry.id} className="border-b border-white/5 last:border-0 pb-2 last:pb-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{entry.exerciseName}</span>
                    <span className="text-xs text-text-muted">{entry.sets.length} sets</span>
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

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  })
}
