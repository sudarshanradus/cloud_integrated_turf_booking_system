import { useNavigate } from 'react-router-dom'
import { Home, Download, MessageCircle, X, Calendar, Clock, CreditCard, Wallet } from 'lucide-react'
import { useEffect, useRef } from 'react' //new line added
export default function SuccessModal({ bookingId, pricing, date, time, name, onClose }) {
  const navigate = useNavigate()
  const overlayRef = useRef()

  // Build WhatsApp link
  const waMsg = encodeURIComponent(
    `🏟️ *GreenField Arena – Booking Confirmed!*\n\n` +
    `📋 Booking ID: *${bookingId}*\n` +
    `👤 Name: ${name}\n` +
    `📅 Date: ${date}\n` +
    `⏰ Time: ${time}\n` +
    `💰 Total: ₹${pricing?.totalRate}\n` +
    `✅ Advance Paid: ₹${pricing?.advance}\n` +
    `💵 Balance at Venue: ₹${pricing?.balance}\n\n` +
    `Thank you for booking! See you on the field! ⚽`
  )
  const waLink = `https://wa.me/919876543210?text=${waMsg}`

  const handleDownload = () => {
    const text = `GREENFIELD ARENA — BOOKING RECEIPT\n${'='.repeat(40)}\nBooking ID: ${bookingId}\nName: ${name}\nDate: ${date}\nTime: ${time}\nTotal: ₹${pricing?.totalRate}\nAdvance Paid: ₹${pricing?.advance}\nBalance at Venue: ₹${pricing?.balance}\n${'='.repeat(40)}\nThank you for booking with GreenField Arena!\nContact: +91 98765 43210`
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `GF-Receipt-${bookingId}.txt`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm fade-in">
      <div className="glass rounded-3xl max-w-md w-full p-7 scale-in border border-emerald-500/20 shadow-2xl relative">
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition">
          <X size={16} />
        </button>

        {/* Animated checkmark */}
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 relative">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center glow-green">
              <svg viewBox="0 0 50 50" width="40" height="40">
                <polyline points="10,27 21,38 40,15" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="check-anim" />
              </svg>
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="font-sport text-2xl font-bold text-white mb-1">BOOKING CONFIRMED!</h2>
          <p className="text-slate-400 text-sm">Your slot has been reserved successfully</p>
        </div>

        {/* Booking ID */}
        <div className="glass-green rounded-2xl p-4 mb-5 text-center">
          <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider">Booking ID</p>
          <p className="font-mono text-2xl font-bold gradient-text">{bookingId}</p>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: 'Date', value: date, icon: Calendar },
            { label: 'Time', value: time, icon: Clock },
            { label: 'Advance', value: `₹${pricing?.advance}`, icon: CreditCard },
            { label: 'Balance', value: `₹${pricing?.balance}`, icon: Wallet },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="glass rounded-xl p-3 flex items-center gap-2.5">
              <Icon size={14} className="text-emerald-400 shrink-0" />
              <div>
                <p className="text-slate-500 text-xs mb-0.5">{label}</p>
                <p className="text-white text-sm font-semibold">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="w-full py-3.5 rounded-xl bg-[#25d366] hover:bg-[#1db954] text-white font-bold text-sm transition flex items-center justify-center gap-2">
            <MessageCircle size={16} fill="white" /> Open WhatsApp Confirmation
          </a>
          <button onClick={handleDownload}
            className="btn-ghost w-full py-3 text-sm flex items-center justify-center gap-2">
            <Download size={15} /> Download Receipt
          </button>
          <button onClick={() => navigate('/')}
            className="w-full py-3 text-sm text-slate-500 hover:text-white transition flex items-center justify-center gap-2">
            <Home size={14} /> Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
