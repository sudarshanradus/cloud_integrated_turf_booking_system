import { Lock, Check } from 'lucide-react'

export default function SlotGrid({ slots, selectedSlot, onSelect }) {
  if (!slots || slots.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center text-slate-500 text-sm">
        Loading slots...
      </div>
    )
  }

  const available = slots.filter(s => !s.booked && !s.blocked).length

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm">Select a Time Slot</h3>
        <span className="text-xs badge-green px-2.5 py-1 rounded-full font-semibold">{available} Available</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
        {slots.map((slot) => {
          const isSelected = selectedSlot?.time === slot.time
          const isUnavailable = slot.booked || slot.blocked

          return (
            <button
              key={slot.time}
              disabled={isUnavailable}
              onClick={() => !isUnavailable && onSelect(slot)}
              className={`relative rounded-xl p-3 text-center transition-all duration-200 flex flex-col items-center justify-center gap-1
                ${isSelected ? 'slot-selected' : ''}
                ${!isSelected && !isUnavailable ? 'slot-available' : ''}
                ${slot.booked ? 'slot-booked' : ''}
                ${slot.blocked ? 'slot-blocked' : ''}
              `}
            >
              <span className="text-xs font-bold leading-none">{slot.time.split(' ')[0]}</span>
              <span className="text-[10px] opacity-70">{slot.time.split(' ')[1]}</span>
              {isSelected && <Check size={12} className="absolute top-1.5 right-1.5 text-emerald-300" />}
              {isUnavailable && <Lock size={10} className="absolute top-1.5 right-1.5 opacity-40" />}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-white/6 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500/40" /> Available</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500/30 border border-emerald-500 shadow-sm shadow-emerald-500/40" /> Selected</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-500/10 border border-red-500/20" /> Booked</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-yellow-500/10 border border-yellow-500/20" /> Blocked</span>
      </div>
    </div>
  )
}
