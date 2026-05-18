import { tasksStore, todayKey, type Task } from './entries'

const CHECK_KEY = 'adventure:lastMigrationCheck'

export function getStaleTasks(date: Date = new Date()): Task[] {
  const today = todayKey(date)
  return tasksStore
    .getAll()
    .filter(
      (t) =>
        t.status === 'pending' && !t.isMainline && t.forDate < today,
    )
}

export function readLastCheck(): string {
  return localStorage.getItem(CHECK_KEY) ?? ''
}

export function writeLastCheck(date: Date = new Date()) {
  localStorage.setItem(CHECK_KEY, todayKey(date))
}

export function migrateTaskToToday(id: string) {
  tasksStore.update(id, { forDate: todayKey() })
}

export function archiveTask(id: string) {
  tasksStore.update(id, { status: 'archived' })
}
