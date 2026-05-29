import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { TOURNAMENTS } from '../data/mockData'
import { Trophy, Users, Calendar, ArrowLeft, ChevronDown, ChevronUp, Medal, Target, MessageCircle, Circle, Crown } from 'lucide-react'

function RegistrationModal({ tournament, onClose }) {
  const [form, setForm] = useState({ teamName: '', captain: '', phone: '', players: '' })
  const [done, setDone] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setTimeout(() => setDone(true), 800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm fade-in">
      <div className="glass rounded-3xl max-w-md w-full p-7 scale-in border border-emerald-500/20 max-h-[90vh] overflow-y-auto">
        {done ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 glow-green">
              <Trophy size={28} className="text-emerald-400" />
            </div>
              <h3 className="text-white font-bold text-xl mb-2">Team Registered!</h3>
            <p className="text-slate-400 text-sm mb-1">{form.teamName}</p>
            <p className="text-slate-500 text-xs">You'll receive WhatsApp confirmation shortly.</p>
            <button onClick={onClose} className="btn-primary mt-6 px-8 py-3 text-sm">Done</button>
          </div>
        ) : (
          <>
            <h3 className="text-white font-bold text-lg mb-1">Register Your Team</h3>
            <p className="text-slate-400 text-sm mb-5">{tournament.name} · Entry Fee: {tournament.fee}</p>
            <form onSubmit={submit} className="space-y-4">
              {[['Team Name','teamName','e.g. Thunder FC'],['Captain Name','captain','Full name'],['Captain WhatsApp','phone','10-digit number'],['Players (comma separated)','players','Player 1, Player 2...']].map(([l,k,p])=>(
                <div key={k}>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{l}</label>
                  <input value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} placeholder={p} required
                    className="input-field text-sm" />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="btn-ghost flex-1 py-3 text-sm">Cancel</button>
                <button type="submit" className="btn-primary flex-1 py-3 text-sm">Register →</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

function TournamentCard({ t, onRegister }) {
  const [expanded, setExpanded] = useState(false)
  const spotsLeft = t.maxTeams - t.teams
  const pct = Math.round((t.teams / t.maxTeams) * 100)

  return (
    <div className="tournament-card rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 ${t.status === 'registering' ? 'badge-green' : 'badge-blue'}`}>
              <Circle size={8} fill="currentColor" />
              {t.status === 'registering' ? 'REGISTRATION OPEN' : 'COMING SOON'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-amber-400">
            <Trophy size={18} />
            <span className="font-bold text-lg gradient-text-gold">{t.prize}</span>
          </div>
        </div>

        <h3 className="font-sport text-2xl font-bold text-white mb-1">{t.name}</h3>
        <div className="flex flex-wrap gap-4 text-xs text-slate-400 mb-4">
          <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(t.date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</span>
          <span className="flex items-center gap-1"><Target size={12}/> {t.format}</span>
          <span className="flex items-center gap-1"><Users size={12}/> {t.teams}/{t.maxTeams} Teams</span>
        </div>

        {/* Registration progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-500">Registration Progress</span>
            <span className="text-emerald-400 font-semibold">{spotsLeft} spots left</span>
          </div>
          <div className="h-2 bg-white/8 rounded-full overflow-hidden">
            <div className="progress-bar h-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="flex gap-3">
          {t.status === 'registering' && (
            <button onClick={() => onRegister(t)} className="btn-primary flex-1 py-3 text-sm">
              Register Team · {t.fee}
            </button>
          )}
          <button onClick={() => setExpanded(e=>!e)} className="btn-ghost px-4 py-3 text-sm flex items-center gap-1">
            Details {expanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
          </button>
        </div>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div className="border-t border-white/6 p-6 sm:p-7 space-y-6 fade-in">
          {/* Fixtures */}
          {t.fixtures.length > 0 && (
            <div>
              <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                <Target size={14} className="text-emerald-400" /> Match Fixtures
              </h4>
              <div className="space-y-2.5">
                {t.fixtures.map((f, i) => (
                  <div key={i} className="glass rounded-xl p-4 flex items-center justify-between gap-4 text-sm">
                    <span className="text-white font-semibold flex-1 text-right">{f.team1}</span>
                    <div className="text-center">
                      <div className="text-emerald-400 font-bold text-xs">VS</div>
                      <div className="text-slate-500 text-[10px] mt-0.5">{f.time}</div>
                    </div>
                    <span className="text-white font-semibold flex-1">{f.team2}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${f.status==='upcoming' ? 'badge-blue' : 'badge-green'}`}>{f.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leaderboard */}
          {t.leaderboard.length > 0 && (
            <div>
              <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                <Medal size={14} className="text-amber-400" /> Standings
              </h4>
              <div className="glass rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/6 text-left">
                      {['#','Team','P','W','Pts'].map(h=>(
                        <th key={h} className="px-4 py-2.5 text-xs text-slate-500 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.leaderboard.map(row=>(
                      <tr key={row.rank} className={`border-b border-white/4 ${row.rank===1?'bg-amber-500/5':''}`}>
                        <td className="px-4 py-3">
                          <span className={`font-bold text-sm ${row.rank===1?'text-amber-400':row.rank===2?'text-slate-300':'text-slate-500'}`}>
                            {row.rank===1 ? <Crown size={16} /> : row.rank===2 ? <Medal size={16} /> : <Medal size={16} />}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-white font-medium">{row.team}</td>
                        <td className="px-4 py-3 text-slate-400">{row.played}</td>
                        <td className="px-4 py-3 text-slate-400">{row.won}</td>
                        <td className="px-4 py-3 text-emerald-400 font-bold">{row.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function TournamentPage() {
  const navigate = useNavigate()
  const [registerTarget, setRegisterTarget] = useState(null)

  return (
    <div className="min-h-screen bg-[#080c10]">
      <Navbar />

      {/* Hero banner */}
      <div className="relative pt-16 pb-12 border-b border-white/6 overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{backgroundImage:'linear-gradient(rgba(245,158,11,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(245,158,11,0.5) 1px,transparent 1px)',backgroundSize:'50px 50px'}}
        />
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10" style={{background:'radial-gradient(circle,#f59e0b,transparent 70%)'}} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 relative z-10">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm mb-6">
            <ArrowLeft size={15} /> Back to Arena
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Trophy size={20} className="text-amber-400" />
            </div>
            <span className="badge-yellow px-3 py-1 rounded-full text-xs font-bold">TOURNAMENTS</span>
          </div>
          <h1 className="font-sport text-4xl sm:text-6xl font-bold text-white mb-3">
            COMPETE. WIN. <span className="gradient-text-gold">DOMINATE.</span>
          </h1>
          <p className="text-slate-400 text-base max-w-2xl">
            Register your team for upcoming tournaments at GreenField Arena. Compete for cash prizes, trophies, and the title of Bengaluru's best.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white font-semibold">{TOURNAMENTS.length} Tournaments</h2>
          <span className="badge-green px-3 py-1 rounded-full text-xs font-semibold">{TOURNAMENTS.filter(t=>t.status==='registering').length} Open</span>
        </div>
        {TOURNAMENTS.map(t => (
          <TournamentCard key={t.id} t={t} onRegister={setRegisterTarget} />
        ))}

        {/* CTA */}
        <div className="glass-green rounded-3xl p-8 text-center mt-8">
          <Trophy size={32} className="mx-auto text-amber-400 mb-3" />
          <h3 className="font-sport text-2xl font-bold text-white mb-2">Want to Host a Tournament?</h3>
          <p className="text-slate-400 text-sm mb-5 max-w-md mx-auto">
            We offer exclusive packages for corporate events, school tournaments, and open championships. Contact us for custom pricing.
          </p>
          <a href="https://wa.me/919876543210?text=Hi!%20I%20want%20to%20host%20a%20tournament%20at%20GreenField%20Arena"
            target="_blank" rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-sm">
            <MessageCircle size={16} /> Contact Us on WhatsApp
          </a>
        </div>
      </div>

      <Footer />

      {registerTarget && <RegistrationModal tournament={registerTarget} onClose={() => setRegisterTarget(null)} />}
    </div>
  )
}
