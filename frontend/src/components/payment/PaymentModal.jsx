import { useState, useRef } from 'react'
import { X, QrCode, Upload, Check, Loader, AlertCircle } from 'lucide-react'

// UPI apps
const UPI_APPS = [
  { name: 'Google Pay', initials: 'GP', color: 'from-blue-600 to-blue-800', upi: 'greenfieldarena@okaxis' },
  { name: 'PhonePe', initials: 'PP', color: 'from-purple-600 to-purple-800', upi: 'greenfieldarena@ybl' },
  { name: 'Paytm', initials: 'PT', color: 'from-sky-500 to-blue-700', upi: 'greenfieldarena@paytm' },
  { name: 'BHIM', initials: 'BH', color: 'from-orange-600 to-red-700', upi: 'greenfieldarena@upi' },
]

export default function PaymentModal({ bookingId, pricing, name, date, time, onClose, onDone }) {
  const [step, setStep] = useState('pay') // 'pay' | 'upload' | 'success'
  const [uploading, setUploading] = useState(false)
  const [screenshot, setScreenshot] = useState(null)
  const [copied, setCopied] = useState(false)
  const fileRef = useRef()

  const upiId = 'greenfieldarena@okaxis'

  const copyUPI = () => {
    navigator.clipboard.writeText(upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setScreenshot(url)
    }
  }

  const handleConfirm = () => {
    setUploading(true)
    setTimeout(() => {
      setUploading(false)
      setStep('success')
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="glass rounded-3xl w-full max-w-sm border border-white/10 scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <div>
            <h3 className="text-white font-bold text-base">Pay Advance</h3>
            <p className="text-slate-500 text-xs">Booking ID: <span className="text-emerald-400 font-mono">{bookingId}</span></p>
          </div>
          <button onClick={onClose} className="w-8 h-8 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>

        {step === 'pay' && (
          <div className="p-5 space-y-5">
            {/* Amount */}
            <div className="glass-green rounded-2xl p-4 text-center">
              <p className="text-slate-400 text-xs mb-1">Advance Amount to Pay</p>
              <p className="text-3xl font-bold gradient-text">₹{pricing?.advance?.toLocaleString()}</p>
              <p className="text-slate-500 text-xs mt-1">Balance ₹{pricing?.balance?.toLocaleString()} payable at venue</p>
            </div>

            {/* QR Code placeholder */}
            <div className="glass rounded-2xl p-4 text-center border border-white/8">
              <div className="w-32 h-32 mx-auto glass rounded-xl flex items-center justify-center mb-3">
                <QrCode size={60} className="text-emerald-500/60" />
              </div>
              <p className="text-white font-semibold text-xs mb-1">Scan QR to Pay</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-slate-400 text-xs font-mono">{upiId}</span>
                <button onClick={copyUPI} className={`text-xs px-2 py-0.5 rounded-md transition ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'glass text-slate-400 hover:text-white'}`}>
                  {copied ? <Check size={11} /> : 'Copy'}
                </button>
              </div>
            </div>

            {/* UPI apps */}
            <div>
              <p className="text-slate-500 text-xs mb-2 text-center">Or pay via</p>
              <div className="grid grid-cols-4 gap-2">
                {UPI_APPS.map(app => (
                  <button key={app.name} className={`bg-gradient-to-b ${app.color} rounded-xl p-2.5 flex flex-col items-center gap-1 hover:scale-105 transition-transform`}>
                    <span className="text-white text-xs font-bold">{app.initials}</span>
                    <span className="text-white/80 text-[9px] font-semibold">{app.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setStep('upload')} className="btn-primary w-full py-3.5 text-sm">
              I've Paid — Upload Screenshot →
            </button>
          </div>
        )}

        {step === 'upload' && (
          <div className="p-5 space-y-4">
            <div className="text-center mb-2">
              <p className="text-white font-semibold text-sm">Upload Payment Screenshot</p>
              <p className="text-slate-500 text-xs mt-1">Share your payment proof to confirm the booking</p>
            </div>

            <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={handleFileChange} />

            {screenshot ? (
              <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30">
                <img src={screenshot} alt="Screenshot" className="w-full max-h-48 object-cover" />
                <button onClick={() => setScreenshot(null)} className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-lg flex items-center justify-center text-white">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button onClick={() => fileRef.current.click()}
                className="w-full border-2 border-dashed border-white/15 hover:border-emerald-500/40 rounded-2xl p-8 flex flex-col items-center gap-3 text-slate-500 hover:text-slate-300 transition-all">
                <Upload size={28} />
                <div className="text-sm">Click to upload screenshot</div>
                <div className="text-xs opacity-60">PNG, JPG supported</div>
              </button>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep('pay')} className="btn-ghost flex-1 py-3 text-sm">← Back</button>
              <button
                onClick={handleConfirm}
                disabled={!screenshot || uploading}
                className="btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {uploading ? <><Loader size={15} className="animate-spin" /> Verifying</> : 'Confirm ✓'}
              </button>
            </div>

            <div className="flex items-start gap-2 text-xs text-slate-600">
              <AlertCircle size={13} className="shrink-0 mt-0.5" />
              Booking is reserved while payment is being verified. You'll get WhatsApp confirmation shortly.
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-7 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center glow-green">
              <Check size={28} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Payment Received!</h3>
              <p className="text-slate-400 text-sm mt-1">Advance of <span className="text-emerald-400 font-bold">₹{pricing?.advance}</span> confirmed</p>
            </div>
            <button onClick={onDone} className="btn-primary w-full py-3.5 text-sm">View Booking Details</button>
          </div>
        )}
      </div>
    </div>
  )
}
