import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export default function PaymentModal({ bookingId, pricing, onClose }) {
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      setShowConfirmation(true)
      QRCode.toDataURL(`Booking: ${bookingId}`, { width: 200, margin: 2 }, (err, url) => {
        if (!err) setQrDataUrl(url)
      })
    }, 2000)
    return () => clearTimeout(timer)
  }, [bookingId])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-green-700 rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
        {loading ? (
          <div className="py-12">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-green-200 text-lg">Processing payment...</p>
          </div>
        ) : showConfirmation ? (
          <div>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
            <p className="text-green-300 text-sm mb-4">
              Your slot has been successfully booked.
            </p>
            <div className="bg-white/5 rounded-xl p-4 mb-4">
              <p className="text-xs text-green-400 uppercase tracking-wider mb-1">Booking ID</p>
              <p className="text-2xl font-mono font-bold text-green-400">{bookingId}</p>
            </div>
            {pricing && (
              <div className="bg-white/5 rounded-xl p-3 mb-4 text-sm space-y-1">
                <div className="flex justify-between text-green-200">
                  <span>Total Price</span>
                  <span className="font-bold text-white">₹{pricing.totalRate}</span>
                </div>
                <div className="flex justify-between text-green-200">
                  <span>Advance Paid</span>
                  <span className="font-bold text-green-400">₹{pricing.advance}</span>
                </div>
                <div className="flex justify-between text-green-200 border-t border-green-800 pt-1">
                  <span>Balance at Turf</span>
                  <span className="font-bold text-white">₹{pricing.balance}</span>
                </div>
              </div>
            )}
            {qrDataUrl && (
              <img src={qrDataUrl} alt="QR Code" className="w-32 h-32 mx-auto mb-4" />
            )}
            <p className="text-xs text-green-500 mb-6">Show this QR at the venue</p>
            <button
              onClick={onClose}
              className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-3 rounded-xl transition"
            >
              Done
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
