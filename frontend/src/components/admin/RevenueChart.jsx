import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, Area } from 'recharts'
import { REVENUE_DATA } from '../../data/mockData'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl p-3 border border-emerald-500/20 text-xs">
      <p className="text-white font-bold mb-1">{label}</p>
      <p className="text-emerald-400">Revenue: ₹{payload[0]?.value?.toLocaleString()}</p>
      <p className="text-slate-400">Bookings: {payload[1]?.value}</p>
    </div>
  )
}

export default function RevenueChart({ data = REVENUE_DATA }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-semibold text-sm">Weekly Revenue</h3>
          <p className="text-slate-500 text-xs mt-0.5">Last 7 days performance</p>
        </div>
        <div className="text-right">
          <div className="text-emerald-400 font-bold text-lg">
            ₹{data.reduce((s, d) => s + d.revenue, 0).toLocaleString()}
          </div>
          <div className="text-slate-500 text-xs">Total this week</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Area type="monotone" dataKey="revenue" fill="url(#revenueGrad)" stroke="#10b981" strokeWidth={2} />
          <Bar dataKey="bookings" fill="rgba(16,185,129,0.3)" radius={[4,4,0,0]} yAxisId={1} />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Peak info */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/6">
        <div className="text-center">
          <div className="text-white font-bold text-sm">{data.reduce((m,d)=>d.revenue>m.revenue?d:m,data[0]).day}day</div>
          <div className="text-slate-500 text-xs">Peak Day</div>
        </div>
        <div className="text-center">
          <div className="text-white font-bold text-sm">{data.reduce((s,d)=>s+d.bookings,0)}</div>
          <div className="text-slate-500 text-xs">Total Bookings</div>
        </div>
      </div>
    </div>
  )
}
