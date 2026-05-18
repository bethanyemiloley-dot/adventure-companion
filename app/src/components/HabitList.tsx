import { useState } from 'react'
import { Check, ChevronDown, ChevronUp, Plus } from 'lucide-react'
import {
  getTodayLog,
  habitLogsStore,
  isHabitDone,
  listHabits,
  logHabit,
  nextHabitCount,
  userHabitsStore,
  type HabitDef,
} from '../lib/entries'
import { useStore } from '../lib/store'

const EXIT_MS = 900
const COLLAPSED_COUNT = 3

type RowProps = {
  habit: HabitDef
  count: number
  isExiting: boolean
  onTap: (habit: HabitDef) => void
}

function HabitRow({ habit, count, isExiting, onTap }: RowProps) {
  const target = habit.dailyTarget
  const reached = target ? count >= target : count >= 1
  const done = habit.kind === 'check' ? count >= 1 : reached

  return (
    <li className={isExiting ? 'animate-zoom-out-down' : ''}>
      <button
        type="button"
        onClick={() => onTap(habit)}
        className="bg-warm-sand hover:bg-surface-container flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors"
      >
        <div className="flex-1">
          <p
            className={`font-body text-on-surface text-sm ${
              done ? 'line-through opacity-60' : ''
            }`}
          >
            {habit.name}
          </p>
          {habit.kind === 'counter' && (
            <p className="text-on-surface-variant mt-0.5 text-xs">
              {count}
              {target ? ` / ${target}` : ''}
              {habit.unit ?? ''}
            </p>
          )}
        </div>
        {habit.kind === 'check' ? (
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
              done
                ? 'border-primary bg-primary text-on-primary'
                : 'border-outline/40'
            }`}
          >
            {done && <Check className="h-4 w-4" strokeWidth={3} />}
          </span>
        ) : (
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full ${
              reached
                ? 'bg-primary text-on-primary'
                : 'bg-primary/15 text-primary'
            }`}
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          </span>
        )}
      </button>
    </li>
  )
}

export default function HabitList() {
  const logs = useStore(habitLogsStore)
  useStore(userHabitsStore)
  const [exiting, setExiting] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState(false)

  const allHabits = listHabits()

  const habitsToShow = allHabits.filter((h) => {
    if (exiting.has(h.id)) return true
    const count = getTodayLog(h.id, logs)?.count ?? 0
    return !isHabitDone(h, count)
  })

  const visible = expanded
    ? habitsToShow
    : habitsToShow.slice(0, COLLAPSED_COUNT)
  const hiddenCount = habitsToShow.length - visible.length

  const handleTap = (habit: HabitDef) => {
    const current = getTodayLog(habit.id, logs)?.count ?? 0
    const wasDone = isHabitDone(habit, current)
    const willDone = isHabitDone(habit, nextHabitCount(habit, current))
    logHabit(habit.id)
    if (!wasDone && willDone) {
      setExiting((prev) => new Set(prev).add(habit.id))
      setTimeout(() => {
        setExiting((prev) => {
          const next = new Set(prev)
          next.delete(habit.id)
          return next
        })
      }, EXIT_MS)
    }
  }

  if (habitsToShow.length === 0) {
    return (
      <p className="text-on-surface-variant font-body text-center text-sm">
        今天的习惯都打卡完了 🌿
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="grid grid-cols-1 gap-2">
        {visible.map((h) => (
          <HabitRow
            key={h.id}
            habit={h}
            count={getTodayLog(h.id, logs)?.count ?? 0}
            isExiting={exiting.has(h.id)}
            onTap={handleTap}
          />
        ))}
      </ul>
      {hiddenCount > 0 && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-on-surface-variant font-body inline-flex items-center justify-center gap-1 self-center text-xs"
        >
          查看其余 {hiddenCount} 个
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      )}
      {expanded && habitsToShow.length > COLLAPSED_COUNT && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="text-on-surface-variant font-body inline-flex items-center justify-center gap-1 self-center text-xs"
        >
          收起
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
