import { useState } from 'react'
import { ArrowRight, Check, Sprout } from 'lucide-react'
import {
  completeTask,
  pushTaskToTomorrow,
  tasksStore,
  visibleTodayTasks,
  type Task,
} from '../lib/entries'
import { useStore } from '../lib/store'

const EXIT_MS = 900

function formatTime(iso: string): string {
  const d = new Date(iso)
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

type Props = {
  task: Task
  isExiting: boolean
  onComplete: (task: Task) => void
  onMigrate: (task: Task) => void
}

function TaskRow({ task, isExiting, onComplete, onMigrate }: Props) {
  const done = task.status === 'done' || isExiting
  return (
    <li
      className={`flex items-start gap-3 py-2 ${
        isExiting ? 'animate-zoom-out-down' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => onComplete(task)}
        aria-label="完成"
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          done
            ? 'border-primary bg-primary text-on-primary'
            : 'border-outline/40 hover:border-primary'
        }`}
      >
        {done && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </button>
      <div className="flex-1">
        <p
          className={`font-body text-on-surface text-base ${
            done ? 'line-through opacity-50' : ''
          }`}
        >
          {task.text}
        </p>
        <div className="text-on-surface-variant mt-1 flex flex-wrap items-center gap-2 text-xs">
          {task.isMainline && (
            <span className="bg-primary-container/40 text-earth-moss inline-flex items-center gap-1 rounded-full px-2 py-0.5">
              <Sprout className="h-3 w-3" strokeWidth={2} />
              主线
            </span>
          )}
          {task.dateRange && (
            <span>
              {task.dateRange.from.slice(5).replace('-', '/')}
              {task.dateRange.from !== task.dateRange.to &&
                ` → ${task.dateRange.to.slice(5).replace('-', '/')}`}
            </span>
          )}
          {task.scheduledAt && <span>{formatTime(task.scheduledAt)}</span>}
        </div>
      </div>
      {!task.isMainline && !done && (
        <button
          type="button"
          onClick={() => onMigrate(task)}
          className="text-on-surface-variant hover:text-primary mt-0.5 inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-xs transition-colors"
          aria-label="推到明天"
        >
          明天
          <ArrowRight className="h-3 w-3" />
        </button>
      )}
    </li>
  )
}

const ALL_DONE_PRAISES = [
  '今天的事都做完啦 · 给自己倒杯茶吧 🌿',
  '都完成了 · 剩下的时间都属于你。',
  '今天的清单空了 · 你比想象中更稳。',
  '一一交付 · 这一刻可以心安理得地放空。',
]

function pickPraise(seed: number): string {
  return ALL_DONE_PRAISES[seed % ALL_DONE_PRAISES.length]
}

export default function TaskList() {
  const all = useStore(tasksStore)
  const pending = visibleTodayTasks(all)
  const [exiting, setExiting] = useState<Task[]>([])

  const visible = [
    ...pending,
    ...exiting.filter((e) => !pending.some((p) => p.id === e.id)),
  ]

  const handleComplete = (task: Task) => {
    if (task.status !== 'pending') return
    setExiting((prev) => [...prev, { ...task, status: 'done' }])
    completeTask(task.id)
    setTimeout(() => {
      setExiting((prev) => prev.filter((e) => e.id !== task.id))
    }, EXIT_MS)
  }

  const handleMigrate = (task: Task) => {
    pushTaskToTomorrow(task.id)
  }

  if (visible.length === 0) {
    const todayKey = new Date().toISOString().slice(0, 10)
    const completedToday = all.filter(
      (t) => t.status === 'done' && t.completedAt?.slice(0, 10) === todayKey,
    )
    if (completedToday.length > 0) {
      return (
        <p className="font-quote text-primary text-center text-sm leading-relaxed">
          {pickPraise(completedToday.length)}
        </p>
      )
    }
    return (
      <p className="text-on-surface-variant font-body text-center text-sm">
        今天还没有任务，去
        <span className="text-primary font-semibold">记录</span>
        页写一个吧。
      </p>
    )
  }

  return (
    <ul className="divide-outline/15 divide-y">
      {visible.map((t) => (
        <TaskRow
          key={t.id}
          task={t}
          isExiting={exiting.some((e) => e.id === t.id)}
          onComplete={handleComplete}
          onMigrate={handleMigrate}
        />
      ))}
    </ul>
  )
}
