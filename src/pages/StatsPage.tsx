import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type WorkoutEntry } from '../db'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function StatsPage() {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)

  const exercises = useLiveQuery(() => db.exercises.toArray())
  const workouts = useLiveQuery<WorkoutEntry[]>(() =>
    selectedExercise
      ? db.workouts.where('exerciseName').equals(selectedExercise).sortBy('date')
      : Promise.resolve([])
  , [selectedExercise])

  const chartData = (workouts ?? []).map(w => {
    const maxWeight = Math.max(...w.sets.map(s => s.weight))
    const totalVolume = w.sets.reduce((sum, s) => sum + s.weight * s.reps, 0)
    const bestSet = w.sets.reduce((best, s) => s.weight > best.weight ? s : best, w.sets[0])
    const estimated1RM = bestSet ? Math.round(bestSet.weight * (1 + bestSet.reps / 30)) : 0

    return {
      date: w.date.slice(5), // MM-DD
      maxWeight,
      volume: totalVolume,
      estimated1RM,
    }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Stats</h1>

      <div className="card p-4">
        <label className="text-sm text-text-secondary block mb-2">Select Exercise</label>
        <select
          value={selectedExercise ?? ''}
          onChange={e => setSelectedExercise(e.target.value || null)}
          className="w-full bg-surface-hover border border-white/5 rounded-xl px-4 py-2.5 
                     text-text-primary focus:outline-none focus:border-accent-from"
        >
          <option value="">-- Select --</option>
          {exercises?.map(e => (
            <option key={e.id} value={e.name}>{e.name}</option>
          ))}
        </select>
      </div>

      {chartData.length > 0 && (
        <>
          <div className="card p-4">
            <h3 className="text-sm text-text-secondary mb-4">Max Weight (kg)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Line type="monotone" dataKey="maxWeight" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-4">
            <h3 className="text-sm text-text-secondary mb-4">Estimated 1RM (kg)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Line type="monotone" dataKey="estimated1RM" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-4">
            <h3 className="text-sm text-text-secondary mb-4">Volume (kg)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Line type="monotone" dataKey="volume" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {selectedExercise && chartData.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-text-secondary">No data yet for this exercise</p>
        </div>
      )}
    </div>
  )
}
