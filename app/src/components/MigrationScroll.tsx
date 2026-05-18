import { useEffect, useState } from 'react'
import { Scroll } from 'lucide-react'
import {
  archiveTask,
  getStaleTasks,
  migrateTaskToToday,
  readLastCheck,
  writeLastCheck,
} from '../lib/migration'
import { todayKey, type Task } from '../lib/entries'

function describeDate(forDate: string): string {
  const today = todayKey()
  const d = new Date(`${forDate}T00:00:00`)
  const todayDate = new Date(`${today}T00:00:00`)
  const days = Math.round(
    (todayDate.getTime() - d.getTime()) / 86400000,
  )
  if (days === 1) return '昨天'
  if (days === 2) return '前天'
  return `${days} 天前`
}

export default function MigrationScroll() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [keep, setKeep] = useState<Set<string>>(new Set())
  const [show, setShow] = useState(false)

  useEffect(() => {
    const today = todayKey()
    if (readLastCheck() === today) return
    const stale = getStaleTasks()
    if (stale.length === 0) {
      writeLastCheck()
      return
    }
    setTasks(stale)
    setKeep(new Set(stale.map((t) => t.id)))
    setShow(true)
  }, [])

  if (!show) return null

  const toggle = (id: string) => {
    setKeep((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleConfirm = () => {
    tasks.forEach((t) => {
      if (keep.has(t.id)) migrateTaskToToday(t.id)
      else archiveTask(t.id)
    })
    writeLastCheck()
    setShow(false)
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-6">
      <div className="bg-surface rounded-card flex max-h-[80vh] w-full max-w-sm flex-col p-6 shadow-[0_24px_60px_rgba(0,110,43,0.18)]">
        <div className="flex items-center gap-2">
          <Scroll className="text-primary h-5 w-5" />
          <h2 className="font-display text-on-surface text-lg font-bold">
            昨天的小事
          </h2>
        </div>
        <p className="font-quote text-on-surface-variant mt-2 text-sm">
          这些事还想继续吗？勾选要带到今天的；其余的它们就在剪影里小憩。
        </p>

        <ul className="mt-5 flex flex-1 flex-col gap-2 overflow-y-auto">
          {tasks.map((t) => {
            const checked = keep.has(t.id)
            return (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => toggle(t.id)}
                  className={`w-full rounded-2xl px-4 py-3 text-left transition-colors ${
                    checked
                      ? 'bg-primary-container/40'
                      : 'bg-surface-container opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        checked
                          ? 'border-primary bg-primary text-on-primary'
                          : 'border-outline/40'
                      }`}
                    >
                      {checked && (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={3}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </span>
                    <div className="flex-1">
                      <p className="font-body text-on-surface text-sm">
                        {t.text}
                      </p>
                      <p className="text-on-surface-variant mt-0.5 text-xs">
                        {describeDate(t.forDate)}
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>

        <button
          type="button"
          onClick={handleConfirm}
          className="font-display bg-primary text-on-primary mt-5 rounded-full px-6 py-3 text-base font-semibold"
        >
          带到今天
        </button>
      </div>
    </div>
  )
}
