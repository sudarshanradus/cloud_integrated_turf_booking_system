import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, BookOpen, XCircle, Settings, LogOut,
  DollarSign, Users, TrendingUp, Clock, Menu, X, Zap, ChevronRight, Activity
} from 'lucide-react'
import StatCard from '../components/admin/StatCard'
import RevenueChart from '../components/admin/RevenueChart'
import BookingsTable from '../components/admin/BookingsTable'
import SlotManager from '../components/admin/SlotManager'
import PricingManager from '../components/admin/PricingManager'
import { MOCK_BOOKINGS } from '../data/mockData'
import { API_BASE_URL } from '../config';

// --- CONFIGURATION ---
// const API_BASE_URL = "http://40.192.37.27:3001";
const TOKEN = 'admin-token-123'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'schedule', label: 'Daily Schedule', icon: Calendar },
  { id: 'bookings', label: 'All Bookings', icon: BookOpen },
  { id: 'cancellations', label: 'Cancellations', icon: XCircle },
  { id: 'pricing', label: 'Pricing', icon: DollarSign },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function AdminPage() {
  const navigate = useNavigate()
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [bookings, setBookings] = useState([])
  const [cancellations, setCancellations] = useState([])

  const login = async (e) => {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ username, password }) 
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      setLoggedIn(true)
    } catch (err) { setLoginError(err.message) }
  }

  useEffect(() => {
    if (!loggedIn) return
    fetch(`${API_BASE_URL}/api/admin/bookings?token=${TOKEN}`)
      .then(r => r.json())
      .then(d => setBookings(Array.isArray(d) ? d : MOCK_BOOKINGS))
      .catch(() => setBookings(MOCK_BOOKINGS))
    
    fetch(`${API_BASE_URL}/api/admin/cancellations?token=${TOKEN}`)
      .then(r => r.json())
      .then(d => setCancellations(Array.isArray(d) ? d : []))
      .catch(() => {})
  }, [loggedIn])

  const todayStr = new Date().toISOString().split('T')[0]
  const todayBookings = bookings.filter(b => b.date === todayStr)
  const todayRevenue = todayBookings.reduce((s, b) => s + (b.advancePaid || 0), 0)
  const occupancy = Math.round((todayBookings.length / 18) * 100)

  // ─── Login Screen ───
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-[#080c10] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-green-700 flex items-center justify-center mb-4 glow-green">
              <Zap size={28} className="text-white" fill="white" />
            </div>
            <h1 className="font-sport text-3xl font-bold text-white">ADMIN LOGIN</h1>
            <p className="text-slate-500 text-sm mt-1">GreenField Arena Management</p>
          </div>

          <div className="glass rounded-3xl p-8 border border-white/8">
            <form onSubmit={login} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                  className="input-field" placeholder="admin" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className="input-field" placeholder="••••••••" required />
              </div>
              {loginError && <p className="text-red-400 text-xs bg-red-500/10 px-3 py-2 rounded-lg">{loginError}</p>}
              <button type="submit" className="btn-primary w-full py-4 text-sm mt-2">Sign In to Dashboard</button>
            </form>
            <div className="mt-4 text-center text-xs text-slate-600">
              Default: admin / admin123
            </div>
          </div>

          <button onClick={() => navigate('/')} className="mt-4 w-full text-center text-slate-600 hover:text-slate-400 text-sm transition">
            ← Back to Arena
          </button>
        </div>
      </div>
    )
  }

  // ─── Dashboard ───
  return (
    <div className="min-h-screen bg-[#080c10] flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed top-0 left-0 h-full w-64 glass-dark border-r border-white/6 z-40 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        <div className="p-5 border-b border-white/6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <div>
              <div className="font-sport text-base font-bold text-white leading-none">GreenField</div>
              <div className="text-[10px] text-emerald-400 font-semibold tracking-widest">ADMIN</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500"><X size={18} /></button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setActiveTab(id); setSidebarOpen(false) }}
              className={`sidebar-link w-full ${activeTab === id ? 'active' : ''}`}>
              <Icon size={16} />
              {label}
              {activeTab === id && <ChevronRight size={13} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/6 space-y-2">
          <button onClick={() => navigate('/')} className="sidebar-link w-full text-emerald-600 hover:text-emerald-400">
            <Zap size={15} /> View Arena Site
          </button>
          <button onClick={() => setLoggedIn(false)} className="sidebar-link w-full text-red-500 hover:text-red-400">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="glass-dark border-b border-white/6 px-4 sm:px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400">
            <Menu size={18} />
          </button>
          <div className="flex-1">
            <h2 className="text-white font-bold text-base capitalize">
              {NAV.find(n => n.id === activeTab)?.label}
            </h2>
            <p className="text-slate-500 text-xs">{new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-slate-400 text-xs hidden sm:block">Live</span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Today's Revenue" value={`₹${todayRevenue.toLocaleString()}`} sub="Advance collected" icon={DollarSign} trendVal="+12%" trend="up" />
                <StatCard title="Today's Bookings" value={todayBookings.length} sub={`of 18 slots`} icon={BookOpen} iconBg="bg-blue-500/15" iconColor="text-blue-400" trendVal="+3" trend="up" />
                <StatCard title="Occupancy" value={`${occupancy}%`} sub="Today" icon={Activity} iconBg="bg-purple-500/15" iconColor="text-purple-400" />
                <StatCard title="Cancellations" value={cancellations.length} sub="All time" icon={XCircle} iconBg="bg-red-500/15" iconColor="text-red-400" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2"><RevenueChart /></div>
                <div className="glass rounded-2xl p-5 space-y-4">
                  <h3 className="text-white font-semibold text-sm">Peak Hours Today</h3>
                  {['6:00 PM','7:00 PM','8:00 PM','9:00 PM'].map((t, i) => (
                    <div key={t} className="flex items-center gap-3">
                      <span className="text-slate-400 text-xs w-16">{t}</span>
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="progress-bar h-full rounded-full" style={{ width: `${90 - i*15}%` }} />
                      </div>
                      <span className="text-emerald-400 text-xs font-semibold">{90-i*15}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <h3 className="text-white font-semibold text-sm mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {bookings.slice(0, 5).map(b => (
                    <div key={b.id} className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">
                        {b.name?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-white font-medium truncate block">{b.name}</span>
                        <span className="text-slate-500 text-xs">{b.date} · {b.time}</span>
                      </div>
                      <span className="text-emerald-400 font-semibold text-xs shrink-0">₹{b.advancePaid}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && <SlotManager />}

          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">All Bookings</h3>
                  <p className="text-slate-500 text-xs mt-0.5">{bookings.length} total bookings</p>
                </div>
              </div>
              <BookingsTable bookings={bookings} />
            </div>
          )}

          {activeTab === 'cancellations' && (
            <div className="glass rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-white/6">
                <h3 className="text-white font-semibold">Cancellations &amp; Refunds</h3>
                <p className="text-slate-500 text-xs mt-0.5">{cancellations.length} cancellations</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/6">
                      {['ID','Customer','Date','Time','Advance','Refund','Within 2hr','Override'].map(h => (
                        <th key={h} className="px-5 py-3.5 text-xs text-slate-500 font-semibold uppercase tracking-wider text-left whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cancellations.length === 0 ? (
                      <tr><td colSpan={8} className="text-center py-10 text-slate-600 text-sm">No cancellations yet</td></tr>
                    ) : cancellations.map(c => (
                      <tr key={c.bookingId} className="border-b border-white/4 table-row-hover">
                        <td className="px-5 py-4 font-mono text-emerald-400 text-xs font-semibold">{c.bookingId}</td>
                        <td className="px-5 py-4 text-white">{c.name}</td>
                        <td className="px-5 py-4 text-slate-400 text-xs">{c.date}</td>
                        <td className="px-5 py-4 text-slate-400 text-xs">{c.time}</td>
                        <td className="px-5 py-4 text-white">₹{c.advancePaid}</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${c.refundIssued ? 'badge-green' : 'badge-red'}`}>
                            {c.refundIssued ? 'Issued' : 'Forfeited'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-semibold ${c.withinTwoHours ? 'text-red-400' : 'text-emerald-400'}`}>
                            {c.withinTwoHours ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={async () => {
                              const res = await fetch(`${API_BASE_URL}/api/admin/refund-override`, { 
                                method:'POST', 
                                headers:{'Content-Type':'application/json'}, 
                                body:JSON.stringify({token:TOKEN,bookingId:c.bookingId,refundIssued:!c.refundIssued}) 
                              })
                              const d = await res.json()
                              if (res.ok) setCancellations(p => p.map(x => x.bookingId===c.bookingId ? {...x,refundIssued:d.refundIssued} : x))
                            }}
                            className="text-xs glass hover:bg-white/8 text-slate-300 px-3 py-1.5 rounded-lg transition"
                          >
                            Toggle
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && <PricingManager />}

          {activeTab === 'settings' && (
            <div className="max-w-lg space-y-5">
              <div className="glass rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Account Settings</h3>
                <div className="space-y-4">
                  {[['Arena Name','GreenField Arena'],['Location','Bengaluru, Karnataka'],['Contact Number','+91 98765 43210']].map(([l,v])=>(
                    <div key={l}>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{l}</label>
                      <input defaultValue={v} className="input-field text-sm" />
                    </div>
                  ))}
                  <button className="btn-primary py-3 px-6 text-sm">Save Changes</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}