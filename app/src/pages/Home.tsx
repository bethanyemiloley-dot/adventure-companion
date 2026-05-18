import { useEffect, useState } from 'react'
import { foxStateForDate, type FoxState } from '../lib/foxState'
import TaskList from '../components/TaskList'
import HabitList from '../components/HabitList'

function useFoxState(): FoxState {
  const [state, setState] = useState(() => foxStateForDate())
  useEffect(() => {
    const id = setInterval(() => setState(foxStateForDate()), 60_000)
    return () => clearInterval(id)
  }, [])
  return state
}

export default function Home() {
  const fox = useFoxState()
  return (
    <div className="flex flex-1 flex-col items-center px-6 pt-8 pb-12">
      <h1 className="font-display text-primary self-start text-2xl font-bold">
        {fox.greeting}
      </h1>

      <div className="mt-6 w-full max-w-xs">
        <div className="bg-warm-sand rounded-card overflow-hidden shadow-[0_8px_32px_rgba(0,110,43,0.08)]">
          <img
            src={fox.image}
            alt={`狐狸 · ${fox.slot}`}
            className="aspect-square w-full object-cover"
          />
        </div>
      </div>

      <p className="font-quote text-on-surface-variant mt-6 max-w-xs text-center text-base leading-relaxed">
        {fox.whisper}
      </p>

      <section className="mt-8 w-full">
        <h2 className="font-display text-on-surface text-base font-semibold">
          今天
        </h2>
        <div className="mt-3">
          <TaskList />
        </div>
      </section>

      <section className="mt-8 w-full">
        <h2 className="font-display text-on-surface text-base font-semibold">
          今日习惯
        </h2>
        <div className="mt-3">
          <HabitList />
        </div>
      </section>
    </div>
  )
}
