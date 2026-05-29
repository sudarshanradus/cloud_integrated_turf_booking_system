import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ title, value, sub, icon: Icon, iconBg = 'bg-emerald-500/20', iconColor = 'text-emerald-400', trend, trendVal }) {
  const up = trend === 'up'
  return (
    <div className="stat-card p-5 rounded-2xl flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1.5">{title}</p>
        <p className="text-white text-2xl font-bold font-sport truncate">{value}</p>
        {sub && <p className="text-slate-600 text-xs mt-1">{sub}</p>}
        {trendVal && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${up ? 'text-emerald-400' : 'text-red-400'}`}>
            {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trendVal} vs last week
          </div>
        )}
      </div>
      <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center shrink-0`}>
        <Icon size={20} className={iconColor} />
      </div>
    </div>
  )
}
