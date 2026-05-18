import { useRef, useState } from 'react'
import { Trash2 } from 'lucide-react'
import {
  MOODS,
  listHabits,
  removeHabit,
  type DateRange,
  type HabitKind,
  type Mood,
  createHabit,
  createNote,
  createTask,
  hiddenHabitsStore,
  userHabitsStore,
} from '../lib/entries'
import { useStore } from '../lib/store'
import { foxStateForDate } from '../lib/foxState'
import DateTimePicker from '../components/DateTimePicker'
import DateRangePicker from '../components/DateRangePicker'

type EntryKind = 'note' | 'task' | 'habit'

const KIND_LABEL: Record<EntryKind, string> = {
  note: '笔记',
  task: '任务',
  habit: '习惯',
}

export default function Record() {
  const [kind, setKind] = useState<EntryKind>('note')
  const [text, setText] = useState('')
  const [mood, setMood] = useState<Mood | null>(null)
  const [isMainline, setIsMainline] = useState(false)
  const [scheduledAt, setScheduledAt] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const greeting = foxStateForDate().greeting
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const canSubmit = text.trim().length > 0 && kind !== 'habit'

  const reset = () => {
    setText('')
    setMood(null)
    setIsMainline(false)
    setScheduledAt('')
    setDateRange(null)
  }

  const handleSubmit = () => {
    if (!canSubmit) return
    if (kind === 'note') {
      createNote({ text, mood })
    } else if (kind === 'task') {
      createTask({
        text,
        isMainline,
        scheduledAt:
          !isMainline && scheduledAt
            ? new Date(scheduledAt).toISOString()
            : null,
        dateRange: isMainline ? dateRange : null,
      })
    }
    reset()
    setIsAnimating(true)
    textareaRef.current?.focus()
  }

  return (
    <div className="flex flex-1 flex-col px-6 pt-8 pb-6">
      <h1 className="font-display text-primary text-2xl font-bold">
        {greeting}
      </h1>

      <div className="mt-6 flex gap-2">
        {(Object.keys(KIND_LABEL) as EntryKind[]).map((k) => {
          const active = k === kind
          return (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={`font-body rounded-full px-4 py-1.5 text-sm transition-colors ${
                active
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {KIND_LABEL[k]}
            </button>
          )
        })}
      </div>

      {kind === 'habit' ? (
        <HabitView
          onCreated={() => {
            setIsAnimating(true)
          }}
          isAnimating={isAnimating}
          onAnimationEnd={() => setIsAnimating(false)}
        />
      ) : (
        <>
          <div className="rounded-card bg-warm-sand mt-6 flex flex-1 flex-col p-5">
            <label
              htmlFor="entry-text"
              className="font-display text-on-surface text-lg font-semibold"
            >
              {kind === 'note' ? '此刻，你想写点什么？' : '记一件想做的事'}
            </label>
            <textarea
              ref={textareaRef}
              id="entry-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                kind === 'note'
                  ? '写下你的奇思妙想...'
                  : '比如：给妈妈打个电话'
              }
              className="font-body text-on-surface placeholder:text-outline mt-3 flex-1 resize-none border-0 bg-transparent text-base leading-relaxed focus:outline-none"
            />

            {kind === 'task' && (
              <div className="mt-4 flex flex-col gap-3">
                <label className="font-body text-on-surface-variant flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={isMainline}
                    onChange={(e) => setIsMainline(e.target.checked)}
                    className="accent-primary h-4 w-4"
                  />
                  <span>
                    <span className="text-on-surface font-semibold">主线</span>
                    <span className="ml-1 opacity-70">
                      · 跨天持续推进的长期事项
                    </span>
                  </span>
                </label>
                <div className="font-body text-on-surface-variant flex items-center gap-3 text-sm">
                  <span className="w-12 shrink-0">
                    {isMainline ? '跨度' : '时间'}
                  </span>
                  {isMainline ? (
                    <DateRangePicker
                      value={dateRange}
                      onChange={setDateRange}
                    />
                  ) : (
                    <DateTimePicker
                      value={scheduledAt}
                      onChange={setScheduledAt}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {kind === 'note' && (
            <div className="mt-4 flex flex-wrap gap-2">
              {MOODS.map((m) => {
                const active = mood === m
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(active ? null : m)}
                    className={`font-body rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      active
                        ? 'border-primary bg-primary-container/30 text-primary'
                        : 'border-outline/30 text-on-surface-variant'
                    }`}
                  >
                    {m}
                  </button>
                )
              })}
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            onAnimationEnd={() => setIsAnimating(false)}
            disabled={!canSubmit}
            className={`font-display bg-primary text-on-primary mt-5 rounded-full px-6 py-3 text-base font-semibold transition-opacity disabled:opacity-40 ${
              isAnimating ? 'animate-record-out' : ''
            }`}
          >
            记下来
          </button>
        </>
      )}
    </div>
  )
}

function HabitView({
  onCreated,
  isAnimating,
  onAnimationEnd,
}: {
  onCreated: () => void
  isAnimating: boolean
  onAnimationEnd: () => void
}) {
  const [name, setName] = useState('')
  const [habitKind, setHabitKind] = useState<HabitKind>('check')
  const [target, setTarget] = useState('')
  const [unit, setUnit] = useState('')

  const canSubmit = name.trim().length > 0

  const reset = () => {
    setName('')
    setHabitKind('check')
    setTarget('')
    setUnit('')
  }

  const handleSubmit = () => {
    if (!canSubmit) return
    const targetNum = habitKind === 'counter' ? Number(target) : undefined
    createHabit({
      name,
      kind: habitKind,
      dailyTarget:
        targetNum && !Number.isNaN(targetNum) && targetNum > 0
          ? targetNum
          : undefined,
      unit: habitKind === 'counter' ? unit.trim() || undefined : undefined,
    })
    reset()
    onCreated()
  }

  return (
    <>
      <div className="rounded-card bg-warm-sand mt-6 flex flex-col gap-3 p-5">
        <label
          htmlFor="habit-name"
          className="font-display text-on-surface text-lg font-semibold"
        >
          给自己加一个习惯
        </label>
        <input
          id="habit-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="比如：散步、读书、深呼吸..."
          className="font-body text-on-surface placeholder:text-outline border-outline/20 border-b bg-transparent py-2 text-base focus:border-primary focus:outline-none"
        />

        <div className="flex items-center gap-2">
          <span className="text-on-surface-variant w-12 shrink-0 text-sm">
            类型
          </span>
          <div className="bg-surface-container inline-flex w-fit gap-1 rounded-full p-1">
            {(['check', 'counter'] as HabitKind[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setHabitKind(k)}
                className={`font-body rounded-full px-3 py-1 text-xs transition-colors ${
                  habitKind === k
                    ? 'bg-surface text-on-surface shadow-sm'
                    : 'text-on-surface-variant'
                }`}
              >
                {k === 'check' ? '打勾式' : '计数式'}
              </button>
            ))}
          </div>
        </div>

        {habitKind === 'counter' && (
          <div className="flex items-center gap-2">
            <span className="text-on-surface-variant w-12 shrink-0 text-sm">
              目标
            </span>
            <input
              type="number"
              min="1"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="可选"
              className="bg-surface text-on-surface placeholder:text-outline w-20 rounded-lg px-2 py-1 text-sm"
            />
            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="单位 · 杯/次..."
              className="bg-surface text-on-surface placeholder:text-outline w-32 rounded-lg px-2 py-1 text-sm"
            />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        onAnimationEnd={onAnimationEnd}
        disabled={!canSubmit}
        className={`font-display bg-primary text-on-primary mt-5 rounded-full px-6 py-3 text-base font-semibold transition-opacity disabled:opacity-40 ${
          isAnimating ? 'animate-record-out' : ''
        }`}
      >
        记下来
      </button>

      <p className="text-on-surface-variant mt-4 text-center text-xs">
        添加后到首页就能打卡，已完成的会落到剪影里。
      </p>

      <HabitManageList />
    </>
  )
}

function HabitManageList() {
  useStore(userHabitsStore)
  useStore(hiddenHabitsStore)
  const habits = listHabits()
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  if (habits.length === 0) {
    return (
      <p className="text-on-surface-variant mt-8 text-center text-xs">
        还没有任何习惯，添加一个开始吧。
      </p>
    )
  }

  return (
    <section className="mt-8">
      <div className="flex items-baseline gap-3">
        <h2 className="font-display text-on-surface text-sm font-semibold">
          已添加的习惯
        </h2>
        <span className="bg-outline/20 h-px flex-1" />
        <span className="text-on-surface-variant text-xs">
          {habits.length} 个
        </span>
      </div>
      <ul className="mt-3 flex flex-col gap-2">
        {habits.map((h) => {
          const confirming = confirmingId === h.id
          return (
            <li
              key={h.id}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors ${
                confirming ? 'bg-soft-clay/30' : 'bg-warm-sand'
              }`}
            >
              <div className="flex-1">
                <p className="font-body text-on-surface text-sm">{h.name}</p>
                <p className="text-on-surface-variant mt-0.5 text-xs">
                  {confirming
                    ? '不再追踪这个习惯？已有的打卡记录会保留。'
                    : `${h.kind === 'check' ? '打勾式' : '计数式'}${
                        h.dailyTarget
                          ? ` · 每日 ${h.dailyTarget}${h.unit ?? ''}`
                          : ''
                      }`}
                </p>
              </div>
              {confirming ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setConfirmingId(null)}
                    className="text-on-surface-variant font-body rounded-full px-3 py-1 text-xs"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      removeHabit(h.id)
                      setConfirmingId(null)
                    }}
                    className="text-earth-moss font-body rounded-full bg-white/60 px-3 py-1 text-xs font-semibold"
                  >
                    删除
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingId(h.id)}
                  aria-label={`删除 ${h.name}`}
                  className="text-on-surface-variant hover:text-earth-moss p-1 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
