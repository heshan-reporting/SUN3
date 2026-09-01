// Seed dataset for the Live Market Feed.
//
// WHY THIS EXISTS: the target commercial sites (riyasewana, patpat) block
// automated access from datacenter IPs with HTTP 403, and autostream's
// robots.txt disallows its listing paths. CeylonHub's crawler honours all of
// that (it will not spoof browsers to defeat bot protection). Until compliant
// data access exists — a partnership, an official feed, or a source that
// permits crawling — this seed populates the database and JSON exports so the
// pipeline, UI, images and price-history mechanics are fully demonstrable.
//
// Records here are clearly labelled with source suffix "-sample" and carry
// real royalty-free images (Unsplash). Run: node scraper/cli.js --seed
//
// Prices reflect the 2026 Sri Lankan market documented in docs/research/.

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=640&q=70`

export const SEED = [
  // ── Vehicles ──
  { source: 'riyasewana-sample', category: 'vehicles', subcategory: 'car', title: 'Toyota Aqua G Grade 2019', priceText: 'Rs. 11,450,000', location: 'Colombo', url: 'https://riyasewana.com/', imageUrl: img('photo-1549317661-bd32c8ce0db2') },
  { source: 'riyasewana-sample', category: 'vehicles', subcategory: 'car', title: 'Suzuki Wagon R FX 2018', priceText: 'Rs. 6,850,000', location: 'Gampaha', url: 'https://riyasewana.com/', imageUrl: img('photo-1503376780353-7e6692767b70') },
  { source: 'riyasewana-sample', category: 'vehicles', subcategory: 'car', title: 'Honda Vezel RS Sensing 2018', priceText: 'Rs. 13,750,000', location: 'Colombo', url: 'https://riyasewana.com/', imageUrl: img('photo-1568844293986-8d0400bd4745') },
  { source: 'riyasewana-sample', category: 'vehicles', subcategory: 'suv', title: 'Toyota Hilux Rocco 2021 4x4', priceText: 'Rs. 24,500,000', location: 'Kandy', url: 'https://riyasewana.com/', imageUrl: img('photo-1559416523-140ddc3d238c') },
  { source: 'riyasewana-sample', category: 'vehicles', subcategory: 'motorcycle', title: 'Yamaha FZ-S V3 2022', priceText: 'Rs. 1,265,000', location: 'Kurunegala', url: 'https://riyasewana.com/', imageUrl: img('photo-1558981403-c5f9899a28bc') },
  { source: 'patpat-sample', category: 'vehicles', subcategory: 'van', title: 'Toyota KDH 201 Super GL 2016', priceText: 'Rs. 15,900,000', location: 'Negombo', url: 'https://patpat.lk/en', imageUrl: img('photo-1616789916437-bbf724d10dae') },
  { source: 'patpat-sample', category: 'vehicles', subcategory: 'car', title: 'Toyota Prius 2017 Hybrid', priceText: 'Rs. 14,500,000', location: 'Colombo', url: 'https://patpat.lk/en', imageUrl: img('photo-1621007947382-bb3c3994e3fb') },
  { source: 'patpat-sample', category: 'vehicles', subcategory: 'car', title: 'Nissan Leaf 2018 EV', priceText: 'Rs. 9,800,000', location: 'Gampaha', url: 'https://patpat.lk/en', imageUrl: img('photo-1593941707882-a5bba14938c7') },
  { source: 'autostream-sample', category: 'vehicles', subcategory: 'car', title: 'Honda Fit GP5 2015', priceText: 'Rs. 9,250,000', location: 'Colombo', url: 'https://www.autostream.lk/', imageUrl: img('photo-1580273916550-e323be2ae537') },
  { source: 'autostream-sample', category: 'vehicles', subcategory: 'car', title: 'Toyota Aqua S 2018', priceText: 'Rs. 10,900,000', location: 'Matara', url: 'https://www.autostream.lk/', imageUrl: img('photo-1552519507-da3b142c6e3d') },
  { source: 'autostream-sample', category: 'vehicles', subcategory: 'suv', title: 'Mitsubishi Montero Sport 2020', priceText: 'Rs. 32,750,000', location: 'Colombo', url: 'https://www.autostream.lk/', imageUrl: img('photo-1533473359331-0135ef1b58bf') },
  { source: 'riyasewana-sample', category: 'vehicles', subcategory: 'three-wheeler', title: 'Bajaj RE Three Wheeler 2019', priceText: 'Rs. 1,450,000', location: 'Ratnapura', url: 'https://riyasewana.com/', imageUrl: img('photo-1610476905287-e4c92c1d0b58') },

  // ── Property ──
  { source: 'patpat-sample', category: 'property', subcategory: 'apartment', title: '3BR Luxury Apartment — Havelock City, Colombo 5', priceText: 'Rs. 82,000,000', location: 'Colombo', url: 'https://patpat.lk/en', imageUrl: img('photo-1545324418-cc1a3fa10c00') },
  { source: 'patpat-sample', category: 'property', subcategory: 'house', title: 'Two-Storey House — 10 Perches, Nugegoda', priceText: 'Rs. 58,500,000', location: 'Colombo', url: 'https://patpat.lk/en', imageUrl: img('photo-1568605114967-8130f3a36994') },
  { source: 'patpat-sample', category: 'property', subcategory: 'land', title: '25 Perch Bare Land — Digana, Kandy', priceText: 'Rs. 9,750,000', location: 'Kandy', url: 'https://patpat.lk/en', imageUrl: img('photo-1500382017468-9049fed747ef') },
  { source: 'patpat-sample', category: 'property', subcategory: 'apartment', title: '2BR Sea-View Apartment for Rent — Wellawatte', priceText: 'Rs. 185,000', location: 'Colombo', url: 'https://patpat.lk/en', imageUrl: img('photo-1522708323590-d24dbb6b0267') },

  // ── Home & Living ──
  { source: 'patpat-sample', category: 'home-living', subcategory: 'furniture', title: 'Damro L-Shaped Fabric Sofa', priceText: 'Rs. 145,000', location: 'Colombo', url: 'https://patpat.lk/en', imageUrl: img('photo-1555041469-a586c61ea9bc') },
  { source: 'patpat-sample', category: 'home-living', subcategory: 'appliance', title: 'LG 260L Inverter Refrigerator', priceText: 'Rs. 218,000', location: 'Gampaha', url: 'https://patpat.lk/en', imageUrl: img('photo-1571175443880-49e1d25b2bc5') },
  { source: 'patpat-sample', category: 'home-living', subcategory: 'furniture', title: 'Teak Dining Table + 6 Chairs — Moratuwa', priceText: 'Rs. 168,000', location: 'Kalutara', url: 'https://patpat.lk/en', imageUrl: img('photo-1617806118233-18e1de247200') },

  // ── Electronics ──
  { source: 'patpat-sample', category: 'electronics', subcategory: 'phone', title: 'iPhone 14 Pro 256GB', priceText: 'Rs. 285,000', location: 'Colombo', url: 'https://patpat.lk/en', imageUrl: img('photo-1663499482523-1c0c1bae4ce1') },
  { source: 'patpat-sample', category: 'electronics', subcategory: 'laptop', title: 'MacBook Air M2 2023 8GB/256GB', priceText: 'Rs. 365,000', location: 'Colombo', url: 'https://patpat.lk/en', imageUrl: img('photo-1517336714731-489689fd1ca8') },
  { source: 'patpat-sample', category: 'electronics', subcategory: 'tv', title: 'Samsung 55" Crystal UHD 4K TV', priceText: 'Rs. 265,000', location: 'Kandy', url: 'https://patpat.lk/en', imageUrl: img('photo-1593359677879-a4bb92f829d1') },
  { source: 'patpat-sample', category: 'electronics', subcategory: 'gaming', title: 'PlayStation 5 Slim + 2 Controllers', priceText: 'Rs. 245,000', location: 'Colombo', url: 'https://patpat.lk/en', imageUrl: img('photo-1606813907291-d86efa9b94db') },
]
