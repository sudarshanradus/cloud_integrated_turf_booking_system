import { useNavigate } from 'react-router-dom'
import { Check, Zap } from 'lucide-react'

const plans = [
  {
    label: 'Weekday',
    days: 'Mon – Fri',
    rate: 1000,
    advance: 200,
    color: 'from-slate-800 to-slate-900',
    border: 'border-white/8',
    badge: null,
    features: ['1 Hour Slot', 'Floodlit Arena', 'Changing Rooms', 'Free Parking', 'Drinking Water'],
  },
  {
    label: 'Weekend',
    days: 'Sat & Sun',
    rate: 1300,
    advance: 260,
    color: 'from-emerald-950 to-slate-900',
    border: 'border-emerald-500/30',
    badge: 'Most Popular',
    features: ['1 Hour Slot', 'Floodlit Arena', 'Changing Rooms', 'Free Parking', 'Drinking Water', 'Priority Booking'],
  },
  {
    label: 'Tournament',
    days: 'Any Day',
    rate: null,
    advance: null,
    color: 'from-yellow-950 to-slate-900',
    border: 'border-yellow-500/20',
    badge: 'Custom',
    features: ['Full Arena', 'Custom Hours', 'Referee Provided', 'Scoreboard', 'Trophy / Prizes', 'Dedicated Support'],
  },
]

export default function PricingSection() {
  const navigate = useNavigate()
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 relative">
      {/* BG accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{background:'radial-gradient(circle, #10b981 0%, transparent 70%)'}}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 badge-green px-4 py-1.5 rounded-full text-xs font-semibold mb-4">
            TRANSPARENT PRICING
          </div>
          <h2 className="font-sport text-4xl sm:text-5xl font-bold text-white mb-4">
            SIMPLE &amp; <span className="gradient-text">FAIR RATES</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
            No hidden charges. Book your slot, pay 20% advance, and settle the rest at the venue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div key={p.label} className={`relative rounded-2xl border ${p.border} bg-gradient-to-b ${p.color} p-7 flex flex-col card-hover`}>
              {p.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold ${p.label === 'Weekend' ? 'bg-emerald-500 text-white' : 'bg-yellow-500 text-black'}`}>
                  {p.badge}
                </div>
              )}

              <div className="mb-6">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{p.days}</p>
                <h3 className="font-sport text-2xl font-bold text-white mb-3">{p.label}</h3>
                {p.rate ? (
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-white">₹{p.rate.toLocaleString()}</span>
                    <span className="text-slate-400 text-sm mb-1">/ hour</span>
                  </div>
                ) : (
                  <div className="text-3xl font-bold gradient-text-gold">Contact Us</div>
                )}
                {p.advance && (
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <Zap size={11} className="text-emerald-500" />
                    Advance: ₹{p.advance} · Balance at venue
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate(p.label === 'Tournament' ? '/tournaments' : '/booking')}
                className={p.label === 'Weekend' ? 'btn-primary py-3 text-sm' : 'btn-ghost py-3 text-sm'}
              >
                {p.label === 'Tournament' ? 'Register Team' : 'Book Now'}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-600 text-xs mt-8">
          * Holiday slots are charged at Weekend rates · Prices inclusive of all taxes
        </p>
      </div>
    </section>
  )
}
