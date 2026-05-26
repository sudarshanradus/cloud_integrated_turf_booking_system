import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from '../components/DatePicker'
import SlotGrid from '../components/SlotGrid'
import BookingSummary from '../components/BookingSummary'
import PaymentModal from '../components/PaymentModal'

export default function Booking() {
  const navigate = useNavigate()
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [loading, setLoading] = useState(false)
  const [bookingId, setBookingId] = useState(null)
  const [bookingPricing, setBookingPricing] = useState(null)
  const [pricing, setPricing] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setSelectedSlot(null)
    setError('')
    fetch(`/api/slots?date=${date}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.slots))
      .catch(() => setError('Could not load slots'))
  }, [date])

  useEffect(() => {
    fetch(`/api/pricing?date=${date}`)
      .then((r) => r.json())
      .then(setPricing)
      .catch(() => {})
  }, [date])

  const handleSlotSelect = (slot) => {
    if (selectedSlot?.time === slot.time) {
      setSelectedSlot(null)
    } else {
      setSelectedSlot(slot)
    }
    setError('')
  }

  const handlePay = async ({ name, whatsapp }) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, time: selectedSlot.time, name, whatsapp }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Booking failed')
      setBookingId(data.bookingId)
      setBookingPricing(pricing)
      setSlots((prev) =>
        prev.map((s) =>
          s.time === selectedSlot.time ? { ...s, booked: true } : s
        )
      )
      setSelectedSlot(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentDone = () => {
    setBookingId(null)
    setBookingPricing(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white pb-28">
      <header className="sticky top-0 z-30 bg-green-900/80 backdrop-blur-lg border-b border-green-800/50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-green-300 hover:text-white transition text-sm">
            &larr; Back
          </button>
          <h1 className="text-lg font-bold">Book Your Slot</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-4 pb-6 space-y-5">
        {error && (
          <div className="bg-red-900/40 text-red-300 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}

        <section>
          <h2 className="text-sm font-semibold text-green-300 mb-3 uppercase tracking-wider">Select Date</h2>
          <DatePicker selectedDate={date} onSelect={setDate} />
        </section>

        {pricing && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-300 font-medium">
              {pricing.totalRate === pricing.advance + pricing.balance ? (
                <>Weekday Rate &middot; ₹{pricing.totalRate} per slot</>
              ) : (
                <>Weekend Rate &middot; ₹{pricing.totalRate} per slot</>
              )}
            </span>
            <span className="text-green-500 text-xs bg-green-900/40 px-2 py-0.5 rounded-full">
              {new Date(date + 'T00:00:00').getDay() === 0 || new Date(date + 'T00:00:00').getDay() === 6
                ? 'Weekend'
                : 'Weekday'}
            </span>
          </div>
        )}

        <section>
          <SlotGrid slots={slots} selectedSlot={selectedSlot} onSelect={handleSlotSelect} />
        </section>
      </main>

      {selectedSlot && !bookingId && (
        <BookingSummary
          selectedSlot={selectedSlot}
          date={date}
          pricing={pricing}
          onPay={handlePay}
          loading={loading}
        />
      )}

      {bookingId && (
        <PaymentModal bookingId={bookingId} pricing={bookingPricing} onClose={handlePaymentDone} />
      )}
    </div>
  )
}
