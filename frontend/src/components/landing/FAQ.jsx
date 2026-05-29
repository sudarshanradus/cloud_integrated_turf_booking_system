import { useState } from 'react'
import { FAQS } from '../../data/mockData'
import { Plus, Minus, MessageCircle } from 'lucide-react'

export default function FAQ() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 badge-green px-4 py-1.5 rounded-full text-xs font-semibold mb-4">FAQ</div>
          <h2 className="font-sport text-4xl sm:text-5xl font-bold text-white mb-4">
            GOT <span className="gradient-text">QUESTIONS?</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">Everything you need to know about GreenField Arena.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`glass rounded-2xl overflow-hidden transition-all duration-300 border ${open === i ? 'border-emerald-500/30 glow-green-sm' : 'border-transparent'}`}
            >
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left gap-4"
              >
                <span className="text-white font-semibold text-sm sm:text-base">{faq.q}</span>
                <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${open === i ? 'bg-emerald-500 text-white' : 'glass text-slate-400'}`}>
                  {open === i ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>
              <div className={`accordion-content ${open === i ? 'open' : ''}`}>
                <p className="px-5 sm:px-6 pb-5 text-slate-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center glass-green rounded-2xl p-6">
          <p className="text-slate-300 text-sm mb-3">Still have questions? We're happy to help!</p>
          <a
            href="https://wa.me/919876543210?text=Hi!%20I%20have%20a%20question%20about%20GreenField%20Arena"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm"
          >
            <MessageCircle size={16} /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
