import { GALLERY_IMAGES } from '../../data/mockData'

export default function Gallery() {
  return (
    <section id="gallery" className="py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 badge-green px-4 py-1.5 rounded-full text-xs font-semibold mb-4">ARENA GALLERY</div>
          <h2 className="font-sport text-4xl sm:text-5xl font-bold text-white mb-4">
            FEEL THE <span className="gradient-text">ATMOSPHERE</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
            Step inside GreenField Arena and experience a world-class football destination.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={img.id}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer border border-white/6 hover:border-emerald-500/30 transition-all duration-500 ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              style={{ minHeight: i === 0 ? '380px' : '180px' }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url(${img.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-400" />
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
                <span className="text-white font-bold text-sm tracking-wide">{img.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}