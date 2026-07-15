import { useState, useRef } from 'react'
import { Mic, MicOff } from 'lucide-react'

interface VoiceInputProps {
  onResult: (transcript: string) => void
}

export default function VoiceInput({ onResult }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const toggle = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'ja-JP'
    recognition.continuous = true
    recognition.interimResults = false

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(r => r[0].transcript)
        .join(' ')
      onResult(transcript)
    }

    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognition.start()
    recognitionRef.current = recognition
    setIsListening(true)
  }

  return (
    <button
      onClick={toggle}
      className={`p-3 rounded-full transition-all duration-200 ${
        isListening
          ? 'bg-gradient-accent text-white animate-pulse glow'
          : 'bg-surface-hover text-text-secondary hover:text-text-primary'
      }`}
      aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
    >
      {isListening ? <Mic size={20} /> : <MicOff size={20} />}
    </button>
  )
}
