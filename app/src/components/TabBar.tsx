import { NavLink } from 'react-router-dom'
import { Footprints, House, PenLine, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Tab = {
  to: string
  label: string
  Icon: LucideIcon
}

const TABS: Tab[] = [
  { to: '/', label: '首页', Icon: House },
  { to: '/record', label: '记录', Icon: PenLine },
  { to: '/silhouette', label: '剪影', Icon: Footprints },
  { to: '/review', label: '回顾', Icon: Sparkles },
]

export default function TabBar() {
  return (
    <nav className="border-outline/20 bg-surface/95 sticky bottom-0 flex items-center justify-around border-t px-2 py-2 backdrop-blur-sm">
      {TABS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 rounded-2xl px-3 py-2 transition-colors ${
              isActive
                ? 'text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`
          }
        >
          <Icon className="h-6 w-6" strokeWidth={1.8} />
          <span className="font-body text-xs">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
