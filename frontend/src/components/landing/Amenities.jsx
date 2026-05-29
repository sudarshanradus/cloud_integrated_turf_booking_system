import { Lightbulb, Car, Droplets, Droplet, Armchair, Trophy, DoorOpen, Wifi } from 'lucide-react'
import { AMENITIES } from '../../data/mockData'

const ICON_MAP = { Lightbulb, Car, Droplets, Droplet, Armchair, Trophy, DoorOpen, Wifi }

export default function Amenities() {
  return (
    <section id="amenities" className="py-24 px-4 sm:px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 badge-green px-4 py-1.5 rounded-full text-xs font-semibold mb-4">
            WORLD-CLASS FACILITIES
          </div>
          <h2 className="font-sport text-4xl sm:text-5xl font-bold text-white mb-4">
            EVERYTHING YOU <span className="gradient-text">NEED</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
            GreenField Arena is designed for the complete football experience — from warm-up to final whistle.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {AMENITIES.map((item, i) => {
            const Icon = ICON_MAP[item.icon]
            return (
              <div
                key={item.title}
                className="glass rounded-2xl p-6 card-hover group cursor-default"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="w-12 h-12 rounded-xl glass-green flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {Icon && <Icon size={22} className="text-emerald-400" />}
                </div>
                <h3 className="text-white font-semibold text-sm mb-2 group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
