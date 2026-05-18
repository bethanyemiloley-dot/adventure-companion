import { useMemo, useState } from 'react'
import {
  HABITS,
  habitLogsStore,
  notesStore,
  tasksStore,
  todayKey,
  type HabitLog,
  type Note,
  type Task,
} from '../lib/entries'
import { useStore } from '../lib/store'

type Moment =
  | { id: string; kind: 'note'; note: Note; at: string }
  | { id: string; kind: 'task'; task: Task; at: string }
  | { id: string; kind: 'habit'; log: HabitLog; habitName: string; at: string }

const CARD_BG = [
  'bg-warm-sand',
  'bg-gentle-blush',
  'bg-serene-sky',
  'bg-primary-container/40',
]

function daysAgoKey(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return todayKey(d)
}

function dateInRange(iso: string, fromKey: string, toKey: string): boolean {
  const k = iso.slice(0, 10)
  return k >= fromKey && k <= toKey
}

type Range = 'today' | 'week'

export default function Review() {
  const tasks = useStore(tasksStore)
  const notes = useStore(notesStore)
  const logs = useStore(habitLogsStore)
  const [range, setRange] = useState<Range>('today')

  const { moments, label } = useMemo(() => {
    const today = todayKey()
    const from = range === 'today' ? today : daysAgoKey(6)
    const to = today

    const out: Moment[] = []

    notes.forEach((n) => {
      if (dateInRange(n.createdAt, from, to)) {
        out.push({ id: `n-${n.id}`, kind: 'note', note: n, at: n.createdAt })
      }
    })

    tasks.forEach((t) => {
      if (
        t.status === 'done' &&
        t.completedAt &&
        dateInRange(t.completedAt, from, to)
      ) {
        out.push({ id: `t-${t.id}`, kind: 'task', task: t, at: t.completedAt })
      }
    })

    logs.forEach((l) => {
      if (l.count <= 0) return
      if (l.date >= from && l.date <= to) {
        const habit = HABITS.find((h) => h.id === l.habitId)
        if (!habit) return
        out.push({
          id: `h-${l.id}`,
          kind: 'habit',
          log: l,
          habitName: habit.name,
          at: l.updatedAt,
        })
      }
    })

    out.sort((a, b) => b.at.localeCompare(a.at))

    return {
      moments: out,
      label: range === 'today' ? '今天' : '本周',
    }
  }, [tasks, notes, logs, range])

  return (
    <div className="flex flex-1 flex-col px-6 pt-8 pb-12">
      <h1 className="font-display text-primary text-2xl font-bold">
        温柔回响
      </h1>
      <p className="font-quote text-on-surface-variant mt-2 text-sm">
        {label}你有{' '}
        <span className="text-primary font-display font-bold">
          {moments.length}
        </span>{' '}
        个发光时刻
      </p>

      <div className="bg-surface-container mt-5 inline-flex w-fit gap-1 rounded-full p-1">
        {(['today', 'week'] as Range[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRange(r)}
            className={`font-body rounded-full px-3 py-1 text-xs transition-colors ${
              range === r
                ? 'bg-surface text-on-surface shadow-sm'
                : 'text-on-surface-variant'
            }`}
          >
            {r === 'today' ? '今天' : '本周'}
          </button>
        ))}
      </div>

      {moments.length === 0 ? (
        <p className="text-on-surface-variant font-body mt-12 text-center text-sm">
          这段时间还很安静，等着你写下第一笔。
        </p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-3">
          {moments.map((m, i) => (
            <li
              key={m.id}
              className={`rounded-card ${CARD_BG[i % CARD_BG.length]} flex min-h-[5rem] flex-col gap-1 p-4`}
            >
              <span className="text-on-surface-variant font-body text-[10px] tracking-wide">
                {m.kind === 'note' && '笔记'}
                {m.kind === 'task' && '已完成'}
                {m.kind === 'habit' && '习惯'}
              </span>
              <p className="font-display text-on-surface text-sm leading-snug font-semibold">
                {m.kind === 'note' && m.note.text}
                {m.kind === 'task' && m.task.text}
                {m.kind === 'habit' && (
                  <>
                    {m.habitName}
                    {m.log.count > 1 && (
                      <span className="text-on-surface-variant ml-1 text-xs font-normal">
                        ×{m.log.count}
                      </span>
                    )}
                  </>
                )}
              </p>
              {m.kind === 'note' && m.note.mood && (
                <span className="text-on-surface-variant mt-auto text-[10px]">
                  · {m.note.mood}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
