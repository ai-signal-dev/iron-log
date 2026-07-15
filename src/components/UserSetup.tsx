import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function UserSetup() {
  const { createUser, users, switchUser, t } = useApp()
  const [name, setName] = useState('')

  const handleCreate = () => {
    if (name.trim()) {
      createUser(name.trim())
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card p-8 w-full max-w-sm space-y-6 glow">
        <div className="text-center">
          <h1 className="text-3xl font-semibold bg-gradient-accent bg-clip-text text-transparent">
            IRON LOG
          </h1>
          <p className="text-text-secondary mt-2 text-sm">{t('createUser')}</p>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            placeholder={t('userName')}
            className="w-full bg-surface-hover border border-white/5 rounded-xl px-4 py-3
                       text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-from"
          />
          <button onClick={handleCreate} className="btn-primary w-full">
            {t('createUser')}
          </button>
        </div>

        {users.length > 0 && (
          <div className="border-t border-white/5 pt-4">
            <p className="text-sm text-text-secondary mb-3">{t('switchUser')}</p>
            <div className="space-y-2">
              {users.map(user => (
                <button
                  key={user.id}
                  onClick={() => switchUser(user.id)}
                  className="w-full text-left px-4 py-3 rounded-xl bg-surface-hover 
                             hover:bg-white/10 transition-colors text-text-primary"
                >
                  {user.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
