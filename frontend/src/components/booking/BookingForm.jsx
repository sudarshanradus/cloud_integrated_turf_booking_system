import { useState } from 'react'
import { ArrowRight, Loader } from 'lucide-react'

export default function BookingForm({ onSubmit, loading }) {
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!name.trim() || name.trim().length < 2) e.name = 'Enter your full name'
    if (!/^[6-9]\d{9}$/.test(whatsapp.replace(/\s+/g, ''))) e.whatsapp = 'Enter a valid 10-digit Indian mobile number'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    if (!validate()) return
    onSubmit({ name: name.trim(), whatsapp: whatsapp.replace(/\s+/g, '') })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={e => { setName(e.target.value); setErrors(er => ({...er, name: ''})) }}
          placeholder="Your full name"
          className={`input-field ${errors.name ? 'border-red-500/50 focus:border-red-500' : ''}`}
        />
        {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
      </div>

      {/* WhatsApp */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">WhatsApp Number</label>
        <div className="relative">
          <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium transition-opacity duration-200 ${whatsapp ? 'opacity-0' : ''}`}>+91</span>
          <input
            type="tel"
            value={whatsapp}
            onChange={e => { setWhatsapp(e.target.value); setErrors(er => ({...er, whatsapp: ''})) }}
            placeholder=""
            maxLength={10}
            className={`input-field pl-14 ${errors.whatsapp ? 'border-red-500/50' : ''}`}
          />
        </div>
        {errors.whatsapp && <p className="text-red-400 text-xs mt-1.5">{errors.whatsapp}</p>}
        <p className="text-slate-600 text-xs mt-1.5">Booking confirmation will be sent to this number</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2 mt-2"
      >
        {loading ? (
          <><Loader size={16} className="animate-spin" /> Processing...</>
        ) : (
          <>Confirm Booking <ArrowRight size={16} /></>
        )}
      </button>
    </form>
  )
}
