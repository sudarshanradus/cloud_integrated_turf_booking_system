import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BookingPage from './pages/BookingPage'
import AdminPage from './pages/AdminPage'
import MyBookingsPage from './pages/MyBookingsPage'
import TournamentPage from './pages/TournamentPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/my-bookings" element={<MyBookingsPage />} />
      <Route path="/tournaments" element={<TournamentPage />} />
    </Routes>
  )
}
