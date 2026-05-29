import { useState, useEffect } from 'react'
import { Save, Info } from 'lucide-react'

const TOKEN = 'admin-token-123'

export default function PricingManager() {
  const [settings, setSettings] = useState({ weekdayRate: 1000, weekendRate: 1300, advanceType: 'percent', advanceValue: 20 })
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/settings?token=${TOKEN}`).then(r => r.json()).then(setSettings).catch(() => {})
  }, [])

  const save = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: TOKEN, ...settings }),
      })
      const d = await res.json()
      if (res.ok) setMsg({ type: 'success', text: 'Settings saved successfully!' })
      else setMsg({ type: 'error', text: d.error })
    } catch { setMsg({ type: 'error', text: 'Failed to save' }) }
    finally {
      setLoading(false)
      setTimeout(() => setMsg(null), 3000)
    }
  }

  const adv = settings.advanceType === 'percent'
    ? { wd: Math.round(settings.weekdayRate * settings.advanceValue / 100), we: Math.round(settings.weekendRate * settings.advanceValue / 100) }
    : { wd: Number(settings.advanceValue), we: Number(settings.advanceValue) }

  return (
    <div className="glass rounded-2xl p-6 space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-1">Pricing Configuration</h3>
        <p className="text-slate-500 text-xs">Changes apply to all future bookings immediately.</p>
      </div>

      {msg && (
        <div className={`px-4 py-3 rounded-xl text-sm ${msg.type === 'success' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'}`}>
          {msg.text}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {[['Weekday Rate (₹)', 'weekdayRate'],['Weekend Rate (₹)', 'weekendRate']].map(([label, key]) => (
          <div key={key}>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{label}</label>
            <input
              type="number"
              value={settings[key]}
              onChange={e => setSettings(s => ({ ...s, [key]: Number(e.target.value) }))}
              className="input-field"
            />
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Advance Type</label>
          <select value={settings.advanceType} onChange={e => setSettings(s => ({ ...s, advanceType: e.target.value }))}
            className="input-field appearance-none" style={{background:'#0f1923'}}>
            <option value="percent">Percentage (%)</option>
            <option value="fixed">Fixed Amount (₹)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {settings.advanceType === 'percent' ? 'Advance Percentage (%)' : 'Advance Amount (₹)'}
          </label>
          <input
            type="number"
            value={settings.advanceValue}
            onChange={e => setSettings(s => ({ ...s, advanceValue: Number(e.target.value) }))}
            className="input-field"
          />
        </div>
      </div>

      {/* Preview */}
      <div className="glass-green rounded-2xl p-4 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-3">
          <Info size={13} /> Live Preview
        </div>
        {[['Weekday', settings.weekdayRate, adv.wd], ['Weekend', settings.weekendRate, adv.we]].map(([l,r,a]) => (
          <div key={l} className="flex justify-between text-sm">
            <span className="text-slate-400">{l} Slot</span>
            <span>
              <span className="text-white font-semibold">₹{r?.toLocaleString()}</span>
              <span className="text-slate-500"> → Advance </span>
              <span className="text-emerald-400 font-semibold">₹{a?.toLocaleString()}</span>
            </span>
          </div>
        ))}
      </div>

      <button onClick={save} disabled={loading} className="btn-primary px-6 py-3 text-sm flex items-center gap-2">
        <Save size={15} /> {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  )
}
