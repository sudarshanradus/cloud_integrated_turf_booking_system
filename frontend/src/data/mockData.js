export const SLOT_TIMES = [
  '6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM',
  '12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM',
  '6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM','11:00 PM',
];

export const AMENITIES = [
  { icon: 'Lightbulb', title: 'LED Floodlights', desc: 'Play under high-intensity floodlights for perfect night matches.' },
  { icon: 'Car', title: 'Free Parking', desc: 'Ample parking space for bikes and cars, available 24/7.' },
  { icon: 'Droplets', title: 'Clean Washrooms', desc: 'Modern, well-maintained shower and washroom facilities.' },
  { icon: 'Droplet', title: 'Drinking Water', desc: 'Chilled RO drinking water station inside the arena.' },
  { icon: 'Armchair', title: 'Seating Area', desc: 'Comfortable seating gallery for spectators and supporters.' },
  { icon: 'Trophy', title: 'FIFA-Grade Turf', desc: 'International standard artificial grass with shock absorption.' },
  { icon: 'DoorOpen', title: 'Changing Rooms', desc: 'Private changing rooms for both teams, secured lockers.' },
  { icon: 'Wifi', title: 'Free Wi-Fi', desc: 'High-speed Wi-Fi available throughout the arena premises.' },
];

export const GALLERY_IMAGES = [
  { id: 1, label: 'Main Arena', image: '/images/mainarea.webp' },
  { id: 2, label: 'Night Matches', image: '/images/nightplay.jpg' },
  { id: 3, label: 'Premium Turf', image: '/images/luxury.jpg' },
  { id: 4, label: 'Changing Rooms', image: '/images/changingroom.jpg' },
  { id: 5, label: 'Spectator Stand', image: '/images/spectatorstand.jpg' },
  { id: 6, label: 'Tournaments', image: '/images/tournaments.jpg' },
];

export const TESTIMONIALS = [
  { name: 'Arjun Mehta', role: 'Football Captain, Bengaluru FC Amateur', rating: 5, text: 'Best turf in the city! The floodlights are insane and the pitch quality is top-notch. Booking was super easy.' },
  { name: 'Priya Sharma', role: 'Fitness Enthusiast', rating: 5, text: 'Love the WhatsApp confirmation system. Booked a slot in 2 minutes! The ground is always clean and well-maintained.' },
  { name: 'Rahul Verma', role: 'Corporate Team Outing Organizer', rating: 5, text: 'GreenField Arena is our go-to venue for corporate matches. Professional setup, great amenities, and fair pricing.' },
  { name: 'Sneha Patel', role: 'Sports Coach', rating: 4, text: 'Excellent facility with consistent quality. The advance booking system works flawlessly. Highly recommended.' },
];

export const FAQS = [
  { q: 'How do I book a slot?', a: 'Select your preferred date, pick a time slot from the grid, fill in your name and WhatsApp number, and complete the advance payment via UPI. You\'ll get instant WhatsApp confirmation.' },
  { q: 'What is the cancellation policy?', a: 'Cancellations made more than 2 hours before the slot start time are eligible for a full refund. Late cancellations forfeit the advance amount.' },
  { q: 'What are the pricing rates?', a: 'Weekday slots are ₹1,000/hour. Weekend (Saturday & Sunday) slots are ₹1,300/hour. A 20% advance is required to confirm the booking.' },
  { q: 'Can I block multiple slots?', a: 'Currently, one slot per booking. For bulk bookings (tournaments, events), contact us directly on WhatsApp for special packages.' },
  { q: 'What payment methods are accepted?', a: 'We accept all UPI apps — Google Pay, PhonePe, Paytm, and any UPI ID. Cash payments at the venue are also accepted for walk-ins.' },
  { q: 'Is the turf available on holidays?', a: 'Yes! We are open 365 days a year, 6AM to 11PM. Holiday slots have weekend pricing.' },
];

export const MOCK_BOOKINGS = [
  { id: 'GF001A', date: '2026-05-26', time: '7:00 PM', name: 'Arjun Mehta', whatsapp: '9876543210', totalRate: 1300, advancePaid: 260, balanceDue: 1040, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'GF002B', date: '2026-05-26', time: '8:00 PM', name: 'Priya Sharma', whatsapp: '8765432109', totalRate: 1300, advancePaid: 260, balanceDue: 1040, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'GF003C', date: '2026-05-27', time: '6:00 AM', name: 'Rahul Verma', whatsapp: '7654321098', totalRate: 1000, advancePaid: 200, balanceDue: 800, createdAt: new Date(Date.now() - 10800000).toISOString() },
  { id: 'GF004D', date: '2026-05-27', time: '9:00 AM', name: 'Sneha Patel', whatsapp: '6543210987', totalRate: 1000, advancePaid: 200, balanceDue: 800, createdAt: new Date(Date.now() - 14400000).toISOString() },
  { id: 'GF005E', date: '2026-05-28', time: '6:00 PM', name: 'Karthik R', whatsapp: '9988776655', totalRate: 1000, advancePaid: 200, balanceDue: 800, createdAt: new Date(Date.now() - 18000000).toISOString() },
];

export const TOURNAMENTS = [
  {
    id: 1, name: '5-A-Side Premier Cup', date: '2026-06-15', prize: '₹25,000', teams: 12, maxTeams: 16,
    status: 'registering', fee: '₹2,000/team', format: '5-a-Side',
    fixtures: [
      { team1: 'Thunder FC', team2: 'Speed Stars', time: '9:00 AM', status: 'upcoming' },
      { team1: 'Green Warriors', team2: 'Arena Kings', time: '10:00 AM', status: 'upcoming' },
    ],
    leaderboard: [
      { rank: 1, team: 'Thunder FC', played: 3, won: 3, points: 9 },
      { rank: 2, team: 'Speed Stars', played: 3, won: 2, points: 6 },
      { rank: 3, team: 'Green Warriors', played: 3, won: 1, points: 3 },
    ]
  },
  {
    id: 2, name: 'Monsoon Blitz Tournament', date: '2026-07-20', prize: '₹15,000', teams: 6, maxTeams: 8,
    status: 'upcoming', fee: '₹1,500/team', format: '7-a-Side',
    fixtures: [], leaderboard: []
  },
];

export const REVENUE_DATA = [
  { day: 'Mon', revenue: 8000, bookings: 8 },
  { day: 'Tue', revenue: 6500, bookings: 6 },
  { day: 'Wed', revenue: 9200, bookings: 9 },
  { day: 'Thu', revenue: 7800, bookings: 7 },
  { day: 'Fri', revenue: 11000, bookings: 10 },
  { day: 'Sat', revenue: 15600, bookings: 12 },
  { day: 'Sun', revenue: 18200, bookings: 14 },
];
