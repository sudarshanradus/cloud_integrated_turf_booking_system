import { useNavigate } from 'react-router-dom'
import { Zap, Share2, MessageCircle, Play, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  const navigate = useNavigate()
  return (
    <footer className="border-t border-white/6 bg-[#060a0e]">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <div>
              <span className="font-sport text-xl font-bold text-white tracking-wide block leading-none">GreenField</span>
              <span className="text-[10px] text-emerald-400 font-semibold tracking-widest block">ARENA</span>
            </div>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            Premium 5-a-side football turf at Bengaluru's finest sports complex. Book, play, dominate.
          </p>
          <div className="flex gap-3">
            {[Share2, MessageCircle, Play].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Quick Links</h4>
          <ul className="space-y-2.5">
            {[['Home','/'],['Book a Slot','/booking'],['My Bookings','/my-bookings'],['Tournaments','/tournaments'],['Admin Panel','/admin']].map(([l,h]) => (
              <li key={h}>
                <button onClick={() => navigate(h)} className="text-slate-500 hover:text-emerald-400 text-sm transition-colors">
                  {l}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Opening Hours</h4>
          <ul className="space-y-2.5 text-sm">
            {[['Monday – Friday','6:00 AM – 11:00 PM'],['Saturday','6:00 AM – 11:00 PM'],['Sunday','6:00 AM – 11:00 PM'],['Public Holidays','6:00 AM – 11:00 PM']].map(([d,t]) => (
              <li key={d} className="flex justify-between gap-4">
                <span className="text-slate-500">{d}</span>
                <span className="text-emerald-400 font-medium whitespace-nowrap">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Contact Us</h4>
          <ul className="space-y-3">
            {[
              [MapPin, '123 Sports Complex, Main Road, Bengaluru – 560001'],
              [Phone, '+91 98765 43210'],
              [Mail, 'hello@greenfieldarena.in'],
            ].map(([Icon, text], i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-500">
                <Icon size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/6 py-5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <span>© 2026 GreenField Arena. All rights reserved.</span>
          <span className="inline-flex items-center gap-1">Made with <Zap size={11} className="text-emerald-500" /> for football lovers</span>
        </div>
      </div>
    </footer>
  )
}
