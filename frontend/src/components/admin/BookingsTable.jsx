import { useState } from 'react'
import { Search, Filter, ChevronDown, Phone, Calendar, Clock } from 'lucide-react'

export default function BookingsTable({ bookings = [] }) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')

  const filtered = bookings
    .filter(b => {
      const q = search.toLowerCase()
      return !q || b.name?.toLowerCase().includes(q) || b.id?.toLowerCase().includes(q) || b.whatsapp?.includes(q) || b.date?.includes(q)
    })
    .sort((a, b) => sort === 'newest'
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
    )

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-3 border-b border-white/6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, ID, phone or date…"
            className="input-field pl-10 py-2.5 text-sm"
          />
        </div>
        <div className="relative">
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="input-field py-2.5 text-sm pr-8 appearance-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/6 text-left">
              {['Booking ID','Customer','Date & Time','Total','Advance','Balance','Booked At'].map(h => (
                <th key={h} className="px-5 py-3.5 text-xs text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-600 text-sm">
                  {search ? 'No bookings match your search.' : 'No bookings yet.'}
                </td>
              </tr>
            ) : filtered.map(b => (
              <tr key={b.id} className="border-b border-white/4 table-row-hover transition-colors">
                <td className="px-5 py-4 font-mono text-emerald-400 font-semibold text-xs">{b.id}</td>
                <td className="px-5 py-4">
                  <div className="text-white font-medium text-sm">{b.name}</div>
                  <div className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                    <Phone size={10} /> {b.whatsapp}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1 text-slate-300 text-xs">
                    <Calendar size={11} /> {b.date}
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                    <Clock size={11} /> {b.time}
                  </div>
                </td>
                <td className="px-5 py-4 text-white font-semibold">₹{b.totalRate?.toLocaleString()}</td>
                <td className="px-5 py-4 text-emerald-400 font-semibold">₹{b.advancePaid?.toLocaleString()}</td>
                <td className="px-5 py-4 text-amber-400 font-semibold">₹{b.balanceDue?.toLocaleString()}</td>
                <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">
                  {b.createdAt ? new Date(b.createdAt).toLocaleString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      <div className="px-5 py-3 border-t border-white/6 text-xs text-slate-600">
        Showing {filtered.length} of {bookings.length} bookings
      </div>
    </div>
  )
}
