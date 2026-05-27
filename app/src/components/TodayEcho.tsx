import { useState } from 'react'
import { X } from 'lucide-react'
import {
  habitLogsStore,
  listHabits,
  tasksStore,
  todayKey,
  type HabitLog,
  type Task,
} from '../lib/entries'

const SHOWN_KEY = 'adventure:echoShownOn'

type EchoItem =
  | { kind: 'task'; text: string; date: Date }
  | { kind: 'habit'; text: string; date: Date }

function parseLogDate(dateStr: string): Date {
  // dateStr is YYYY-MM-DD from todayKey — parse as local date, not UTC
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function daysBetween(past: Date, now: Date): number {
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const ms = startOfDay(now) - startOfDay(past)
  return Math.floor(ms / 86_400_000)
}

function buildPool(now: Date): EchoItem[] {
  const pool: EchoItem[] = []

  for (const t of tasksStore.getAll() as Task[]) {
    if (t.status !== 'done' || !t.completedAt) continue
    if (!t.text) continue
    const date = new Date(t.completedAt)
    if (Number.isNaN(date.getTime())) continue
    if (daysBetween(date, now) < 1) continue
    pool.push({ kind: 'task', text: t.text, date })
  }

  const habitNameById = new Map(listHabits().map((h) => [h.id, h.name]))
  for (const log of habitLogsStore.getAll() as HabitLog[]) {
    if (log.count <= 0) continue
    const name = habitNameById.get(log.habitId)
    if (!name) continue
    const date = parseLogDate(log.date)
    if (Number.isNaN(date.getTime())) continue
    if (daysBetween(date, now) < 1) continue
    pool.push({ kind: 'habit', text: name, date })
  }

  return pool
}

function dateSeed(key: string): number {
  let h = 0
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function pickEcho(pool: EchoItem[], now: Date): EchoItem | null {
  if (pool.length === 0) return null
  // Prefer items ≥ 7 days old; fall back to whole pool if none qualify.
  const aged = pool.filter((item) => daysBetween(item.date, now) >= 7)
  const candidates = aged.length > 0 ? aged : pool
  const seed = dateSeed(todayKey(now))
  return candidates[seed % candidates.length]
}

function formatElapsed(past: Date, now: Date): string {
  const days = daysBetween(past, now)
  if (days < 30) return `${days} 天前的今天`
  if (days < 365) {
    const months = Math.floor(days / 30)
    return `${months} 个月前的今天`
  }
  const years = Math.floor(days / 365)
  return `${years} 年前的今天`
}

function formatSignature(d: Date): string {
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`
}

function actionLabel(kind: EchoItem['kind']): string {
  return kind === 'task' ? '你完成了' : '你坚持了'
}

function initialEcho(): EchoItem | null {
  const now = new Date()
  const today = todayKey(now)
  try {
    if (localStorage.getItem(SHOWN_KEY) === today) return null
  } catch {
    // localStorage unavailable — just proceed; we'll try to write below.
  }
  const picked = pickEcho(buildPool(now), now)
  if (!picked) return null
  try {
    localStorage.setItem(SHOWN_KEY, today)
  } catch {
    // worst case: card may reappear next open. acceptable.
  }
  return picked
}

export default function TodayEcho() {
  const [echo, setEcho] = useState<EchoItem | null>(initialEcho)

  if (!echo) return null

  const now = new Date()

  return (
    <section className="mt-8 w-full">
      <div className="bg-warm-sand rounded-card relative px-5 py-5 shadow-[0_4px_20px_rgba(0,110,43,0.06)]">
        <button
          type="button"
          aria-label="收起回声"
          onClick={() => setEcho(null)}
          className="text-on-surface-variant hover:text-on-surface absolute top-2 right-2 p-1 opacity-50 transition-opacity hover:opacity-90"
        >
          <X size={16} strokeWidth={1.5} />
        </button>

        <p className="font-quote text-on-surface-variant text-xs">
          {formatElapsed(echo.date, now)}
        </p>

        <p className="font-display text-on-surface mt-2 text-lg leading-snug font-medium">
          {actionLabel(echo.kind)}「{echo.text}」
        </p>

        <p className="font-quote text-outline mt-3 text-right text-xs">
          {formatSignature(echo.date)}
        </p>
      </div>
    </section>
  )
}
