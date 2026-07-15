import { useState } from 'react'
import { db } from '../db'
import { useApp } from '../context/AppContext'
import { Download, Upload, Plus, LogOut, Trash2 } from 'lucide-react'

export default function SettingsPage() {
  const { t, locale, setLocale, currentUser, users, switchUser, createUser, deleteUser } = useApp()
  const [customName, setCustomName] = useState('')
  const [customCategory, setCustomCategory] = useState<string>('chest')
  const [importStatus, setImportStatus] = useState<string | null>(null)
  const [newUserName, setNewUserName] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const exportData = async () => {
    if (!currentUser) return
    const workouts = await db.workouts.where('userId').equals(currentUser.id).toArray()
    const presets = await db.presets.where('userId').equals(currentUser.id).toArray()
    const exercises = await db.exercises.toArray()

    const data = { exercises, workouts, presets, exportedAt: new Date().toISOString(), userId: currentUser.id, userName: currentUser.name }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `iron-log-${currentUser.name}-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !currentUser) return
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      await db.transaction('rw', [db.exercises, db.workouts, db.presets], async () => {
        if (data.workouts) {
          const userWorkouts = data.workouts.map((w: any) => ({ ...w, id: undefined, userId: currentUser.id }))
          await db.workouts.bulkAdd(userWorkouts)
        }
        if (data.presets) {
          const userPresets = data.presets.map((p: any) => ({ ...p, id: undefined, userId: currentUser.id }))
          await db.presets.bulkAdd(userPresets)
        }
      })
      setImportStatus(t('importSuccess'))
    } catch {
      setImportStatus(t('importFailed'))
    }
    e.target.value = ''
    setTimeout(() => setImportStatus(null), 3000)
  }

  const addCustomExercise = async () => {
    if (!customName.trim()) return
    await db.exercises.add({ name: customName.trim(), category: customCategory as any, isCustom: true })
    setCustomName('')
  }

  const handleCreateUser = () => {
    if (newUserName.trim()) {
      createUser(newUserName.trim())
      setNewUserName('')
    }
  }

  const handleDeleteUser = () => {
    if (currentUser) {
      deleteUser(currentUser.id)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t('settings')}</h1>

      {/* User Profile */}
      <div className="card p-4 space-y-4">
        <h2 className="font-medium">{t('userProfile')}</h2>
        <div className="flex items-center justify-between bg-surface-hover rounded-xl px-4 py-3">
          <span>{currentUser?.name}</span>
          <span className="text-xs text-text-muted">{t('currentUser')}</span>
        </div>

        {users.length > 1 && (
          <div className="space-y-2">
            <p className="text-sm text-text-secondary">{t('switchUser')}</p>
            {users.filter(u => u.id !== currentUser?.id).map(user => (
              <button
                key={user.id}
                onClick={() => switchUser(user.id)}
                className="w-full text-left px-4 py-2 rounded-xl bg-surface-hover hover:bg-white/10 transition-colors flex items-center justify-between"
              >
                <span>{user.name}</span>
                <LogOut size={14} className="text-text-muted" />
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={newUserName}
            onChange={e => setNewUserName(e.target.value)}
            placeholder={t('userName')}
            className="flex-1 bg-surface-hover border border-white/5 rounded-xl px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-from"
          />
          <button onClick={handleCreateUser} className="btn-primary px-4">{t('createUser')}</button>
        </div>

        {!showDeleteConfirm ? (
          <button onClick={() => setShowDeleteConfirm(true)} className="text-sm text-red-400 hover:text-red-300">
            {t('deleteUser')}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-400">{t('deleteUserConfirm')}</span>
            <button onClick={handleDeleteUser} className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm">
              <Trash2 size={14} />
            </button>
            <button onClick={() => setShowDeleteConfirm(false)} className="px-3 py-1 bg-surface-hover rounded-lg text-sm">
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Language */}
      <div className="card p-4 space-y-3">
        <h2 className="font-medium">{t('language')}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setLocale('en')}
            className={`flex-1 py-2 rounded-xl text-sm transition-colors ${locale === 'en' ? 'bg-gradient-accent text-white' : 'bg-surface-hover text-text-secondary'}`}
          >
            {t('english')}
          </button>
          <button
            onClick={() => setLocale('ja')}
            className={`flex-1 py-2 rounded-xl text-sm transition-colors ${locale === 'ja' ? 'bg-gradient-accent text-white' : 'bg-surface-hover text-text-secondary'}`}
          >
            {t('japanese')}
          </button>
        </div>
      </div>

      {/* Backup */}
      <div className="card p-4 space-y-4">
        <h2 className="font-medium">{t('backup')}</h2>
        <button onClick={exportData} className="btn-secondary w-full flex items-center justify-center gap-2">
          <Download size={16} /> {t('exportData')}
        </button>
        <label className="btn-secondary w-full flex items-center justify-center gap-2 cursor-pointer">
          <Upload size={16} /> {t('importData')}
          <input type="file" accept=".json" onChange={importData} className="hidden" />
        </label>
        {importStatus && (
          <p className={`text-sm text-center ${importStatus.includes('success') || importStatus.includes('成功') ? 'text-green-400' : 'text-red-400'}`}>
            {importStatus}
          </p>
        )}
      </div>

      {/* Custom Exercise */}
      <div className="card p-4 space-y-4">
        <h2 className="font-medium">{t('addCustomExercise')}</h2>
        <input
          type="text"
          value={customName}
          onChange={e => setCustomName(e.target.value)}
          placeholder={t('exerciseName')}
          className="w-full bg-surface-hover border border-white/5 rounded-xl px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-from"
        />
        <select
          value={customCategory}
          onChange={e => setCustomCategory(e.target.value)}
          className="w-full bg-surface-hover border border-white/5 rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-from"
        >
          <option value="chest">{t('chest')}</option>
          <option value="back">{t('back')}</option>
          <option value="legs">{t('legs')}</option>
          <option value="shoulders">{t('shoulders')}</option>
          <option value="arms">{t('arms')}</option>
          <option value="core">{t('core')}</option>
        </select>
        <button onClick={addCustomExercise} className="btn-primary w-full flex items-center justify-center gap-2">
          <Plus size={16} /> {t('add')}
        </button>
      </div>

      <div className="card p-4">
        <p className="text-sm text-text-muted text-center">IRON LOG v1.0.0</p>
        <p className="text-xs text-text-muted text-center mt-1">{t('allDataLocal')}</p>
      </div>
    </div>
  )
}
