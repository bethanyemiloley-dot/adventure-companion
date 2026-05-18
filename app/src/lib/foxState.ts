export type TimeSlot =
  | 'morning'
  | 'forenoon'
  | 'noon'
  | 'afternoon'
  | 'evening'
  | 'night'

export type FoxState = {
  slot: TimeSlot
  image: string
  greeting: string
  whisper: string
}

type SlotConfig = {
  images: string[]
  greeting: string
  whisper: string
}

const SLOTS: Record<TimeSlot, SlotConfig> = {
  morning: {
    images: ['/foxes/morning-1.png', '/foxes/morning-2.png'],
    greeting: '早安，朋友',
    whisper: '新的一天，从一口呼吸开始。',
  },
  forenoon: {
    images: ['/foxes/forenoon-1.png', '/foxes/forenoon-2.png'],
    greeting: '上午好',
    whisper: '不必着急，慢慢来就好。',
  },
  noon: {
    images: ['/foxes/noon-1.png', '/foxes/noon-2.png'],
    greeting: '中午了',
    whisper: '喝口水，给自己留一会儿安静。',
  },
  afternoon: {
    images: ['/foxes/afternoon-1.png', '/foxes/afternoon-2.png'],
    greeting: '下午好，漫游者',
    whisper: '此刻有阳光，也有你。',
  },
  evening: {
    images: ['/foxes/evening-1.png', '/foxes/evening-2.png'],
    greeting: '傍晚了',
    whisper: '让日落代你松一口气。',
  },
  night: {
    images: ['/foxes/night-1.png', '/foxes/night-2.png'],
    greeting: '晚安，漫游者',
    whisper: '夜深了，让漫天星光伴你入眠。',
  },
}

export function slotForHour(hour: number): TimeSlot {
  if (hour >= 5 && hour < 9) return 'morning'
  if (hour >= 9 && hour < 12) return 'forenoon'
  if (hour >= 12 && hour < 14) return 'noon'
  if (hour >= 14 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 19) return 'evening'
  return 'night'
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export function foxStateForDate(date: Date = new Date()): FoxState {
  const slot = slotForHour(date.getHours())
  const config = SLOTS[slot]
  return {
    slot,
    image: pickRandom(config.images),
    greeting: config.greeting,
    whisper: config.whisper,
  }
}
