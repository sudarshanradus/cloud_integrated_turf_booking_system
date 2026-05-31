import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import CancelModal from '../components/confirmation/CancelModal'
import { ArrowLeft, Search, Calendar, Clock, Wallet, Phone, AlertCircle, CheckCircle2, X } from 'lucide-react'
import { API_BASE_URL } from '../config';
// --- CONFIGURATION ---
// const API_BASE_URL = "http://40.192.37.27:3001";

export default function MyBookingsPage() {
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
    setLoading(true); setError(''); setCancelResult(null)
    try {
      // Updated to use EC2 IP
      const res = await fetch(`${API_BASE_URL}/api/my-bookings?phone=${encodeURIComponent(phone.trim())}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setBookings(data)
      if (data.length === 0) setError('No upcoming bookings found for this number.')
    } catch (err) {
      setError(err.message); setBookings([])
    } finally { setLoading(false) }
  }

  const handleCancel = async (bookingId) => {
    setCancelLoading(true)
    try {
      // Updated to use EC2 IP
      const res = await fetch(`${API_BASE_URL}/api/cancel`, { 
        method:'POST', 
        headers:{'Content-Type':'application/json'}, 
        body:JSON.stringify({ bookingId }) 
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCancelResult(data)
      setBookings(prev => prev.filter(b => b.id !== bookingId))
      setCancelTarget(null)
    } catch (err) { setError(err.message) }
    finally { setCancelLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#080c10]">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="border-b border-white/6 glass-dark">
          <div className="max-w-2xl mx-auto px-4 py-5 flex items-center gap-4">
            <button onClick={() => navigate('/')} className="w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition">
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="font-sport text-xl font-bold text-white">My Bookings</h1>
              <p className="text-slate-500 text-xs">View and manage your slot reservations</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
          {/* Cancel result banner */}
          {cancelResult && (
            <div className={`rounded-2xl p-5 flex items-start gap-4 border ${cancelResult.refundIssued ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${cancelResult.refundIssued ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                {cancelResult.refundIssued ? <CheckCircle2 size={20} className="text-emerald-400" /> : <AlertCircle size={20} className="text-red-400" />}
              </div>
              <div>
                <p className="font-semibold text-white text-sm">
                  {cancelResult.refundIssued ? 'Booking Cancelled — Refund Initiated' : 'Booking Cancelled — No Refund'}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {cancelResult.refundIssued
                    ? `Full refund of ₹${cancelResult.advancePaid} will be processed within 3–5 business days.`
                    : 'Cancelled within 2 hours of slot time. Advance is forfeited as per policy.'}
                </p>
              </div>
              <button onClick={() => setCancelResult(null)} className="ml-auto w-7 h-7 glass rounded-lg flex items-center justify-center text-slate-500 hover:text-white shrink-0"><X size={14} /></button>
            </div>
          )}

          {/* Search box */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h2 className="text-white font-semibold text-sm">Find Your Bookings</h2>
            <form onSubmit={fetchBookings} className="flex gap-3">
              <div className="relative flex-1">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Enter your WhatsApp number"
                  className="input-field pl-11"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary px-5 py-2.5 text-sm shrink-0 flex items-center gap-2">
                {loading ? 'Searching…' : <><Search size={14} /> Search</>}
              </button>
            </form>
            <p className="text-slate-600 text-xs">Enter the number you used when booking</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-3 rounded-xl text-sm">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          {/* Bookings list */}
          {bookings && bookings.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                {bookings.length} Upcoming Booking{bookings.length > 1 ? 's' : ''}
              </h2>
              {bookings.map(b => (
                <div key={b.id} className="glass rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 border border-white/6 hover:border-emerald-500/20 transition-all">
                  <div className="w-12 h-12 rounded-xl glass-green flex items-center justify-center text-emerald-400 font-mono font-bold text-xs shrink-0">
                    {b.id.slice(0,2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-white font-semibold text-sm">{b.name}</span>
                      <span className="text-emerald-400 font-mono text-xs badge-green px-2 py-0.5 rounded-full">{b.id}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Calendar size={11} /> {b.date}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {b.time}</span>
                      <span className="flex items-center gap-1"><Wallet size={11} /> ₹{b.totalRate} total · ₹{b.advancePaid} paid</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setCancelTarget(b)}
                    className="shrink-0 text-xs bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 px-4 py-2 rounded-xl transition-all"
                  >
                    Cancel Booking
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {bookings && bookings.length === 0 && !error && (
            <div className="glass rounded-2xl p-12 text-center text-slate-600">
              <div className="w-16 h-16 mx-auto glass-green rounded-2xl flex items-center justify-center mb-4">
                <Calendar size={32} className="text-emerald-500/60" />
              </div>
              <p className="font-semibold text-white text-sm mb-1">No upcoming bookings</p>
              <p className="text-xs">Book a slot and it'll appear here</p>
              <button onClick={() => navigate('/booking')} className="btn-primary mt-6 px-6 py-2.5 text-sm">
                Book a Slot →
              </button>
            </div>
          )}
        </div>
      </div>

      {cancelTarget && (
        <CancelModal
          booking={cancelTarget}
          onConfirm={handleCancel}
          onClose={() => setCancelTarget(null)}
          loading={cancelLoading}
        />
      )}
    </div>
  )
}