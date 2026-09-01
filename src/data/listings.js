// Demo dataset for the CeylonHub prototype. In production this comes from the
// listings API; shapes here mirror the intended API contract.

export const CATEGORIES = [
  { slug: 'vehicles', name: 'Vehicles', emoji: '🚗', tagline: 'Cars, vans, SUVs, bikes & three-wheelers', gradient: ['#0ea5e9', '#0d7a6f'] },
  { slug: 'rentals', name: 'Vehicle Rentals', emoji: '🔑', tagline: 'Self-drive, with driver, weddings & tours', gradient: ['#8b5cf6', '#0d7a6f'] },
  { slug: 'property', name: 'Property', emoji: '🏠', tagline: 'Houses, apartments, land & commercial', gradient: ['#f59e0b', '#b45309'] },
  { slug: 'home-living', name: 'Home & Living', emoji: '🛋️', tagline: 'Furniture, appliances & décor', gradient: ['#f43f5e', '#9f1239'] },
  { slug: 'electronics', name: 'Electronics', emoji: '📱', tagline: 'Phones, laptops, TVs & certified refurbished', gradient: ['#6366f1', '#312e81'] },
]

export const DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Galle', 'Matara', 'Kurunegala',
  'Anuradhapura', 'Jaffna', 'Batticaloa', 'Negombo', 'Ratnapura',
]

export function formatLKR(n) {
  if (n >= 1_000_000) {
    const m = n / 1_000_000
    return `Rs. ${m % 1 === 0 ? m.toFixed(0) : m.toFixed(2)} M`
  }
  return `Rs. ${n.toLocaleString('en-LK')}`
}

export const DEAL_LABELS = {
  great: { label: 'GREAT PRICE', cls: 'badge-deal-great', blurb: 'below the CeylonHub Fair Price index for comparable listings' },
  good: { label: 'GOOD PRICE', cls: 'badge-deal-good', blurb: 'slightly below market for comparable listings' },
  fair: { label: 'FAIR PRICE', cls: 'badge-deal-fair', blurb: 'in line with the market for comparable listings' },
  high: { label: 'ABOVE MARKET', cls: 'badge-deal-high', blurb: 'above the CeylonHub Fair Price index — worth negotiating' },
}

