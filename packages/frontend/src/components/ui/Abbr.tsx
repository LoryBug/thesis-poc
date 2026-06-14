import { useState, useEffect, useRef, useCallback } from 'react'

interface AbbrProps {
  term: string
  definition: string
}

export function Abbr({ term, definition }: AbbrProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, close])

  return (
    <span ref={ref} className="cm-abbr" onClick={() => setOpen((v) => !v)} title={definition}>
      {term}
      {open && <span className="cm-abbr-tooltip" role="tooltip">{definition}</span>}
    </span>
  )
}
