import { useEffect, useRef, useState } from 'react'
import { DayPicker, type DateRange as RDPDateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { CalendarRange, X } from 'lucide-react'
import type { DateRange } from '../lib/entries'
import 'react-day-picker/style.css'

type Props = {
  value: DateRange | null
  onChange: (next: DateRange | null) => void
}

function toKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function fromKey(k: string): Date {
  return new Date(`${k}T00:00:00`)
}

function shortLabel(k: string): string {
  const d = fromKey(k)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export default function DateRangePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  const selected: RDPDateRange | undefined = value
    ? { from: fromKey(value.from), to: value.to ? fromKey(value.to) : undefined }
    : undefined

  const handleSelect = (next: RDPDateRange | undefined) => {
    if (!next?.from) {
      onChange(null)
      return
    }
    onChange({
      from: toKey(next.from),
      to: toKey(next.to ?? next.from),
    })
  }

  const clear = () => {
    onChange(null)
    setOpen(false)
  }

  const summary = value
    ? (() => {
        const from = fromKey(value.from)
        const to = fromKey(value.to)
        const sameDay = value.from === value.to
        if (sameDay) {
          return format(from, 'M月d日 EEEE', { locale: zhCN }) + ' · 单日'
        }
        const days =
          Math.round((to.getTime() - from.getTime()) / 86400000) + 1
        return (
          format(from, 'M月d日', { locale: zhCN }) +
          ' → ' +
          format(to, 'M月d日', { locale: zhCN }) +
          ` · 共 ${days} 天`
        )
      })()
    : '点击日历选择起 → 止两个日期'

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="bg-surface text-on-surface inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm"
      >
        <CalendarRange className="text-on-surface-variant h-4 w-4" />
        {value ? (
          <span>
            {shortLabel(value.from)}
            {value.from !== value.to && ` → ${shortLabel(value.to)}`}
          </span>
        ) : (
          <span className="text-outline">选个跨度</span>
        )}
        {value && (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation()
              clear()
            }}
            className="text-outline hover:text-on-surface ml-1 cursor-pointer"
            aria-label="清除跨度"
          >
            <X className="h-3.5 w-3.5" />
          </span>
        )}
      </button>

      {open && (
        <div className="border-outline/20 bg-surface absolute bottom-full left-1/2 z-20 mb-2 w-[19rem] -translate-x-1/2 rounded-2xl border p-3 shadow-[0_12px_32px_rgba(0,110,43,0.12)]">
          <div
            className={`font-display text-center text-sm font-semibold ${
              value ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            {summary}
          </div>

          <DayPicker
            mode="range"
            selected={selected}
            onSelect={handleSelect}
            disabled={{ before: today }}
            locale={zhCN}
            showOutsideDays={false}
            formatters={{
              formatCaption: (d) => `${d.getMonth() + 1} 月`,
            }}
            classNames={{ root: 'rdp-ethereal' }}
          />
        </div>
      )}
    </div>
  )
}
