import { useState, useEffect } from 'react'
import { Lock, Unlock, Calendar, RefreshCw, Circle, Bookmark, Check } from 'lucide-react'
import { API_BASE_URL } from '../../config';
// --- CONFIGURATION ---
// const API_BASE_URL = "http://40.192.37.27:3001";
const TOKEN = 'admin-token-123'

const SLOT_TIMES = ['6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM','11:00 PM']

export default function SlotManager() {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [slots, setSlots] = useState([])
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  const load = () => {
    setLoading(true)
    // Updated to use EC2 IP
    fetch(`${API_BASE_URL}/api/admin/slots?token=${TOKEN}&date=${date}`)
      .then(r => r.json())
      .then(d => setSlots(d.slots || []))
      .catch(() => setMsg({ type: 'error', text: 'Failed to load slots' }))
      .finally(() => setLoading(false))
  }

  useEffect(load, [date])

  const flash = (type, text) => {
    setMsg({ type, text })
    setTimeout(() => setMsg(null), 3000)
  }

  const block = async (time) => {
    // Updated to use EC2 IP
    const res = await fetch(`${API_BASE_URL}/api/admin/block`, { 
      method: 'POST', 
      headers: { 'Content-Type':'application/json' }, 
      body: JSON.stringify({ token: TOKEN, date, time }) 
    })
    const d = await res.json()
    if (res.ok) { 
      setSlots(p => p.map(s => s.time === time ? { ...s, blocked: true } : s))
      flash('success', `Blocked ${time}`) 
    }
    else flash('error', d.error)
  }

  const unblock = async (time) => {
    // Updated to use EC2 IP
    const res = await fetch(`${API_BASE_URL}/api/admin/unblock`, { 
      method: 'POST', 
      headers: { 'Content-Type':'application/json' }, 
      body: JSON.stringify({ token: TOKEN, date, time }) 
    })
    const d = await res.json()
    if (res.ok) { 
      setSlots(p => p.map(s => s.time === time ? { ...s, blocked: false } : s))
      flash('success', `Unblocked ${time}`) 
    }
    else flash('error', d.error)
  }

  const booked = slots.filter(s => s.booked).length
  const blocked = slots.filter(s => s.blocked).length
  const available = SLOT_TIMES.length - booked - blocked

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="glass rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="flex items-center gap-2 flex-1">
            <Calendar size={16} className="text-emerald-400 shrink-0" />
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="input-field py-2 text-sm flex-1" />
          </div>
          <button onClick={load} className="btn-ghost px-4 py-2 text-sm flex items-center gap-2 shrink-0">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {/* Day stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          {[['Available', available, 'text-emerald-400'],['Booked', booked, 'text-red-400'],['Blocked', blocked, 'text-amber-400']].map(([l,v,c])=>(
            <div key={l} className="glass rounded-xl py-3">
              <div className={`text-xl font-bold font-sport ${c}`}>{v}</div>
              <div className="text-slate-500 text-xs">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {msg && (
        <div className={`px-4 py-3 rounded-xl text-sm flex items-center gap-2 ${msg.type === 'success' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'}`}>
          {msg.text}
        </div>
      )}

      {/* Slot grid */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-white font-semibold text-sm mb-4">Slot Management</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {SLOT_TIMES.map(time => {
            const slot = slots.find(s => s.time === time) || { time, booked: false, blocked: false }
            return (
              <div key={time} className={`rounded-xl p-3 border text-xs transition-all
                ${slot.booked ? 'bg-red-500/8 border-red-500/20' : slot.blocked ? 'bg-amber-500/8 border-amber-500/20' : 'bg-emerald-500/8 border-emerald-500/20'}`}>
                <div className="font-bold text-white text-sm mb-0.5">{time.split(' ')[0]}</div>
                <div className="text-[10px] opacity-60 mb-2">{time.split(' ')[1]}</div>
                <div className={`text-[10px] font-semibold mb-2 flex items-center gap-1 ${slot.booked ? 'text-red-400' : slot.blocked ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {slot.booked ? <><Bookmark size={9} /> {slot.name || 'Booked'}</> : slot.blocked ? <><Lock size={9} /> Blocked</> : <><Check size={9} /> Free</>}
                </div>
                {!slot.booked && (
                  slot.blocked ? (
                    <button onClick={() => unblock(time)} className="w-full text-[10px] bg-emerald-700/40 hover:bg-emerald-600/60 text-emerald-300 px-2 py-1 rounded-lg transition flex items-center justify-center gap-1">
                      <Unlock size={9} /> Unblock
                    </button>
                  ) : (
                    <button onClick={() => block(time)} className="w-full text-[10px] bg-amber-700/40 hover:bg-amber-600/60 text-amber-300 px-2 py-1 rounded-lg transition flex items-center justify-center gap-1">
                      <Lock size={9} /> Block
                    </button>
                  )
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}