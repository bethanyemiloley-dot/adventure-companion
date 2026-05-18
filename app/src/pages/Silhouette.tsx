import { useMemo } from 'react'
import {
  HABITS,
  habitLogsStore,
  notesStore,
  tasksStore,
  todayKey,
  type HabitDef,
  type HabitLog,
  type Note,
  type Task,
} from '../lib/entries'
import { listHabits } from '../lib/entries'
import { useStore } from '../lib/store'
import { slotForHour, type TimeSlot } from '../lib/foxState'

type Moment =
  | { id: string; kind: 'note'; note: Note; at: string }
  | { id: string; kind: 'task'; task: Task; at: string }
  | { id: string; kind: 'habit'; log: HabitLog; habit: HabitDef; at: string }

const SLOT_LABEL: Record<TimeSlot, string> = {
  morning: '清晨',
  forenoon: '上午',
  noon: '日中',
  afternoon: '午后',
  evening: '黄昏',
  night: '夜里',
}

const SLOT_ORDER: TimeSlot[] = [
  'morning',
  'forenoon',
  'noon',
  'afternoon',
  'evening',
  'night',
]

const CARD_BG = [
  'bg-warm-sand',
  'bg-gentle-blush',
  'bg-serene-sky',
  'bg-primary-container/30',
]

const OPENING_LINES = [
  '今天的影子，被光这样拓下来。',
  '回头看，这些都被记得。',
  '一些被光收下的瞬间，留在了这里。',
  '今天悄悄收集了几个发光的小片段。',
  '把今天叠起来，留给你慢慢翻。',
]

function pickOpening(seed: number): string {
  return OPENING_LINES[seed % OPENING_LINES.length]
}

function formatHM(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function Silhouette() {
  const tasks = useStore(tasksStore)
  const notes = useStore(notesStore)
  const logs = useStore(habitLogsStore)
  const today = todayKey()
  void HABITS

  const { groups, total, mindTasks } = useMemo(() => {
    const out: Moment[] = []
    const habits = listHabits()

    tasks.forEach((t) => {
      if (t.status === 'done' && t.completedAt?.slice(0, 10) === today) {
        out.push({ id: `t-${t.id}`, kind: 'task', task: t, at: t.completedAt })
      }
    })

    notes.forEach((n) => {
      if (n.createdAt.slice(0, 10) === today) {
        out.push({ id: `n-${n.id}`, kind: 'note', note: n, at: n.createdAt })
      }
    })

    logs.forEach((l) => {
      if (l.date !== today || l.count <= 0) return
      const habit = habits.find((h) => h.id === l.habitId)
      if (!habit) return
      out.push({
        id: `h-${l.id}`,
        kind: 'habit',
        log: l,
        habit,
        at: l.updatedAt,
      })
    })

    out.sort((a, b) => a.at.localeCompare(b.at))

    const grouped: Partial<Record<TimeSlot, Moment[]>> = {}
    out.forEach((m) => {
      const slot = slotForHour(new Date(m.at).getHours())
      if (!grouped[slot]) grouped[slot] = []
      grouped[slot]!.push(m)
    })

    const mind = tasks.filter(
      (t) => t.isMainline && t.status === 'pending' && t.forDate <= today,
    )

    return { groups: grouped, total: out.length, mindTasks: mind }
  }, [tasks, notes, logs, today])

  let cardIdx = 0

  return (
    <div className="flex flex-1 flex-col px-6 pt-8 pb-12">
      <h1 className="font-display text-primary text-2xl font-bold">
        今日剪影
      </h1>
      <p className="font-quote text-on-surface-variant mt-2 text-sm leading-relaxed">
        {total > 0
          ? pickOpening(total)
          : '今天还很轻，等你为它写下第一笔。'}
      </p>

      {total === 0 ? null : (
        <div className="mt-8 flex flex-col gap-7">
          {SLOT_ORDER.map((slot) => {
            const items = groups[slot]
            if (!items || items.length === 0) return null
            return (
              <section key={slot}>
                <div className="flex items-baseline gap-3">
                  <h2 className="font-display text-earth-moss text-base font-semibold">
                    {SLOT_LABEL[slot]}
                  </h2>
                  <span className="bg-outline/20 h-px flex-1" />
                  <span className="text-on-surface-variant text-xs">
                    {items.length} 笔
                  </span>
                </div>

                <ul className="mt-3 flex flex-col gap-3">
                  {items.map((m) => {
                    const bg = CARD_BG[cardIdx++ % CARD_BG.length]
                    return (
                      <li
                        key={m.id}
                        className={`rounded-card ${bg} relative px-4 py-3`}
                      >
                        <p className="font-body text-on-surface text-sm leading-relaxed">
                          {m.kind === 'note' && m.note.text}
                          {m.kind === 'task' && (
                            <>
                              {m.task.text}
                              {m.task.isMainline && (
                                <span className="text-earth-moss ml-2 text-xs">
                                  · 主线
                                </span>
                              )}
                            </>
                          )}
                          {m.kind === 'habit' && (
                            <>
                              {m.habit.name}
                              {m.habit.kind === 'counter' && (
                                <span className="text-on-surface-variant ml-2 text-xs">
                                  · {m.log.count}
                                  {m.habit.dailyTarget
                                    ? `/${m.habit.dailyTarget}`
                                    : ''}
                                  {m.habit.unit ?? ''}
                                </span>
                              )}
                            </>
                          )}
                        </p>
                        <div className="text-on-surface-variant/70 mt-1 flex items-center gap-2 text-[10px]">
                          <span>{formatHM(m.at)}</span>
                          <span>·</span>
                          <span>
                            {m.kind === 'note' && '心声'}
                            {m.kind === 'task' && '完成'}
                            {m.kind === 'habit' && '打卡'}
                          </span>
                          {m.kind === 'note' && m.note.mood && (
                            <>
                              <span>·</span>
                              <span>{m.note.mood}</span>
                            </>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )
          })}
        </div>
      )}

      {mindTasks.length > 0 && (
        <section className="border-outline/30 rounded-card mt-10 border border-dashed p-5">
          <h2 className="font-display text-on-surface flex items-center gap-2 text-sm font-semibold">
            <span>在脑海里</span>
            <span className="bg-outline/20 h-px flex-1" />
          </h2>
          <p className="text-on-surface-variant mt-1 text-xs">
            还想做、但今天没动笔的事。
          </p>
          <ul className="mt-3 space-y-1.5">
            {mindTasks.map((t) => (
              <li
                key={t.id}
                className="font-body text-on-surface-variant text-sm"
              >
                · {t.text}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
