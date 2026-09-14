import { useEffect, useRef } from 'react'

// Track working time without counting feedback, summaries, or inactive views.
export default function useLevelTime(active) {
  const accumulated = useRef(0)
  const startedAt = useRef(null)

  useEffect(() => {
    if (!active) return
    startedAt.current = Date.now()
    return () => {
      if (startedAt.current !== null) accumulated.current += Date.now() - startedAt.current
      startedAt.current = null
    }
  }, [active])

  function elapsedSeconds() {
    const running = startedAt.current === null ? 0 : Date.now() - startedAt.current
    return Math.max(0, Math.round((accumulated.current + running) / 1000))
  }

  function resetTime() {
    accumulated.current = 0
    if (startedAt.current !== null) startedAt.current = Date.now()
  }

  return { elapsedSeconds, resetTime }
}
