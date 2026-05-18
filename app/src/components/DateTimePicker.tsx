import { useEffect, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { CalendarClock, X } from 'lucide-react'
import Wheel from './Wheel'
import 'react-day-picker/style.css'

type Props = {
  value: string
  onChange: (next: string) => void
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function parseValue(raw: string): {
  date: Date | null
  hour: number
  minute: number
} {
  if (!raw) return { date: null, hour: 9, minute: 0 }
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return { date: null, hour: 9, minute: 0 }
  return { date: d, hour: d.getHours(), minute: d.getMinutes() }
}

function toLocalValue(date: Date, hour: number, minute: number): string {
  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  const d = pad(date.getDate())
  return `${y}-${m}-${d}T${pad(hour)}:${pad(minute)}`
}

function displayLabel(raw: string): string {
  if (!raw) return ''
  const { date, hour, minute } = parseValue(raw)
  if (!date) return ''
  return `${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(hour)}:${pad(minute)}`
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = [0, 15, 30, 45]

export default function DateTimePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { date, hour, minute } = parseValue(value)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const effectiveDate = date ?? today

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  const updateDate = (next: Date | undefined) => {
    if (!next) return
    onChange(toLocalValue(next, hour, minute))
  }

  const updateHour = (h: number) =>
    onChange(toLocalValue(effectiveDate, h, minute))
  const updateMinute = (m: number) =>
    onChange(toLocalValue(effectiveDate, hour, m))

  const clear = () => {
    onChange('')
    setOpen(false)
  }

  const summary = value
    ? format(effectiveDate, 'M月d日 EEEE', { locale: zhCN }) +
      ` · ${pad(hour)}:${pad(minute)}`
    : '点击下方选择日期与时间'

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="bg-surface text-on-surface inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm"
      >
        <CalendarClock className="text-on-surface-variant h-4 w-4" />
        {value ? (
          <span>{displayLabel(value)}</span>
        ) : (
          <span className="text-outline">选个时间</span>
        )}
        {value && (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation()
              clear()
            }}
            className="text-outline hover:text-on-surface ml-1 cursor-pointer"
            aria-label="清除时间"
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
            mode="single"
            selected={date ?? undefined}
            onSelect={updateDate}
            disabled={{ before: today }}
            locale={zhCN}
            showOutsideDays={false}
            formatters={{
              formatCaption: (d) => `${d.getMonth() + 1} 月`,
            }}
            classNames={{ root: 'rdp-ethereal' }}
          />

          <div className="border-outline/15 mt-2 flex items-center justify-center gap-2 border-t pt-3">
            <span className="text-on-surface-variant text-xs">时间</span>
            <Wheel options={HOURS} value={hour} onChange={updateHour} />
            <span className="text-on-surface-variant font-display text-lg font-bold">
              :
            </span>
            <Wheel options={MINUTES} value={minute} onChange={updateMinute} />
          </div>
        </div>
      )}
    </div>
  )
}
