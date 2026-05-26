import { useState } from 'react'

export default function BookingSummary({ selectedSlot, date, pricing, onPay, loading }) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')

  if (!selectedSlot || !pricing) return null

  const handlePay = (e) => {
    e.preventDefault()
    if (!name.trim() || !whatsapp.trim()) return
    onPay({ name: name.trim(), whatsapp: whatsapp.trim() })
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-lg border-t border-green-800/50 shadow-2xl">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {!showForm ? (
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-green-300 font-medium">
                {date} &middot; {selectedSlot.time}
              </p>
              <p className="text-lg font-bold text-white">
                Total: ₹{pricing.totalRate}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-gray-400">Advance to Pay</p>
              <p className="text-lg font-bold text-green-400">₹{pricing.advance}</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-xl text-sm transition shrink-0"
            >
              Proceed to Pay
            </button>
          </div>
        ) : (
          <form onSubmit={handlePay} className="space-y-3">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-green-300">
                {date} &middot; {selectedSlot.time}
              </span>
              <span className="text-white font-bold">₹{pricing.totalRate}</span>
            </div>
            <div className="bg-green-900/30 rounded-xl p-3 flex justify-between text-sm">
              <span className="text-green-200">Advance to Pay</span>
              <span className="font-bold text-green-400">₹{pricing.advance}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your Name"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-green-700 text-white placeholder-green-400/50 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
                placeholder="WhatsApp Number"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-green-700 text-white placeholder-green-400/50 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 rounded-xl text-sm transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] bg-green-500 hover:bg-green-400 disabled:bg-green-700 text-black font-bold py-2.5 rounded-xl text-sm transition"
              >
                {loading ? 'Processing...' : `Pay ₹${pricing.advance}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
