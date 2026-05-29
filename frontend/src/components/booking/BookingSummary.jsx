import { Calendar, Clock, CreditCard, Wallet } from 'lucide-react'

export default function BookingSummary({ selectedSlot, date, pricing }) {
  const isWeekend = new Date(date + 'T00:00:00').getDay() === 0 || new Date(date + 'T00:00:00').getDay() === 6
  const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })

  return (
    <div className="glass-green rounded-2xl p-5 space-y-4">
      <h3 className="text-white font-semibold text-sm flex items-center gap-2">
        <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">✓</span>
        Booking Summary
      </h3>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 glass rounded-lg flex items-center justify-center">
            <Calendar size={14} className="text-emerald-400" />
          </div>
          <div>
            <div className="text-slate-400 text-xs">Date</div>
            <div className="text-white font-medium">{displayDate}</div>
          </div>
          {isWeekend && <span className="ml-auto badge-yellow px-2 py-0.5 rounded-full text-[10px] font-semibold">Weekend</span>}
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 glass rounded-lg flex items-center justify-center">
            <Clock size={14} className="text-emerald-400" />
          </div>
          <div>
            <div className="text-slate-400 text-xs">Time Slot</div>
            <div className="text-white font-medium">{selectedSlot?.time} – 1 Hour</div>
          </div>
        </div>
      </div>

      {pricing && (
        <div className="border-t border-white/8 pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Slot Rate</span>
            <span className="text-white font-medium">₹{pricing.totalRate?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1.5">
              <CreditCard size={12} /> Advance to Pay Now
            </span>
            <span className="text-emerald-400 font-bold text-base">₹{pricing.advance?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Wallet size={12} /> Balance at Venue
            </span>
            <span className="text-white font-medium">₹{pricing.balance?.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}
