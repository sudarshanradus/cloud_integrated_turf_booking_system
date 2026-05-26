import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white">
      <header className="flex items-center justify-between px-8 py-5">
        <h1 className="text-2xl font-bold tracking-tight">GreenField Arena</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/my-bookings')}
            className="text-sm text-green-300 hover:text-white transition"
          >
            My Bookings
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="text-sm text-green-300 hover:text-white transition"
          >
            Admin
          </button>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          Book Your<span className="text-green-400"> Turf</span> Instantly
        </h2>
        <p className="text-lg md:text-xl text-green-200 max-w-2xl mx-auto mb-12">
          Premium 5-a-side football turf at GreenField Arena. Top-quality artificial grass,
          floodlights, and changing rooms. Reserve your slot in seconds.
        </p>
        <button
          onClick={() => navigate('/booking')}
          className="bg-green-500 hover:bg-green-400 text-black font-bold px-10 py-4 rounded-xl text-lg shadow-lg shadow-green-500/30 transition transform hover:scale-105"
        >
          Book Now
        </button>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20 grid md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
          <div className="text-4xl mb-3">🏟️</div>
          <h3 className="text-xl font-semibold mb-2">World-Class Turf</h3>
          <p className="text-green-200 text-sm">FIFA-quality artificial grass with proper shock absorption.</p>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
          <div className="text-4xl mb-3">💡</div>
          <h3 className="text-xl font-semibold mb-2">Floodlit Evenings</h3>
          <p className="text-green-200 text-sm">Play under lights with full brightness across the pitch.</p>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
          <div className="text-4xl mb-3">🚿</div>
          <h3 className="text-xl font-semibold mb-2">Changing Rooms</h3>
          <p className="text-green-200 text-sm">Clean showers and changing facilities included.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h3 className="text-3xl font-bold mb-6 text-center">Find Us</h3>
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
          <div className="aspect-video bg-green-800/50 rounded-xl flex items-center justify-center text-green-300">
            <iframe
              title="Location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=77.594562%2C12.971598%2C77.634562%2C12.991598&amp;layer=mapnik"
              className="w-full h-full rounded-xl border-0"
              loading="lazy"
            />
          </div>
          <p className="mt-4 text-green-200 text-center">
            📍 123 Sports Complex, Main Road, Bengaluru – 560001
          </p>
        </div>
      </section>

      <footer className="text-center py-8 text-green-500 text-sm border-t border-green-800/50">
        &copy; 2026 GreenField Arena. All rights reserved.
      </footer>
    </div>
  )
}
