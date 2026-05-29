import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/landing/Hero'
import Amenities from '../components/landing/Amenities'
import PricingSection from '../components/landing/PricingSection'
import Gallery from '../components/landing/Gallery'
import Testimonials from '../components/landing/Testimonials'
import FAQ from '../components/landing/FAQ'
import MapSection from '../components/landing/MapSection'
import { useNavigate } from 'react-router-dom'
import { Calendar } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#080c10] text-white">
      <Navbar />
      <Hero />
      <Amenities />
      <PricingSection />
      <Gallery />
      <Testimonials />
      <FAQ />
      <MapSection />
      <Footer />

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 md:hidden">
        <button
          onClick={() => navigate('/booking')}
          className="btn-primary px-8 py-3.5 text-sm shadow-2xl flex items-center gap-2 pulse-glow"
        >
          <Calendar size={16} /> Book a Slot
        </button>
      </div>
    </div>
  )
}
