const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function buildDates() {
  const today = new Date()
  return Array.from({ length: 10 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const dayName = DAYS[d.getDay()]
    const date = d.getDate()
    const month = MONTHS[d.getMonth()]
    const fullDate = d.toISOString().split('T')[0]
    const isToday = i === 0
    return { dayName, date, month, fullDate, isToday }
  })
}

export default function DatePicker({ selectedDate, onSelect }) {
  const dates = buildDates()

  return (
    <div className="overflow-x-auto scrollbar-hide pb-1">
      <div className="flex gap-2 min-w-max">
        {dates.map((d) => {
          const isSelected = selectedDate === d.fullDate
          return (
            <button
              key={d.fullDate}
              onClick={() => onSelect(d.fullDate)}
              className={`
                flex flex-col items-center justify-center w-16 h-20 rounded-xl shrink-0 transition-all duration-200
                ${isSelected
                  ? 'bg-green-500 text-black shadow-lg shadow-green-500/30 scale-105'
                  : d.isToday
                    ? 'bg-green-900/60 text-green-200 border border-green-700'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }
              `}
            >
              <span className="text-[10px] font-semibold uppercase leading-tight">{d.dayName}</span>
              <span className="text-lg font-extrabold leading-tight">{d.date}</span>
              <span className="text-[10px] leading-tight opacity-70">{d.month}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
