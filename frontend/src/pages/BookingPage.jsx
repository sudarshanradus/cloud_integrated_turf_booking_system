import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import DatePicker from '../components/booking/DatePicker'
import SlotGrid from '../components/booking/SlotGrid'
import BookingForm from '../components/booking/BookingForm'
import BookingSummary from '../components/booking/BookingSummary'
import PaymentModal from '../components/payment/PaymentModal'
import SuccessModal from '../components/confirmation/SuccessModal'
import { ArrowLeft, AlertCircle, Sun, Calendar } from 'lucide-react'

function toLocalDateStr(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
}

export default function BookingPage() {
  const navigate = useNavigate()
  const today = toLocalDateStr()

  const [date, setDate] = useState(today)
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [pricing, setPricing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // flow states
  const [step, setStep] = useState('select') // 'select' | 'form' | 'payment' | 'success'
  const [booking, setBooking] = useState(null) // { id, name, date, time, pricing }

  // Fetch slots
  useEffect(() => {
    setSelectedSlot(null)
    setError('')
    fetch(`/api/slots?date=${date}`)
      .then(r => r.json())
      .then(d => setSlots(d.slots || []))
      .catch(() => setError('Could not load slots. Please check your connection.'))
  }, [date])

  // Fetch pricing
  useEffect(() => {
    fetch(`/api/pricing?date=${date}`)
      .then(r => r.json())
      .then(setPricing)
      .catch(() => {})
  }, [date])

  const handleBook = async ({ name, whatsapp }) => {
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

      setBooking({ id: data.bookingId, name, date, time: selectedSlot.time, pricing })
      setSlots(prev => prev.map(s => s.time === selectedSlot.time ? { ...s, booked: true } : s))
      setSelectedSlot(null)
      setStep('payment')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const isWeekend = new Date(date + 'T00:00:00').getDay() === 0 || new Date(date + 'T00:00:00').getDay() === 6

  return (
    <div className="min-h-screen bg-[#080c10]">
      <Navbar />

      {/* Page header */}
      <div className="border-b border-white/6 glass-dark pt-16">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center gap-4">
          <button onClick={() => navigate('/')} className="w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="font-sport text-xl font-bold text-white">Book Your Slot</h1>
            <p className="text-slate-500 text-xs">GreenField Arena · Bengaluru</p>
          </div>
          {pricing && (
            <div className="ml-auto flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1 ${isWeekend ? 'badge-yellow' : 'badge-green'}`}>
                {isWeekend ? <Sun size={12} /> : <Calendar size={12} />}
                {isWeekend ? 'Weekend' : 'Weekday'} · ₹{pricing.totalRate}/hr
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="flex items-center gap-2 bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm mb-6">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: date + slots */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">1. Pick a Date</h2>
              <DatePicker selectedDate={date} onSelect={d => { setDate(d); setStep('select') }} />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">2. Choose a Time Slot</h2>
              <SlotGrid slots={slots} selectedSlot={selectedSlot} onSelect={s => { setSelectedSlot(s); setStep('form') }} />
            </div>
          </div>

          {/* Right: summary + form */}
          <div className="space-y-5">
            {selectedSlot && (
              <>
                <div>
                  <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">3. Review</h2>
                  <BookingSummary selectedSlot={selectedSlot} date={date} pricing={pricing} />
                </div>
                <div>
                  <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">4. Your Details</h2>
                  <div className="glass rounded-2xl p-5">
                    <BookingForm onSubmit={handleBook} loading={loading} />
                  </div>
                </div>
              </>
            )}

            {!selectedSlot && (
              <div className="glass rounded-2xl p-8 text-center text-slate-600 text-sm">
                <div className="w-14 h-14 mx-auto glass-green rounded-2xl flex items-center justify-center mb-3">
                  <Calendar size={28} className="text-emerald-500/60" />
                </div>
                <p>Select a date and time slot to start your booking</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {step === 'payment' && booking && (
        <PaymentModal
          bookingId={booking.id}
          pricing={booking.pricing}
          name={booking.name}
          date={booking.date}
          time={booking.time}
          onClose={() => setStep('success')}
          onDone={() => setStep('success')}
        />
      )}

      {/* Success Modal */}
      {step === 'success' && booking && (
        <SuccessModal
          bookingId={booking.id}
          pricing={booking.pricing}
          date={booking.date}
          time={booking.time}
          name={booking.name}
          onClose={() => { setStep('select'); setBooking(null) }}
        />
      )}
    </div>
  )
}
