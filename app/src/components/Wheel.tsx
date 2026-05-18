import { useEffect, useRef } from 'react'

type Props = {
  options: number[]
  value: number
  onChange: (next: number) => void
  width?: string
}

const ITEM_H = 30
const VISIBLE = 5
const HEIGHT = ITEM_H * VISIBLE
const CENTER_OFFSET = ITEM_H * Math.floor(VISIBLE / 2)

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function Wheel({ options, value, onChange, width = 'w-12' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const lockRef = useRef(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!ref.current) return
    const idx = options.indexOf(value)
    if (idx < 0) return
    lockRef.current = true
    ref.current.scrollTop = idx * ITEM_H
    requestAnimationFrame(() => {
      lockRef.current = false
    })
  }, [value, options])

  const handleScroll = () => {
    if (lockRef.current) return
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      if (!ref.current) return
      const raw = Math.round(ref.current.scrollTop / ITEM_H)
      const idx = Math.max(0, Math.min(options.length - 1, raw))
      const next = options[idx]
      if (next !== value) onChange(next)
    }, 120)
  }

  return (
    <div
      className={`relative ${width} overflow-hidden`}
      style={{ height: HEIGHT }}
    >
      <div className="from-surface pointer-events-none absolute inset-x-0 top-0 z-10 h-[30px] bg-gradient-to-b to-transparent" />
      <div className="from-surface pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[30px] bg-gradient-to-t to-transparent" />
      <div
        className="border-primary/20 bg-primary/5 pointer-events-none absolute inset-x-1 top-1/2 z-0 -translate-y-1/2 rounded-md border"
        style={{ height: ITEM_H }}
      />
      <div
        ref={ref}
        onScroll={handleScroll}
        className="scrollbar-hide h-full overflow-y-scroll"
        style={{
          scrollSnapType: 'y mandatory',
          paddingTop: CENTER_OFFSET,
          paddingBottom: CENTER_OFFSET,
        }}
      >
        {options.map((opt) => {
          const active = opt === value
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`block w-full text-center transition-all ${
                active
                  ? 'text-primary text-base font-bold'
                  : 'text-on-surface-variant text-sm opacity-50'
              }`}
              style={{ height: ITEM_H, scrollSnapAlign: 'center' }}
            >
              {pad(opt)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
