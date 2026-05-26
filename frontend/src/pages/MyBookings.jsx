import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CancelModal from '../components/CancelModal'

export default function MyBookings() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [bookings, setBookings] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cancelTarget, setCancelTarget] = useState(null)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [cancelResult, setCancelResult] = useState(null)

  const fetchBookings = async (e) => {
    e?.preventDefault()
    if (!phone.trim()) return
    setLoading(true)
    setError('')
    setCancelResult(null)
    try {
      const res = await fetch(`/api/my-bookings?phone=${encodeURIComponent(phone.trim())}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setBookings(data)
      if (data.length === 0) setError('No upcoming bookings found for this number.')
    } catch (err) {
      setError(err.message)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const handleCancelConfirm = async (bookingId) => {
    setCancelLoading(true)
    try {
      const res = await fetch('/api/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCancelResult(data)
      setBookings((prev) => prev.filter((b) => b.id !== bookingId))
      setCancelTarget(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setCancelLoading(false)
    }
  }

  const handleCloseCancelModal = () => {
    setCancelTarget(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white">
      <header className="sticky top-0 z-30 bg-green-900/80 backdrop-blur-lg border-b border-green-800/50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-green-300 hover:text-white transition text-sm">
            &larr; Back
          </button>
          <h1 className="text-lg font-bold">My Bookings</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {cancelResult && (
          <div className={`rounded-2xl p-4 mb-6 text-center border ${
            cancelResult.refundIssued
              ? 'bg-green-900/40 border-green-700 text-green-300'
              : 'bg-red-900/40 border-red-800 text-red-300'
          }`}>
            <div className="text-3xl mb-2">{cancelResult.refundIssued ? '✅' : '⚠️'}</div>
            <p className="font-semibold text-lg">
              {cancelResult.refundIssued
                ? `Full refund of ₹${cancelResult.advancePaid} initiated.`
                : 'Booking cancelled. No refund issued.'}
            </p>
            <button
              onClick={() => setCancelResult(null)}
              className="mt-3 text-sm underline opacity-70 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}

        <section className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-green-300 mb-3 uppercase tracking-wider">
            Enter Your WhatsApp Number
          </h2>
          <form onSubmit={fetchBookings} className="flex gap-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              required
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-green-700 text-white placeholder-green-400/50 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-400 disabled:bg-green-700 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </section>

        {error && (
          <div className="bg-red-900/40 text-red-300 px-4 py-3 rounded-xl text-sm mb-6">{error}</div>
        )}

        {bookings && bookings.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-green-300 uppercase tracking-wider mb-1">
              Your Upcoming Bookings
            </h2>
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white/5 backdrop-blur rounded-2xl p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-semibold">
                    {b.date} &middot; {b.time}
                  </p>
                  <p className="text-xs text-green-300">
                    Booking ID: <span className="font-mono">{b.id}</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Total: ₹{b.totalRate} &middot; Paid: ₹{b.advancePaid}
                  </p>
                </div>
                <button
                  onClick={() => setCancelTarget(b)}
                  className="bg-red-800/60 hover:bg-red-700 text-red-200 text-xs font-semibold px-4 py-2 rounded-xl transition shrink-0"
                >
                  Cancel
                </button>
              </div>
            ))}
          </section>
        )}

        {bookings && bookings.length === 0 && !error && (
          <div className="text-center text-gray-400 text-sm py-12">
            No upcoming bookings found for this number.
          </div>
        )}
      </main>

      {cancelTarget && (
        <CancelModal
          booking={cancelTarget}
          onConfirm={handleCancelConfirm}
          onClose={handleCloseCancelModal}
          loading={cancelLoading}
        />
      )}
    </div>
  )
}
