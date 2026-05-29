import { ChevronLeft } from 'lucide-react'

const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function getNext11Days() {
  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = 0; i < 11; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push(d)
  }
  return days
}

export default function DatePicker({ selectedDate, onSelect }) {
  const days = getNext11Days()
  const todayStr = toDateStr(new Date())

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <ChevronLeft size={11} className="text-emerald-400" />
        <span className="text-white font-semibold text-xs">Next 11 Days</span>
      </div>

      <div className="relative">
        <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#080c10] to-transparent z-10 pointer-events-none" />
        <div className="flex gap-2 overflow-x-auto pb-2 -mr-1 pr-1 snap-x snap-mandatory">
          {days.map((d) => {
          const dateStr = toDateStr(d)
          const isToday = dateStr === todayStr
          const isSelected = dateStr === selectedDate
          const isWeekend = d.getDay() === 0 || d.getDay() === 6
          const dayName = DAY_NAMES[d.getDay()]
          const dateNum = d.getDate()
          const month = MONTHS[d.getMonth()]

          return (
            <button
              key={dateStr}
              onClick={() => onSelect(dateStr)}
              className={`flex flex-col items-center justify-center min-w-[58px] py-3 px-2 rounded-xl text-xs font-medium transition-all shrink-0 snap-start
                ${isSelected
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105'
                  : isToday
                    ? 'glass-green text-emerald-400 border border-emerald-500/40'
                    : 'glass text-slate-300 hover:bg-white/8 hover:border-emerald-500/30'
                }
                ${isWeekend && !isSelected ? 'text-amber-400' : ''}
              `}
            >
              <span className="text-[10px] opacity-70">{dayName}</span>
              <span className="text-base font-bold leading-tight mt-0.5">{dateNum}</span>
              <span className="text-[11px] opacity-60 mt-0.5">{month}</span>
              {isWeekend && !isSelected && <span className="text-[7px] mt-0.5 opacity-70">Weekend</span>}
            </button>
          )
          })}
        </div>
      </div>
    </div>
  )
}