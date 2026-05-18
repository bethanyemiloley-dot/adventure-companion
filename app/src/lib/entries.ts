import { createStore, uid } from './store'

export type Mood = '灵光一现' | '终于搞定' | '只是发呆'

export const MOODS: Mood[] = ['灵光一现', '终于搞定', '只是发呆']

export type Note = {
  id: string
  kind: 'note'
  text: string
  mood: Mood | null
  createdAt: string
}

export const notesStore = createStore<Note>('adventure:notes')

export function createNote(input: { text: string; mood: Mood | null }): Note {
  const note: Note = {
    id: uid(),
    kind: 'note',
    text: input.text.trim(),
    mood: input.mood,
    createdAt: new Date().toISOString(),
  }
  notesStore.add(note)
  return note
}

export type TaskStatus = 'pending' | 'done' | 'migrated' | 'archived'

export type DateRange = { from: string; to: string }

export type Task = {
  id: string
  kind: 'task'
  text: string
  isMainline: boolean
  scheduledAt: string | null
  dateRange: DateRange | null
  forDate: string
  status: TaskStatus
  createdAt: string
  completedAt: string | null
}

export const tasksStore = createStore<Task>('adventure:tasks')

export function todayKey(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function createTask(input: {
  text: string
  isMainline: boolean
  scheduledAt: string | null
  dateRange: DateRange | null
}): Task {
  const now = new Date()
  const baseDate = input.isMainline
    ? input.dateRange?.from
      ? new Date(input.dateRange.from)
      : now
    : input.scheduledAt
      ? new Date(input.scheduledAt)
      : now
  const task: Task = {
    id: uid(),
    kind: 'task',
    text: input.text.trim(),
    isMainline: input.isMainline,
    scheduledAt: input.isMainline ? null : input.scheduledAt,
    dateRange: input.isMainline ? input.dateRange : null,
    forDate: todayKey(baseDate),
    status: 'pending',
    createdAt: now.toISOString(),
    completedAt: null,
  }
  tasksStore.add(task)
  return task
}

export function completeTask(id: string) {
  tasksStore.update(id, {
    status: 'done',
    completedAt: new Date().toISOString(),
  })
}

export function pushTaskToTomorrow(id: string) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tasksStore.update(id, { forDate: todayKey(tomorrow) })
}

export function uncompleteTask(id: string) {
  tasksStore.update(id, { status: 'pending', completedAt: null })
}

export type HabitKind = 'check' | 'counter'

export type HabitDef = {
  id: string
  name: string
  kind: HabitKind
  dailyTarget?: number
  unit?: string
}

export const DEFAULT_HABITS: HabitDef[] = [
  { id: 'water', name: '喝水', kind: 'counter', dailyTarget: 8, unit: '杯' },
  { id: 'breakfast', name: '早餐', kind: 'check' },
  { id: 'lunch', name: '午餐', kind: 'check' },
  { id: 'dinner', name: '晚餐', kind: 'check' },
  { id: 'kegel', name: '提肛', kind: 'counter', unit: '次' },
  { id: 'lookup', name: '抬头一分钟', kind: 'check' },
  { id: 'friend', name: '和朋友问下近况', kind: 'check' },
]

export const userHabitsStore = createStore<HabitDef>('adventure:userHabits')

type HiddenHabit = { id: string; habitId: string }
export const hiddenHabitsStore = createStore<HiddenHabit>(
  'adventure:hiddenHabits',
)

export function listHabits(): HabitDef[] {
  const hidden = new Set(
    hiddenHabitsStore.getAll().map((h) => h.habitId),
  )
  return [...DEFAULT_HABITS, ...userHabitsStore.getAll()].filter(
    (h) => !hidden.has(h.id),
  )
}

export function createHabit(input: {
  name: string
  kind: HabitKind
  dailyTarget?: number
  unit?: string
}): HabitDef {
  const habit: HabitDef = {
    id: uid(),
    name: input.name.trim(),
    kind: input.kind,
    dailyTarget: input.dailyTarget,
    unit: input.unit,
  }
  userHabitsStore.add(habit)
  return habit
}

export function removeHabit(habitId: string) {
  const isUserCreated = userHabitsStore
    .getAll()
    .some((h) => h.id === habitId)
  if (isUserCreated) {
    userHabitsStore.remove(habitId)
    return
  }
  const already = hiddenHabitsStore
    .getAll()
    .some((h) => h.habitId === habitId)
  if (!already) {
    hiddenHabitsStore.add({ id: uid(), habitId })
  }
}

// kept as alias for backwards compat with imports
export const HABITS = DEFAULT_HABITS

export type HabitLog = {
  id: string
  kind: 'habitLog'
  habitId: string
  date: string
  count: number
  updatedAt: string
}

export const habitLogsStore = createStore<HabitLog>('adventure:habitLogs')

export function getTodayLog(
  habitId: string,
  logs: HabitLog[] = habitLogsStore.getAll(),
  date: Date = new Date(),
): HabitLog | null {
  const today = todayKey(date)
  return (
    logs.find((l) => l.habitId === habitId && l.date === today) ?? null
  )
}

export function isHabitDone(habit: HabitDef, count: number): boolean {
  if (habit.kind === 'check') return count >= 1
  if (habit.dailyTarget) return count >= habit.dailyTarget
  return false
}

export function nextHabitCount(habit: HabitDef, current: number): number {
  if (habit.kind === 'check') return current >= 1 ? 0 : 1
  return current + 1
}

export function logHabit(habitId: string) {
  const habit = HABITS.find((h) => h.id === habitId)
  if (!habit) return
  const existing = getTodayLog(habitId)
  const now = new Date()
  if (!existing) {
    habitLogsStore.add({
      id: uid(),
      kind: 'habitLog',
      habitId,
      date: todayKey(now),
      count: 1,
      updatedAt: now.toISOString(),
    })
    return
  }
  const nextCount =
    habit.kind === 'check'
      ? existing.count >= 1
        ? 0
        : 1
      : existing.count + 1
  habitLogsStore.update(existing.id, {
    count: nextCount,
    updatedAt: now.toISOString(),
  })
}

export function visibleTodayTasks(all: Task[], date: Date = new Date()): Task[] {
  const today = todayKey(date)
  return all
    .filter((t) => {
      if (t.status !== 'pending') return false
      if (t.isMainline) return true
      return t.forDate === today
    })
    .sort((a, b) => {
      if (a.scheduledAt && b.scheduledAt)
        return a.scheduledAt.localeCompare(b.scheduledAt)
      if (a.scheduledAt) return -1
      if (b.scheduledAt) return 1
      return b.createdAt.localeCompare(a.createdAt)
    })
}
