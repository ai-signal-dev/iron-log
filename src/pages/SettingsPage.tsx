import { useState } from 'react'
import { db } from '../db'
import { Download, Upload, Plus } from 'lucide-react'

export default function SettingsPage() {
  const [customName, setCustomName] = useState('')
  const [customCategory, setCustomCategory] = useState<string>('chest')
  const [importStatus, setImportStatus] = useState<string | null>(null)

  const exportData = async () => {
    const data = {
      exercises: await db.exercises.toArray(),
      workouts: await db.workouts.toArray(),
      presets: await db.presets.toArray(),
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `iron-log-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      await db.transaction('rw', [db.exercises, db.workouts, db.presets], async () => {
        await db.exercises.clear()
        await db.workouts.clear()
        await db.presets.clear()

        if (data.exercises) await db.exercises.bulkAdd(data.exercises)
        if (data.workouts) await db.workouts.bulkAdd(data.workouts)
        if (data.presets) await db.presets.bulkAdd(data.presets)
      })

      setImportStatus('Import successful')
    } catch {
      setImportStatus('Import failed - invalid file')
    }

    e.target.value = ''
    setTimeout(() => setImportStatus(null), 3000)
  }

  const addCustomExercise = async () => {
    if (!customName.trim()) return
    await db.exercises.add({
      name: customName.trim(),
      category: customCategory as any,
      isCustom: true,
    })
    setCustomName('')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      {/* Backup */}
      <div className="card p-4 space-y-4">
        <h2 className="font-medium">Backup</h2>

        <button onClick={exportData} className="btn-secondary w-full flex items-center justify-center gap-2">
          <Download size={16} /> Export Data
        </button>

        <label className="btn-secondary w-full flex items-center justify-center gap-2 cursor-pointer">
          <Upload size={16} /> Import Data
          <input type="file" accept=".json" onChange={importData} className="hidden" />
        </label>

        {importStatus && (
          <p className={`text-sm text-center ${importStatus.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
            {importStatus}
          </p>
        )}
      </div>

      {/* Custom Exercise */}
      <div className="card p-4 space-y-4">
        <h2 className="font-medium">Add Custom Exercise</h2>

        <input
          type="text"
          value={customName}
          onChange={e => setCustomName(e.target.value)}
          placeholder="Exercise name"
          className="w-full bg-surface-hover border border-white/5 rounded-xl px-4 py-2.5 
                     text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-from"
        />

        <select
          value={customCategory}
          onChange={e => setCustomCategory(e.target.value)}
          className="w-full bg-surface-hover border border-white/5 rounded-xl px-4 py-2.5 
                     text-text-primary focus:outline-none focus:border-accent-from"
        >
          <option value="chest">Chest</option>
          <option value="back">Back</option>
          <option value="legs">Legs</option>
          <option value="shoulders">Shoulders</option>
          <option value="arms">Arms</option>
          <option value="core">Core</option>
        </select>

        <button onClick={addCustomExercise} className="btn-primary w-full flex items-center justify-center gap-2">
          <Plus size={16} /> Add
        </button>
      </div>

      {/* App info */}
      <div className="card p-4">
        <p className="text-sm text-text-muted text-center">IRON LOG v1.0.0</p>
        <p className="text-xs text-text-muted text-center mt-1">All data stored locally on device</p>
      </div>
    </div>
  )
}
