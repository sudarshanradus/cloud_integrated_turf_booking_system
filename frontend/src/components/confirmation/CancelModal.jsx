import { AlertTriangle, CheckCircle2, X } from 'lucide-react'

export default function CancelModal({ booking, onConfirm, onClose, loading }) {
  const slotDate = new Date(`${booking.date}T00:00:00`)
  const formatted = slotDate.toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short' })
  const now = new Date()
  const [hours, minutes] = booking.time.split(' ')[0].split(':').map(Number)
  const modifier = booking.time.split(' ')[1]
  let h = hours
  if (modifier === 'PM' && h !== 12) h += 12
  if (modifier === 'AM' && h === 12) h = 0
  const slotTime = new Date(booking.date + `T${String(h).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:00`)
  const diff = (slotTime - now) / 60000
  const noRefund = diff <= 120

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm fade-in">
      <div className="glass rounded-3xl max-w-sm w-full p-7 scale-in border border-red-500/20">
        <div className="flex justify-between items-start mb-5">
          <div className="w-12 h-12 rounded-2xl bg-red-500/15 flex items-center justify-center">
            <AlertTriangle size={22} className="text-red-400" />
          </div>
          <button onClick={onClose} className="w-8 h-8 glass rounded-xl flex items-center justify-center text-slate-400"><X size={15} /></button>
        </div>

        <h3 className="text-white font-bold text-lg mb-1">Cancel Booking?</h3>
        <p className="text-slate-400 text-sm mb-5">
          You're about to cancel your slot at <span className="text-white font-semibold">{formatted} · {booking.time}</span>.
        </p>

        <div className={`rounded-2xl p-4 mb-5 text-sm border flex items-start gap-2.5 ${noRefund ? 'bg-red-500/10 border-red-500/20 text-red-300' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'}`}>
          {noRefund ? (
            <><AlertTriangle size={16} className="shrink-0 mt-0.5" /><span><strong>No Refund</strong> — Cancellation is within 2 hours of the slot time. Your advance of ₹{booking.advancePaid} will be forfeited.</span></>
          ) : (
            <><CheckCircle2 size={16} className="shrink-0 mt-0.5" /><span><strong>Full Refund</strong> — Your advance of ₹{booking.advancePaid} will be refunded within 3–5 business days.</span></>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1 py-3 text-sm">Keep Booking</button>
          <button
            onClick={() => onConfirm(booking.id)}
            disabled={loading}
            className="flex-1 py-3 text-sm font-bold rounded-xl bg-red-600 hover:bg-red-500 text-white transition flex items-center justify-center gap-2"
          >
            {loading ? 'Cancelling…' : 'Yes, Cancel'}
          </button>
        </div>
      </div>
    </div>
  )
}
