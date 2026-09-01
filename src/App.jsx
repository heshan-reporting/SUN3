import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Header, Footer } from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Category from './pages/Category.jsx'
import Detail from './pages/Detail.jsx'
import Sell from './pages/Sell.jsx'
import Finance from './pages/Finance.jsx'
import SafePay from './pages/SafePay.jsx'
import PriceGuide from './pages/PriceGuide.jsx'
import Strategy from './pages/Strategy.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/c/:slug" element={<Category />} />
          <Route path="/l/:id" element={<Detail />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/safepay" element={<SafePay />} />
          <Route path="/price-guide" element={<PriceGuide />} />
          <Route path="/strategy" element={<Strategy />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
