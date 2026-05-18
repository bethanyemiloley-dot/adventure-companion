import { useEffect, useState } from 'react'

export type Identified = { id: string }

export type Store<T extends Identified> = {
  getAll: () => T[]
  add: (item: T) => void
  update: (id: string, patch: Partial<T>) => void
  remove: (id: string) => void
  subscribe: (fn: () => void) => () => void
}

export function createStore<T extends Identified>(key: string): Store<T> {
  const subscribers = new Set<() => void>()
  let cache: T[] | null = null

  const load = (): T[] => {
    if (cache !== null) return cache
    try {
      const raw = localStorage.getItem(key)
      cache = raw ? JSON.parse(raw) : []
    } catch {
      cache = []
    }
    return cache!
  }

  const save = (items: T[]) => {
    cache = items
    localStorage.setItem(key, JSON.stringify(items))
    subscribers.forEach((fn) => fn())
  }

  return {
    getAll: load,
    add: (item) => save([item, ...load()]),
    update: (id, patch) =>
      save(load().map((x) => (x.id === id ? { ...x, ...patch } : x))),
    remove: (id) => save(load().filter((x) => x.id !== id)),
    subscribe: (fn) => {
      subscribers.add(fn)
      return () => {
        subscribers.delete(fn)
      }
    },
  }
}

export function useStore<T extends Identified>(store: Store<T>): T[] {
  const [items, setItems] = useState(store.getAll)
  useEffect(() => store.subscribe(() => setItems(store.getAll())), [store])
  return items
}

export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}
