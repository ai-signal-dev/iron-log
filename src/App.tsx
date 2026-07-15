import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { seedExercises } from './db/seed'
import Layout from './components/Layout'
import WorkoutPage from './pages/WorkoutPage'
import HistoryPage from './pages/HistoryPage'
import CalendarPage from './pages/CalendarPage'
import StatsPage from './pages/StatsPage'
import PresetsPage from './pages/PresetsPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  useEffect(() => {
    seedExercises()
  }, [])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/workout" replace />} />
        <Route path="/workout" element={<WorkoutPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/presets" element={<PresetsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}
