import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Admin() {
  const navigate = useNavigate()
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')
  const [blockDate, setBlockDate] = useState(new Date().toISOString().split('T')[0])
  const [adminSlots, setAdminSlots] = useState([])
  const [successMsg, setSuccessMsg] = useState('')
  const [activeTab, setActiveTab] = useState('schedule')
  const [cancellations, setCancellations] = useState([])
  const token = 'admin-token-123'

  const [settings, setSettings] = useState({ weekdayRate: 1000, weekendRate: 1300, advanceType: 'percent', advanceValue: 20 })

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setLoggedIn(true)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    if (!loggedIn) return
    fetch(`/api/admin/bookings?token=${token}`)
      .then((r) => r.json())
      .then(setBookings)
      .catch(() => setError('Failed to load bookings'))
  }, [loggedIn])

  useEffect(() => {
    if (!loggedIn) return
    fetch(`/api/admin/settings?token=${token}`)
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {})
  }, [loggedIn])

  useEffect(() => {
    if (!loggedIn) return
    fetch(`/api/admin/cancellations?token=${token}`)
      .then((r) => r.json())
      .then(setCancellations)
      .catch(() => {})
  }, [loggedIn])

  useEffect(() => {
    if (!loggedIn) return
    fetch(`/api/admin/slots?token=${token}&date=${blockDate}`)
      .then((r) => r.json())
      .then((data) => setAdminSlots(data.slots))
      .catch(() => {})
  }, [loggedIn, blockDate])

  const handleSaveSettings = async () => {
    setError('')
    setSuccessMsg('')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...settings }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccessMsg('Settings saved')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleBlockSlot = async (time) => {
    setError('')
    setSuccessMsg('')
    try {
      const res = await fetch('/api/admin/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, date: blockDate, time }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccessMsg(`Blocked ${time} on ${blockDate}`)
      setAdminSlots((prev) =>
        prev.map((s) => (s.time === time ? { ...s, blocked: true } : s))
      )
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleUnblockSlot = async (time) => {
    setError('')
    setSuccessMsg('')
    try {
      const res = await fetch('/api/admin/unblock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, date: blockDate, time }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccessMsg(`Unblocked ${time} on ${blockDate}`)
      setAdminSlots((prev) =>
        prev.map((s) => (s.time === time ? { ...s, blocked: false } : s))
      )
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(''), 3000)
    }
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur rounded-2xl p-8 max-w-sm w-full mx-4">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-gray-700">
        <button onClick={() => navigate('/')} className="text-green-300 hover:text-white transition text-sm">
          &larr; Home
        </button>
        <h1 className="text-lg font-bold">Admin Dashboard</h1>
        <button
          onClick={() => setLoggedIn(false)}
          className="text-sm text-red-400 hover:text-red-300 transition"
        >
          Logout
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-4 flex gap-1 border-b border-gray-800 overflow-x-auto">
        {['schedule', 'pricing', 'bookings', 'cancellations'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg text-sm font-semibold capitalize whitespace-nowrap transition ${
              activeTab === tab
                ? 'bg-green-500/20 text-green-300 border-b-2 border-green-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab === 'schedule' ? 'Daily Schedule' : tab === 'pricing' ? 'Pricing Settings' : tab === 'bookings' ? 'All Bookings' : 'Cancellations'}
          </button>
        ))}
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-900/40 text-red-300 px-4 py-3 rounded-xl text-sm mb-6">{error}</div>
        )}
        {successMsg && (
          <div className="bg-green-900/40 text-green-300 px-4 py-3 rounded-xl text-sm mb-6">{successMsg}</div>
        )}

        {activeTab === 'schedule' && (
          <section className="bg-white/5 backdrop-blur rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Daily Schedule &amp; Manual Override</h2>
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Select Date</label>
              <input
                type="date"
                value={blockDate}
                onChange={(e) => setBlockDate(e.target.value)}
                className="w-full max-w-xs px-4 py-2.5 rounded-xl bg-white/5 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {adminSlots.map((slot) => {
                const isBlocked = slot.blocked
                const isBooked = slot.booked
                return (
                  <div
                    key={slot.time}
                    className={`
                      rounded-xl p-3 text-xs border transition
                      ${isBlocked
                        ? 'bg-red-900/30 border-red-800 text-red-300'
                        : isBooked
                          ? 'bg-gray-800 border-gray-700 text-gray-400'
                          : 'bg-green-900/30 border-green-800 text-green-200'
                      }
                    `}
                  >
                    <div className="font-semibold text-sm mb-1">{slot.time}</div>
                    <div className="text-[10px] opacity-70 mb-2">
                      {isBlocked ? 'Blocked' : isBooked ? `Booked by ${slot.name || '—'}` : 'Available'}
                    </div>
                    {isBlocked && (
                      <button
                        onClick={() => handleUnblockSlot(slot.time)}
                        className="text-[10px] bg-green-700/60 hover:bg-green-600 text-white px-2 py-1 rounded-lg w-full transition"
                      >
                        Unblock
                      </button>
                    )}
                    {!isBlocked && !isBooked && (
                      <button
                        onClick={() => handleBlockSlot(slot.time)}
                        className="text-[10px] bg-red-800/60 hover:bg-red-700 text-red-200 px-2 py-1 rounded-lg w-full transition"
                      >
                        Block
                      </button>
                    )}
                    {isBooked && (
                      <div className="text-[10px] text-gray-500 italic">Customer booked</div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {activeTab === 'pricing' && (
          <section className="bg-white/5 backdrop-blur rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Pricing Settings</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Weekday Rate (₹)</label>
                <input
                  type="number"
                  value={settings.weekdayRate}
                  onChange={(e) => setSettings({ ...settings, weekdayRate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Weekend Rate (₹)</label>
                <input
                  type="number"
                  value={settings.weekendRate}
                  onChange={(e) => setSettings({ ...settings, weekendRate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Advance Type</label>
                <select
                  value={settings.advanceType}
                  onChange={(e) => setSettings({ ...settings, advanceType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="percent" style={{ color: 'white', background: '#1f2937' }}>Percentage (%)</option>
                  <option value="fixed" style={{ color: 'white', background: '#1f2937' }}>Fixed Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  {settings.advanceType === 'percent' ? 'Advance Percentage (%)' : 'Advance Amount (₹)'}
                </label>
                <input
                  type="number"
                  value={settings.advanceValue}
                  onChange={(e) => setSettings({ ...settings, advanceValue: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <button
              onClick={handleSaveSettings}
              className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-2.5 rounded-xl transition text-sm"
            >
              Save Settings
            </button>
          </section>
        )}

        {activeTab === 'bookings' && (
          <section className="bg-white/5 backdrop-blur rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">All Bookings ({bookings.length})</h2>
            {bookings.length === 0 ? (
              <p className="text-gray-400 text-sm">No bookings yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-400 uppercase text-xs">
                      <th className="pb-3 pr-4">ID</th>
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3 pr-4">Time</th>
                      <th className="pb-3 pr-4">Name</th>
                      <th className="pb-3 pr-4">WhatsApp</th>
                      <th className="pb-3 pr-4">Total</th>
                      <th className="pb-3">Booked At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-b border-gray-800">
                        <td className="py-3 pr-4 font-mono text-green-400">{b.id}</td>
                        <td className="py-3 pr-4">{b.date}</td>
                        <td className="py-3 pr-4">{b.time}</td>
                        <td className="py-3 pr-4">{b.name}</td>
                        <td className="py-3 pr-4">{b.whatsapp}</td>
                        <td className="py-3 pr-4">₹{b.totalRate}</td>
                        <td className="py-3">{new Date(b.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
        {activeTab === 'cancellations' && (
          <section className="bg-white/5 backdrop-blur rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Cancellations ({cancellations.length})</h2>
            {cancellations.length === 0 ? (
              <p className="text-gray-400 text-sm">No cancellations yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-400 uppercase text-xs">
                      <th className="pb-3 pr-4">Booking ID</th>
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3 pr-4">Time</th>
                      <th className="pb-3 pr-4">Name</th>
                      <th className="pb-3 pr-4">WhatsApp</th>
                      <th className="pb-3 pr-4">Advance</th>
                      <th className="pb-3 pr-4">Refund</th>
                      <th className="pb-3 pr-4">Within 2hr</th>
                      <th className="pb-3">Override</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cancellations.map((c) => (
                      <tr key={c.bookingId} className="border-b border-gray-800">
                        <td className="py-3 pr-4 font-mono text-green-400">{c.bookingId}</td>
                        <td className="py-3 pr-4">{c.date}</td>
                        <td className="py-3 pr-4">{c.time}</td>
                        <td className="py-3 pr-4">{c.name}</td>
                        <td className="py-3 pr-4">{c.whatsapp}</td>
                        <td className="py-3 pr-4">₹{c.advancePaid}</td>
                        <td className="py-3 pr-4">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            c.refundIssued
                              ? 'bg-green-900/60 text-green-300'
                              : 'bg-red-900/60 text-red-300'
                          }`}>
                            {c.refundIssued ? 'Issued' : 'Forfeited'}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`text-xs ${c.withinTwoHours ? 'text-red-400' : 'text-green-400'}`}>
                            {c.withinTwoHours ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="py-3">
                          <button
                            onClick={async () => {
                              try {
                                const res = await fetch('/api/admin/refund-override', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ token, bookingId: c.bookingId, refundIssued: !c.refundIssued }),
                                })
                                const data = await res.json()
                                if (!res.ok) throw new Error(data.error)
                                setCancellations((prev) =>
                                  prev.map((x) => x.bookingId === c.bookingId ? { ...x, refundIssued: data.refundIssued } : x)
                                )
                                setSuccessMsg(`Refund override applied for ${c.bookingId}`)
                                setTimeout(() => setSuccessMsg(''), 3000)
                              } catch (err) {
                                setError(err.message)
                                setTimeout(() => setError(''), 3000)
                              }
                            }}
                            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded-lg transition"
                          >
                            Toggle
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
