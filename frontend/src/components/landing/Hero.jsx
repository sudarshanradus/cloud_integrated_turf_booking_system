import { useNavigate } from 'react-router-dom'
import { ArrowRight, Play, Star, Users, Calendar, Zap, Trophy, Lightbulb, Shirt, Smartphone } from 'lucide-react'

const stats = [
  { value: '500+', label: 'Monthly Bookings', icon: Calendar },
  { value: '2,000+', label: 'Happy Players', icon: Users },
  { value: '4.9★', label: 'Average Rating', icon: Star },
]

export default function Hero() {
  const navigate = useNavigate()

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden hero-gradient pt-16">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5"
        style={{backgroundImage:'linear-gradient(rgba(16,185,129,0.5) 1px, transparent 1px),linear-gradient(90deg, rgba(16,185,129,0.5) 1px, transparent 1px)', backgroundSize:'60px 60px'}}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10"
        style={{background:'radial-gradient(circle, #10b981 0%, transparent 70%)'}}
      />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-5"
        style={{background:'radial-gradient(circle, #10b981 0%, transparent 70%)'}}
      />

      {/* Live ticker */}
      <div className="absolute top-16 left-0 right-0 bg-emerald-500/10 border-y border-emerald-500/20 overflow-hidden py-2">
        <div className="ticker-inner flex whitespace-nowrap gap-12 text-xs text-emerald-400 font-semibold tracking-wider">
          {Array(6).fill([
            { icon: Zap, text: 'BOOK YOUR SLOT NOW' },
            { icon: Trophy, text: 'WEEKEND TOURNAMENTS' },
            { icon: Lightbulb, text: 'FLOODLIT NIGHTS' },
            { icon: Shirt, text: 'FIFA-GRADE TURF' },
            { icon: Smartphone, text: 'INSTANT WHATSAPP CONFIRMATION' },
          ]).flat().map((item, i) => (
            <span key={i} className="px-4 inline-flex items-center gap-1.5">
              <item.icon size={12} className="text-emerald-400" />
              {item.text}
            </span>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto mt-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass-green px-4 py-2 rounded-full text-emerald-400 text-xs font-semibold mb-6 slide-up">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Bengaluru's #1 Premium Turf
        </div>

        {/* Headline */}
        <h1 className="font-sport text-5xl sm:text-7xl md:text-8xl font-bold text-white leading-tight mb-6 slide-up" style={{animationDelay:'0.1s'}}>
          PLAY LIKE A<br />
          <span className="gradient-text text-glow">CHAMPION</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed slide-up" style={{animationDelay:'0.2s'}}>
          FIFA-grade artificial turf · LED floodlights · Instant booking<br className="hidden sm:block" />
          Premium 5-a-side experience in the heart of Bengaluru
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center slide-up" style={{animationDelay:'0.3s'}}>
          <button
            onClick={() => navigate('/booking')}
            className="btn-primary px-8 py-4 text-base flex items-center justify-center gap-2 pulse-glow"
          >
            Book Your Slot <ArrowRight size={18} />
          </button>
          <button
            onClick={() => scrollToSection('amenities')}
            className="btn-ghost px-8 py-4 text-base flex items-center justify-center gap-2"
          >
            <Play size={16} fill="currentColor" /> Explore Arena
          </button>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto slide-up" style={{animationDelay:'0.4s'}}>
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center">
              <div className="text-2xl sm:text-3xl font-sport font-bold gradient-text mb-1">{value}</div>
              <div className="text-slate-500 text-xs sm:text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 text-xs">
        <span>Scroll to explore</span>
        <div className="w-5 h-8 rounded-full border border-slate-700 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-emerald-500 rounded-full animate-bounce" />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32" style={{background:'linear-gradient(to top, #080c10, transparent)'}} />
    </section>
  )
}
