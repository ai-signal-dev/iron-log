import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react'
import { useApp } from '../context/AppContext'

interface TimerProps {
  onComplete?: () => void
}

export default function Timer({ onComplete }: TimerProps) {
  const { t } = useApp()
  const [minutes, setMinutes] = useState(() => {
    const saved = localStorage.getItem('timer-minutes')
    return saved ? parseInt(saved) : 1
  })
  const [seconds, setSeconds] = useState(() => {
    const saved = localStorage.getItem('timer-seconds')
    return saved ? parseInt(saved) : 30
  })
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<number | null>(null)

  const totalSeconds = minutes * 60 + seconds

  useEffect(() => {
    localStorage.setItem('timer-minutes', String(minutes))
    localStorage.setItem('timer-seconds', String(seconds))
  }, [minutes, seconds])

  const start = useCallback(() => {
    setTimeLeft(totalSeconds)
    setIsRunning(true)
  }, [totalSeconds])

  const pause = () => setIsRunning(false)
  const resume = () => setIsRunning(true)

  const reset = () => {
    setIsRunning(false)
    setTimeLeft(null)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  useEffect(() => {
    if (isRunning && timeLeft !== null && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 1) {
            setIsRunning(false)
            if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200])
            onComplete?.()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, timeLeft, onComplete])

  const displayMinutes = timeLeft !== null ? Math.floor(timeLeft / 60) : minutes
  const displaySeconds = timeLeft !== null ? timeLeft % 60 : seconds
  const progress = timeLeft !== null ? (1 - timeLeft / totalSeconds) * 100 : 0

  const adjustMinutes = (delta: number) => {
    if (timeLeft !== null) return
    setMinutes(prev => Math.max(0, Math.min(59, prev + delta)))
  }

  const adjustSeconds = (delta: number) => {
    if (timeLeft !== null) return
    setSeconds(prev => {
      const next = prev + delta
      if (next >= 60) { setMinutes(m => Math.min(59, m + 1)); return next - 60 }
      if (next < 0) {
        if (minutes > 0) { setMinutes(m => m - 1); return 60 + next }
        return 0
      }
      return next
    })
  }

  return (
    <div className="card p-6 glow">
      <div className="relative mb-4">
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-accent transition-all duration-1000 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => adjustMinutes(1)}
            disabled={timeLeft !== null}
            className="p-1 text-text-muted hover:text-text-primary disabled:opacity-30"
          >
            <Plus size={16} />
          </button>
          <span className="text-4xl font-light tabular-nums w-16 text-center">
            {String(displayMinutes).padStart(2, '0')}
          </span>
          <button
            onClick={() => adjustMinutes(-1)}
            disabled={timeLeft !== null}
            className="p-1 text-text-muted hover:text-text-primary disabled:opacity-30"
          >
            <Minus size={16} />
          </button>
        </div>

        <span className="text-4xl font-light text-text-muted">:</span>

        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => adjustSeconds(5)}
            disabled={timeLeft !== null}
            className="p-1 text-text-muted hover:text-text-primary disabled:opacity-30"
          >
            <Plus size={16} />
          </button>
          <span className="text-4xl font-light tabular-nums w-16 text-center">
            {String(displaySeconds).padStart(2, '0')}
          </span>
          <button
            onClick={() => adjustSeconds(-5)}
            disabled={timeLeft !== null}
            className="p-1 text-text-muted hover:text-text-primary disabled:opacity-30"
          >
            <Minus size={16} />
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        {timeLeft === null ? (
          <button onClick={start} className="btn-primary flex items-center gap-2">
            <Play size={16} /> {t('start')}
          </button>
        ) : (
          <>
            <button
              onClick={isRunning ? pause : resume}
              className="btn-primary flex items-center gap-2"
            >
              {isRunning ? <Pause size={16} /> : <Play size={16} />}
              {isRunning ? t('pause') : t('resume')}
            </button>
            <button onClick={reset} className="btn-secondary flex items-center gap-2">
              <RotateCcw size={16} /> {t('reset')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
