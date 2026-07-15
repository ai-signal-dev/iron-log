import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { type Locale, getTranslations, type TranslationKey } from '../i18n'

interface UserProfile {
  id: string
  name: string
  createdAt: number
}

interface AppContextType {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: TranslationKey) => string
  currentUser: UserProfile | null
  users: UserProfile[]
  switchUser: (id: string) => void
  createUser: (name: string) => void
  deleteUser: (id: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    return (localStorage.getItem('iron-log-locale') as Locale) || 'en'
  })

  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('iron-log-users')
    return saved ? JSON.parse(saved) : []
  })

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    return localStorage.getItem('iron-log-current-user')
  })

  const currentUser = users.find(u => u.id === currentUserId) || null

  useEffect(() => {
    localStorage.setItem('iron-log-locale', locale)
  }, [locale])

  useEffect(() => {
    localStorage.setItem('iron-log-users', JSON.stringify(users))
  }, [users])

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem('iron-log-current-user', currentUserId)
    } else {
      localStorage.removeItem('iron-log-current-user')
    }
  }, [currentUserId])

  const setLocale = (l: Locale) => setLocaleState(l)

  const t = (key: TranslationKey) => getTranslations(locale)[key]

  const createUser = (name: string) => {
    const newUser: UserProfile = { id: generateId(), name, createdAt: Date.now() }
    setUsers(prev => [...prev, newUser])
    setCurrentUserId(newUser.id)
  }

  const switchUser = (id: string) => {
    setCurrentUserId(id)
  }

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id))
    if (currentUserId === id) {
      setCurrentUserId(users.find(u => u.id !== id)?.id || null)
    }
    // Delete user data from IndexedDB
    import('../db').then(({ db }) => {
      db.workouts.where('userId').equals(id).delete()
      db.presets.where('userId').equals(id).delete()
    })
  }

  return (
    <AppContext.Provider value={{ locale, setLocale, t, currentUser, users, switchUser, createUser, deleteUser }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