export const LISTINGS = [
  // ── Vehicles ──
  {
    id: 'v1', cat: 'vehicles', icon: '🚙', title: 'Toyota Aqua G Grade 2019 — Hybrid',
    price: 11250000, location: 'Colombo', posted: '2 hours ago',
    verified: true, inspected: true, escrow: true, featured: true, deal: 'great',
    seller: 'Prime Auto Traders (Dealer · 4.8★ · 212 sales)',
    specs: { Make: 'Toyota', Model: 'Aqua G', Year: '2019', Mileage: '48,000 km', Fuel: 'Hybrid', Transmission: 'Auto', 'Engine': '1,500 cc' },
    inspection: { score: 92, engine: 'Excellent', body: 'Minor scratch — rear bumper', hybrid: 'Battery health 91%', accident: 'No accident history found' },
    desc: 'First owner, full Toyota Lanka service history. CeylonHub 220-point inspection completed at our Nugegoda centre. Hybrid battery health report attached.',
  },
  {
    id: 'v2', cat: 'vehicles', icon: '🚗', title: 'Suzuki Wagon R FX 2018',
    price: 6850000, location: 'Gampaha', posted: '5 hours ago',
    verified: true, inspected: true, escrow: true, deal: 'good',
    seller: 'K. Perera (NIC verified · 4.9★)',
    specs: { Make: 'Suzuki', Model: 'Wagon R FX', Year: '2018', Mileage: '62,500 km', Fuel: 'Petrol', Transmission: 'Auto', Engine: '660 cc' },
    inspection: { score: 88, engine: 'Very good', body: 'Original paint, no repaints detected', hybrid: 'N/A', accident: 'No accident history found' },
    desc: 'Lady-driven, garaged. Leasing can be arranged through CeylonHub Finance partners — see monthly estimate below.',
  },
  {
    id: 'v3', cat: 'vehicles', icon: '🛻', title: 'Toyota Hilux Rocco 2021 4x4',
    price: 24500000, location: 'Kandy', posted: '1 day ago',
    verified: true, inspected: false, escrow: true, deal: 'fair',
    seller: 'Hillside Motors (Dealer · 4.6★)',
    specs: { Make: 'Toyota', Model: 'Hilux Rocco', Year: '2021', Mileage: '35,000 km', Fuel: 'Diesel', Transmission: 'Auto', Engine: '2,800 cc' },
    desc: 'Company-maintained pickup. Book a CeylonHub mobile inspection before purchase — inspector visits the seller within 48 hours.',
  },
  {
    id: 'v4', cat: 'vehicles', icon: '🏍️', title: 'Yamaha FZ-S V3 2022',
    price: 1265000, location: 'Kurunegala', posted: '3 hours ago',
    verified: true, inspected: false, escrow: true, deal: 'good',
    seller: 'S. Fernando (NIC verified)',
    specs: { Make: 'Yamaha', Model: 'FZ-S V3', Year: '2022', Mileage: '9,800 km', Fuel: 'Petrol', Transmission: 'Manual', Engine: '149 cc' },
    desc: 'Showroom condition, first owner. All documents clear — CeylonHub title check passed.',
  },
  {
    id: 'v5', cat: 'vehicles', icon: '🚐', title: 'Toyota KDH 201 Super GL 2016',
    price: 15900000, location: 'Negombo', posted: '6 hours ago',
    verified: false, inspected: false, escrow: false, deal: 'high',
    seller: 'Unverified seller',
    specs: { Make: 'Toyota', Model: 'KDH 201', Year: '2016', Mileage: '110,000 km', Fuel: 'Diesel', Transmission: 'Manual', Engine: '3,000 cc' },
    desc: 'Dual A/C, flat roof. Note: this seller has not completed NIC verification — CeylonHub SafePay escrow is strongly recommended.',
  },
  {
    id: 'v6', cat: 'vehicles', icon: '🚗', title: 'Honda Vezel RS Sensing 2018',
    price: 13750000, location: 'Colombo', posted: '1 day ago',
    verified: true, inspected: true, escrow: true, featured: true, deal: 'fair',
    seller: 'City Auto Mart (Dealer · 4.7★ · 340 sales)',
    specs: { Make: 'Honda', Model: 'Vezel RS', Year: '2018', Mileage: '55,000 km', Fuel: 'Hybrid', Transmission: 'Auto', Engine: '1,500 cc' },
    inspection: { score: 90, engine: 'Excellent', body: 'One repainted panel — left front door', hybrid: 'Battery health 88%', accident: 'Minor repair recorded (2021)' },
    desc: 'Sensing safety package, cruise control. Inspection report and hybrid battery scan available to download.',
  },

  // ── Rentals ──
  {
    id: 'r1', cat: 'rentals', icon: '🚘', title: 'Toyota Prius 2017 — Self Drive', per: '/day',
    price: 14500, location: 'Colombo', posted: 'Available today',
    verified: true, inspected: true, escrow: true, featured: true, deal: 'good',
    seller: 'LankaRide Fleet (Host · 4.9★ · 1,120 trips)',
    specs: { Type: 'Self-drive', 'Min period': '1 day', Deposit: 'Rs. 30,000 (held in SafePay)', Insurance: 'Full comprehensive included', Fuel: 'Hybrid', Seats: '5' },
    desc: 'Unlimited 100 km/day, comprehensive insurance and 24/7 roadside assistance included. Digital handover checklist with photo record protects both sides.',
  },
  {
    id: 'r2', cat: 'rentals', icon: '🚐', title: 'KDH High Roof with Driver — Tours & Airport', per: '/day',
    price: 22000, location: 'Negombo', posted: 'Available from Sep 3',
    verified: true, inspected: true, escrow: true, deal: 'fair',
    seller: 'Ceylon Tours & Travel (Host · 4.8★)',
    specs: { Type: 'With driver', 'Min period': '1 day', Capacity: '9 + driver', 'Driver accommodation': 'Included', Languages: 'English / Sinhala', 'A/C': 'Dual' },
    desc: 'English-speaking driver, ideal for airport transfers and round-island tours. Fixed transparent pricing — no hidden fuel surcharges.',
  },
  {
    id: 'r3', cat: 'rentals', icon: '💒', title: 'BMW 730Ld — Wedding Hire with Chauffeur', per: '/event',
    price: 65000, location: 'Colombo', posted: 'Booking for Dec season',
    verified: true, inspected: false, escrow: true, deal: 'fair',
    seller: 'Elegant Wedding Cars (Host · 5.0★)',
    specs: { Type: 'Wedding / event', Package: '8 hours + décor', Chauffeur: 'Uniformed', Décor: 'Fresh flowers included', Colour: 'White', Seats: '4' },
    desc: 'Bridal car package with ribbon décor and backup vehicle guarantee. 50% via SafePay confirms your date; balance released after the event.',
  },
  {
    id: 'r4', cat: 'rentals', icon: '🛵', title: 'Honda Dio Scooters — Tourist Long-term', per: '/week',
    price: 12000, location: 'Galle', posted: 'Available today',
    verified: true, inspected: true, escrow: true, deal: 'great',
    seller: 'South Coast Rentals (Host · 4.7★ · 800 trips)',
    specs: { Type: 'Self-drive', 'Min period': '3 days', Helmet: '2 included', 'Tourist licence help': 'Yes', Delivery: 'Free within Galle Fort', Deposit: 'Rs. 15,000' },
    desc: 'Well-maintained scooter fleet for tourists. We assist with the temporary Sri Lankan riding permit. Weekly and monthly discounts.',
  },

  // ── Property ──
  {
    id: 'p1', cat: 'property', icon: '🏢', title: '3BR Luxury Apartment — Havelock City, Colombo 5',
    price: 82000000, location: 'Colombo', posted: '4 hours ago',
    verified: true, inspected: true, escrow: true, featured: true, deal: 'fair',
    seller: 'Lanka Realty (Agent · 4.8★ · licensed)',
    specs: { Type: 'Apartment', Bedrooms: '3', Bathrooms: '2', Size: '1,580 sq ft', Floor: '18', Parking: '2 slots', 'Title': 'Clear — deed verified' },
    desc: 'Fully furnished with pool, gym and 24/7 security. CeylonHub title verification completed — deed, approvals and management-fee status checked.',
  },
  {
    id: 'p2', cat: 'property', icon: '🏡', title: 'Two-Storey House — 10 Perches, Nugegoda',
    price: 58500000, location: 'Colombo', posted: '1 day ago',
    verified: true, inspected: false, escrow: true, deal: 'good',
    seller: 'W. Jayasuriya (NIC verified)',
    specs: { Type: 'House', Bedrooms: '4', Bathrooms: '3', Land: '10 perches', Built: '2016', Parking: '2 cars', Title: 'Verification in progress' },
    desc: '5 minutes to High Level Road. Direct owner sale — no broker fees. Request a CeylonHub legal title check before advancing any payment.',
  },
  {
    id: 'p3', cat: 'property', icon: '🌴', title: '25 Perch Bare Land — Digana, Kandy',
    price: 9750000, location: 'Kandy', posted: '2 days ago',
    verified: true, inspected: false, escrow: true, deal: 'great',
    seller: 'Central Lands (Agent · 4.5★)',
    specs: { Type: 'Land', Size: '25 perches', 'Price / perch': 'Rs. 390,000', Water: 'Mainline', Electricity: 'At boundary', Access: '12 ft road', Title: 'Clear — surveyed 2024' },
    desc: 'Mountain view, ideal for a holiday home. Survey plan and street-line certificates uploaded and verified.',
  },
  {
    id: 'p4', cat: 'property', icon: '🏙️', title: '2BR Apartment for Rent — Wellawatte Sea View', per: '/month',
    price: 185000, location: 'Colombo', posted: '8 hours ago',
    verified: true, inspected: true, escrow: true, deal: 'fair',
    seller: 'R. Sivakumar (NIC verified · 4.9★)',
    specs: { Type: 'Apartment — rent', Bedrooms: '2', Bathrooms: '2', Size: '1,100 sq ft', Furnished: 'Fully', 'Key money': 'None', Deposit: '2 months (SafePay held)' },
    desc: 'Sea-facing, furnished. Deposit is held in CeylonHub SafePay for the tenancy and released per the digital agreement — fair for both sides.',
  },

  // ── Home & Living ──
  {
    id: 'h1', cat: 'home-living', icon: '🛋️', title: 'Damro L-Shaped Fabric Sofa — Near New',
    price: 145000, location: 'Colombo', posted: '3 hours ago',
    verified: true, inspected: false, escrow: true, deal: 'great',
    seller: 'N. Wickramasinghe (NIC verified · 4.8★)',
    specs: { Condition: 'Used — excellent', Brand: 'Damro', Age: '8 months', Colour: 'Grey', Delivery: 'CeylonHub Delivery from Rs. 3,500', Original: 'Rs. 265,000' },
    desc: 'Moving overseas. Pay through SafePay, inspect on delivery, and release payment only when satisfied.',
  },
  {
    id: 'h2', cat: 'home-living', icon: '🧊', title: 'LG 260L Inverter Refrigerator — Brand New',
    price: 218000, location: 'Gampaha', posted: '1 day ago',
    verified: true, inspected: false, escrow: true, featured: true, deal: 'good',
    seller: 'Home Electric Hub (Shop · 4.7★ · 1,500 sales)',
    specs: { Condition: 'Brand new', Brand: 'LG', Warranty: '2 years agent warranty', Capacity: '260 L', 'Energy': 'Inverter', Delivery: 'Island-wide, 3–5 days' },
    desc: 'Authorized-import stock with agent warranty card. Koko/Mintpay instalments available at checkout.',
  },
  {
    id: 'h3', cat: 'home-living', icon: '🪑', title: 'Teak Dining Table + 6 Chairs — Moratuwa Craft',
    price: 168000, location: 'Kalutara', posted: '5 hours ago',
    verified: true, inspected: false, escrow: true, deal: 'fair',
    seller: 'Moratuwa Furniture Works (Shop · 4.9★)',
    specs: { Condition: 'Brand new', Material: 'Solid teak', Seats: '6', Finish: 'Natural matte', 'Made in': 'Moratuwa, Sri Lanka', Delivery: 'Free within Colombo/Kalutara' },
    desc: 'Handcrafted solid teak from our Moratuwa workshop. Support local craftsmanship — every CeylonHub “Made in SL” purchase is highlighted.',
  },
  {
    id: 'h4', cat: 'home-living', icon: '❄️', title: 'Midea 12000 BTU Inverter A/C with Installation',
    price: 155000, location: 'Colombo', posted: '2 days ago',
    verified: true, inspected: false, escrow: true, deal: 'good',
    seller: 'CoolTech Solutions (Shop · 4.6★)',
    specs: { Condition: 'Brand new', BTU: '12,000', Type: 'Inverter', Warranty: '1 yr full + 5 yr compressor', Installation: 'Included (Colombo)', Energy: 'R32 gas' },
    desc: 'Price includes standard installation within Colombo district. Book installation slot at checkout.',
  },

  // ── Electronics ──
  {
    id: 'e1', cat: 'electronics', icon: '📱', title: 'iPhone 14 Pro 256GB — CeylonHub Certified Refurbished',
    price: 285000, location: 'Colombo', posted: '1 hour ago',
    verified: true, inspected: true, escrow: true, featured: true, deal: 'great',
    seller: 'CeylonHub Certified (Grade A · 6-month warranty)',
    specs: { Condition: 'Certified Refurbished — Grade A', Battery: '89% health (verified)', Storage: '256 GB', Warranty: '6 months CeylonHub', 'IMEI check': 'Clean — not blacklisted', Returns: '7-day money back' },
    inspection: { score: 95, engine: '52-point diagnostic passed', body: 'Screen & body: no marks', hybrid: 'Battery 89%', accident: 'IMEI clean, iCloud unlocked' },
    desc: 'Fully tested 52-point diagnostic, genuine parts, 7-day return and 6-month warranty. Save ~Rs. 90,000 vs new.',
  },
  {
    id: 'e2', cat: 'electronics', icon: '💻', title: 'MacBook Air M2 2023 — 8GB/256GB',
    price: 365000, location: 'Colombo', posted: '4 hours ago',
    verified: true, inspected: true, escrow: true, deal: 'good',
    seller: 'T. Rajapakse (NIC verified · 4.9★)',
    specs: { Condition: 'Used — excellent', 'Cycle count': '112', Storage: '256 GB SSD', RAM: '8 GB', Warranty: 'Apple until Dec 2026', Colour: 'Midnight' },
    desc: 'Barely used, with box and original charger. Serial verified against Apple warranty database.',
  },
  {
    id: 'e3', cat: 'electronics', icon: '📺', title: 'Samsung 55" Crystal UHD 4K TV — Brand New',
    price: 265000, location: 'Kandy', posted: '1 day ago',
    verified: true, inspected: false, escrow: true, deal: 'fair',
    seller: 'Kandy Electronics (Shop · 4.7★ · 900 sales)',
    specs: { Condition: 'Brand new', Size: '55 inch', Resolution: '4K UHD', Warranty: '3 years company', Smart: 'Tizen OS', Delivery: 'Island-wide insured' },
    desc: 'Sealed box with company warranty. Insured CeylonHub Delivery — damage in transit fully covered.',
  },
  {
    id: 'e4', cat: 'electronics', icon: '🎮', title: 'PlayStation 5 Slim + 2 Controllers',
    price: 245000, location: 'Colombo', posted: '7 hours ago',
    verified: true, inspected: false, escrow: true, deal: 'good',
    seller: 'M. Iqbal (NIC verified · 4.6★)',
    specs: { Condition: 'Used — like new', Model: 'Slim Disc Edition', Storage: '1 TB', Controllers: '2 DualSense', Games: 'FC 25 disc included', Age: '10 months' },
    desc: 'Perfect condition. Meet at a CeylonHub Safe Deal Point in Colombo or use SafePay with delivery.',
  },
]

export const listingsFor = (slug) => LISTINGS.filter((l) => l.cat === slug)
export const getListing = (id) => LISTINGS.find((l) => l.id === id)
export const getCategory = (slug) => CATEGORIES.find((c) => c.slug === slug)
export const gradientFor = (cat, id) => {
  const c = getCategory(cat)
  const angle = 100 + (id.charCodeAt(1) * 37) % 160
  return `linear-gradient(${angle}deg, ${c.gradient[0]}, ${c.gradient[1]})`
}
