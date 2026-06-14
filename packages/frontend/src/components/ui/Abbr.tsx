import { useState, useEffect, useRef } from 'react'

interface AbbrProps {
  term: string
  definition: string
}

export function Abbr({ term, definition }: AbbrProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <span ref={ref} className="cm-abbr" onClick={() => setOpen((v) => !v)} title={definition}>
      {term}
      {open && <span className="cm-abbr-tooltip" role="tooltip">{definition}</span>}
    </span>
  )
}
