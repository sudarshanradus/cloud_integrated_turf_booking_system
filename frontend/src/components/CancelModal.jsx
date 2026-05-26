import { useState } from 'react'

function getDiffMinutes(dateStr, timeStr) {
  const [time, modifier] = timeStr.split(' ')
  let [h, m] = time.split(':').map(Number)
  if (modifier === 'PM' && h !== 12) h += 12
  if (modifier === 'AM' && h === 12) h = 0
  const slotStart = new Date(`${dateStr}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`)
  return (slotStart - new Date()) / (1000 * 60)
}

export default function CancelModal({ booking, onConfirm, onClose, loading }) {
  const diff = getDiffMinutes(booking.date, booking.time)
  const eligibleForRefund = diff > 120

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-red-800/50 rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl">
        <div className="text-center mb-4">
          <div className="text-4xl mb-3">{eligibleForRefund ? '🔄' : '⚠️'}</div>
          <h3 className="text-lg font-bold text-white mb-1">Cancel Booking?</h3>
          <p className="text-sm text-gray-400">
            {booking.date} &middot; {booking.time}
          </p>
        </div>

        {eligibleForRefund ? (
          <div className="bg-green-900/30 rounded-xl p-3 mb-4 text-sm text-center">
            <p className="text-green-300">
              Full refund of <span className="font-bold text-green-400">₹{booking.advancePaid}</span> will be initiated.
            </p>
          </div>
        ) : (
          <div className="bg-red-900/30 rounded-xl p-3 mb-4 text-sm text-center">
            <p className="text-red-300">
              Cancellation is within 2 hours of the slot. <span className="font-bold">No refund</span> will be provided.
            </p>
            <p className="text-red-400 text-xs mt-1">The slot will be made available for others.</p>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 rounded-xl text-sm transition disabled:opacity-50"
          >
            Keep Booking
          </button>
          <button
            onClick={() => onConfirm(booking.id)}
            disabled={loading}
            className="flex-[2] bg-red-600 hover:bg-red-500 disabled:bg-red-800 text-white font-bold py-2.5 rounded-xl text-sm transition disabled:opacity-50"
          >
            {loading ? 'Cancelling...' : 'Yes, Cancel'}
          </button>
        </div>
      </div>
    </div>
  )
}
