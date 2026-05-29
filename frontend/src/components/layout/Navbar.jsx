import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Zap, Trophy, Calendar, User } from 'lucide-react'

const links = [
  { label: 'Home', href: '/' },
  { label: 'Book Now', href: '/booking' },
  { label: 'Tournaments', href: '/tournaments' },
  { label: 'My Bookings', href: '/my-bookings' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => setOpen(false), [location])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-dark shadow-2xl' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center pulse-glow">
                <Zap size={16} className="text-white" fill="white" />
              </div>
              <div className="text-left">
                <span className="font-sport text-xl font-bold text-white tracking-wide leading-none block">GreenField</span>
                <span className="text-[10px] text-emerald-400 font-semibold tracking-widest leading-none block">ARENA</span>
              </div>
            </button>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-6">
              {links.map(l => (
                <button
                  key={l.href}
                  onClick={() => navigate(l.href)}
                  className={`nav-link ${location.pathname === l.href ? 'text-white' : ''}`}
                >
                  {l.label}
                  {location.pathname === l.href && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => navigate('/admin')}
                className="text-xs text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-white/5 flex items-center gap-1.5"
              >
                <User size={13} /> Admin
              </button>
              <button
                onClick={() => navigate('/booking')}
                className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2"
              >
                <Calendar size={14} /> Book Slot
              </button>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen(o => !o)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl glass text-slate-300"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-72 glass-dark border-l border-white/8 transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-5 border-b border-white/8">
            <span className="font-sport text-lg font-bold text-white">Menu</span>
            <button onClick={() => setOpen(false)} className="text-slate-400"><X size={20} /></button>
          </div>
          <div className="p-4 space-y-1">
            {links.map(l => (
              <button
                key={l.href}
                onClick={() => navigate(l.href)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === l.href ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'text-slate-300 hover:bg-white/5'}`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className="p-4 pt-2 space-y-3">
            <button onClick={() => navigate('/booking')} className="btn-primary w-full py-3 text-sm text-center">
              Book a Slot
            </button>
            <button onClick={() => navigate('/admin')} className="btn-ghost w-full py-3 text-sm text-center">
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
