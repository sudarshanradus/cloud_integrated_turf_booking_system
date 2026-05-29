import { MapPin, Phone, Clock } from 'lucide-react'

export default function MapSection() {
  return (
    <section id="location" className="py-24 px-4 sm:px-6 bg-[#060a0e]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 badge-green px-4 py-1.5 rounded-full text-xs font-semibold mb-4">FIND US</div>
          <h2 className="font-sport text-4xl sm:text-5xl font-bold text-white mb-4">
            LOCATED IN THE <span className="gradient-text">HEART OF BLR</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Info Cards */}
          <div className="space-y-4">
            {[
              { icon: MapPin, title: 'Address', lines: ['123 Sports Complex,', 'Main Road, Koramangala,', 'Bengaluru – 560001'] },
              { icon: Phone, title: 'Contact', lines: ['+91 98765 43210', 'hello@greenfieldarena.in'] },
              { icon: Clock, title: 'Hours', lines: ['Mon – Sun: 6:00 AM – 11:00 PM', '365 days a year'] },
            ].map(({ icon: Icon, title, lines }) => (
              <div key={title} className="glass rounded-2xl p-5 flex gap-4 items-start">
                <div className="w-10 h-10 glass-green rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-emerald-400" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm mb-1">{title}</div>
                  {lines.map(l => <div key={l} className="text-slate-400 text-xs leading-relaxed">{l}</div>)}
                </div>
              </div>
            ))}

            <a
              href="https://maps.google.com/?q=Koramangala+Bengaluru"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
            >
              <MapPin size={14} /> Get Directions
            </a>
          </div>

          {/* Map */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-white/8 h-80 lg:h-[400px]">
            <iframe
              title="GreenField Arena Location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=77.594562%2C12.931598%2C77.634562%2C12.971598&layer=mapnik&marker=12.952598%2C77.614562"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
