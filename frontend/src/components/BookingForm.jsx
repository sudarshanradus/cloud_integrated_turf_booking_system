import { useState } from 'react'

export default function BookingForm({ selectedSlot, date, pricing, onConfirm, loading }) {
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !whatsapp.trim()) return
    onConfirm({ name: name.trim(), whatsapp: whatsapp.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur rounded-2xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white">
        Booking for <span className="text-green-400">{selectedSlot.time}</span> on{' '}
        <span className="text-green-400">{date}</span>
      </h3>

      {pricing && (
        <div className="bg-green-900/30 rounded-xl p-4 space-y-1 text-sm">
          <div className="flex justify-between text-green-200">
            <span>Total Price</span>
            <span className="font-bold text-white">₹{pricing.totalRate}</span>
          </div>
          <div className="flex justify-between text-green-200">
            <span>Advance Required</span>
            <span className="font-bold text-green-400">₹{pricing.advance}</span>
          </div>
          <div className="flex justify-between text-green-200">
            <span>Balance at Turf</span>
            <span className="font-bold text-white">₹{pricing.balance}</span>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm text-green-200 mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-green-700 text-white placeholder-green-400/50 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="block text-sm text-green-200 mb-1">WhatsApp Number</label>
        <input
          type="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-green-700 text-white placeholder-green-400/50 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="+91 98765 43210"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-700 text-black font-bold py-3 rounded-xl transition"
      >
        {loading ? 'Processing...' : `Pay Advance of ₹${pricing ? pricing.advance : '...'} to Confirm`}
      </button>
    </form>
  )
}
