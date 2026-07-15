import { Outlet, NavLink } from 'react-router-dom'
import { Dumbbell, History, CalendarDays, TrendingUp, ListChecks, Settings } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { TranslationKey } from '../i18n'

const navItems: { to: string; icon: typeof Dumbbell; labelKey: TranslationKey }[] = [
  { to: '/workout', icon: Dumbbell, labelKey: 'workout' },
  { to: '/history', icon: History, labelKey: 'history' },
  { to: '/calendar', icon: CalendarDays, labelKey: 'calendar' },
  { to: '/stats', icon: TrendingUp, labelKey: 'stats' },
  { to: '/presets', icon: ListChecks, labelKey: 'presets' },
  { to: '/settings', icon: Settings, labelKey: 'settings' },
]

export default function Layout() {
  const { t } = useApp()

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-20 px-4 pt-6 max-w-lg mx-auto w-full">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-xl border-t border-white/5">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          {navItems.map(({ to, icon: Icon, labelKey }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 transition-colors ${
                  isActive ? 'text-accent-from' : 'text-text-muted hover:text-text-secondary'
                }`
              }
            >
              <Icon size={20} strokeWidth={1.5} />
              <span className="text-[10px] font-medium">{t(labelKey)}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
