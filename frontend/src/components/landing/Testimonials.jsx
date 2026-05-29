import { TESTIMONIALS } from '../../data/mockData'
import { Quote } from 'lucide-react'

function Stars({ n }) {
  return (
    <div className="flex gap-1">
      {Array(5).fill(0).map((_, i) => (
        <span key={i} className={i < n ? 'star-filled' : 'star-empty'}>★</span>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 bg-[#060a0e]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 badge-green px-4 py-1.5 rounded-full text-xs font-semibold mb-4">PLAYER REVIEWS</div>
          <h2 className="font-sport text-4xl sm:text-5xl font-bold text-white mb-4">
            LOVED BY <span className="gradient-text">THOUSANDS</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
            Real players, real experiences. See why GreenField Arena is rated Bengaluru's top turf venue.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className="glass rounded-2xl p-6 card-hover flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <Stars n={t.rating} />
                <Quote size={20} className="text-emerald-500/30" />
              </div>
              <p className="text-slate-300 text-sm leading-relaxed flex-1">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/6">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center text-white text-xs font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{t.name}</div>
                  <div className="text-slate-500 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall rating */}
        <div className="mt-10 glass-green rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
          <div>
            <div className="font-sport text-5xl font-bold gradient-text mb-1">4.9</div>
            <Stars n={5} />
            <div className="text-slate-400 text-xs mt-1">Based on 320+ reviews</div>
          </div>
          <div className="hidden sm:block w-px h-16 bg-white/10" />
          <div className="grid grid-cols-3 gap-6">
            {[['Google Maps', '4.9★'],['Zomato Events', '4.8★'],['Word of Mouth', '5.0★']].map(([l,r])=>(
              <div key={l}>
                <div className="text-white font-bold text-lg">{r}</div>
                <div className="text-slate-500 text-xs">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
