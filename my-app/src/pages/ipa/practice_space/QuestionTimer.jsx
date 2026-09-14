import { useEffect, useEffectEvent, useState } from 'react'

export default function QuestionTimer({ questionId, paused, onExpire, duration = 30 }) {
  const [remainingByQuestion, setRemainingByQuestion] = useState({})
  const remaining = remainingByQuestion[questionId] ?? duration
  const readRemaining = useEffectEvent(() => remaining)
  const expire = useEffectEvent(() => onExpire())

  useEffect(() => {
    if (paused) return
    const seconds = readRemaining()
    if (seconds <= 0) return
    const deadline = Date.now() + seconds * 1000
    const interval = setInterval(() => {
      const next = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      setRemainingByQuestion((current) => ({ ...current, [questionId]: next }))
      if (next === 0) {
        clearInterval(interval)
        expire()
      }
    }, 250)
    return () => clearInterval(interval)
  }, [questionId, paused, duration])

  return (
    <span className={`question-timer${remaining <= 10 ? ' question-timer-urgent' : ''}`} role="timer" aria-label="Time remaining" aria-live="off">
      <svg className="question-timer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
      <span>{remaining === 0 ? 'Time’s up' : `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`}</span>
    </span>
  )
}
