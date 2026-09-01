export default function Strategy() {
  return (
    <div className="container section doc" style={{ maxWidth: 900 }}>
      <h1>🧭 CeylonHub — Strategy, Gaps & Revenue Model</h1>
      <p className="sub">
        Synthesis of primary research on patpat.lk, autostream.lk, ikman.lk, riyasewana.com, lankapropertyweb.com
        and 20+ international platforms (Carvana, CarGurus, Auto Trader, Encar, Turo, Zillow, Rightmove,
        PropertyGuru, Back Market, Vinted, Carousell, OLX, Jiji). Full cited reports live in{' '}
        <code>docs/research/</code> in this repository.
      </p>

      <h2>1. The opportunity (why now)</h2>
      <ul>
        <li><b>Vehicle boom:</b> the import ban lifted Feb 2025; 220,000+ vehicles imported by Oct 2025 and 327,000+ registrations in H1 2026. With 200–300% excise duties, every vehicle is a major, usually leased, asset — high stakes, high search intensity.</li>
        <li><b>Digital rails just matured:</b> LankaQR covers 400k+ merchants; instant CEFTS transfers are ~70% of retail transaction volume. Escrow is now technically feasible in a cash-default culture — but only ~5% of Sri Lankans hold credit cards, so card-first Western UX fails here.</li>
        <li><b>Trust crisis = wedge:</b> 2,887 cybercrime complaints in Q1 2025 alone; classified-ad scams (vanishing advance payments, vehicle-ownership fraud, fake escrow middlemen) are among the most-reported. The market leader's public rating sits near 1.5/5 on Trustpilot, with "platform not involved in transactions" as its standard response.</li>
        <li><b>Incumbents monetize friction:</b> pay-to-play boosts, free-ad caps, fees to unblock phone numbers — while millions leak to unstructured, scam-prone Facebook groups.</li>
      </ul>

      <h2>2. Competitor gap map</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Gap in the market today</th><th>Evidence</th><th>CeylonHub answer</th></tr></thead>
          <tbody>
            <tr><td>No identity verification as standard</td><td>Verification exists only as paid dealer badges; riyasewana even charges Rs 5,000 to unblock numbers instead of verifying upstream</td><td><b>NIC-verified sellers, free & mandatory</b></td></tr>
            <tr><td>No escrow for high-value deals</td><td>ikman Safe Buy (Rs 1,500) covers small goods only; nothing for vehicles/property, the highest-fraud categories</td><td><b>SafePay escrow incl. vehicle deposits, tenancy deposits, event bookings</b></td></tr>
            <tr><td>No inspection standard</td><td>autostream's BLUE-T (110 points, 2026) is first and car-only; ikman/patpat/riyasewana carry zero condition assurance</td><td><b>220-point inspections across vehicles AND certified-refurbished electronics</b></td></tr>
            <tr><td>No price transparency</td><td>No used-vehicle price index exists; sellers advertise lease installments as prices</td><td><b>Fair Price Index from verified sale prices + CarGurus-style deal ratings on every listing</b></td></tr>
            <tr><td>Financing is single-lender</td><td>patpat pushes only its owner CDB's leases; no neutral comparison exists</td><td><b>Multi-lender leasing comparison — one application, all lenders bid</b></td></tr>
            <tr><td>Rentals have no marketplace</td><td>Rent-a-car is fragmented across FB groups & small sites; no booking, deposit or insurance layer</td><td><b>Turo-for-fleets: calendars, deposit escrow, insurance verification, digital handover</b></td></tr>
            <tr><td>Pay-to-play resentment</td><td>Complaints of ads deleted/de-ranked to force boost purchases on both ikman & LPW</td><td><b>Free forever for individuals; ranking by trust & relevance, never by deletion pressure</b></td></tr>
            <tr><td>Language gap</td><td>Only ikman is genuinely trilingual; vernacular users default to Facebook</td><td><b>Sinhala/Tamil/English everywhere, incl. AI ad translation</b></td></tr>
          </tbody>
        </table>
      </div>

      <h2>3. USPs — "never seen before" in Sri Lanka</h2>
      <ol>
        <li><b>SafePay everywhere</b> (Vinted/Mercari model, extended upmarket): the first escrow that covers vehicle booking deposits, tenancy deposits and wedding-car bookings — the exact places Sri Lankans lose money today. The trust layer <i>is</i> the product.</li>
        <li><b>The Fair Price Index</b> (CarGurus IMV + Zillow Zestimate): deal ratings on every listing, built from verified sale prices instead of inflated asking prices. Consumer magnet + a data product banks, insurers and leasing companies will pay for.</li>
        <li><b>Certified layer across two verticals</b> (Encar + Back Market): 220-point vehicle inspections with hybrid-battery health, plus Grade A/B/C certified-refurbished electronics with mandatory 6-month warranty and 7-day returns — no local player does either properly, none does both.</li>
        <li><b>Neutral finance marketplace</b> (PropertyGuru Finance model): patpat is owned by one finance company; CeylonHub makes all of LOLC, People's Leasing and the banks compete for each buyer. Shop by monthly installment, not just price.</li>
        <li><b>Rental infrastructure, not just listings</b>: booking calendars, SafePay-held deposits, verified insurance, photo-documented digital handovers — for self-drive, with-driver, tourist and wedding hire.</li>
        <li><b>AI-native listing flow</b>: photos → auto-detected make/model/specs, fraud screening (Encar's Mobile Diagnosis AI pattern), price suggestion, and instant trilingual ad copy.</li>
        <li><b>Diaspora mode</b>: verified property listings with title checks, video walkthroughs and escrowed deposits serve the ~20% of Colombo apartment demand coming from Sri Lankans abroad — nobody addresses them today.</li>
      </ol>

      <h2>4. Revenue model (phased — proven mechanics only)</h2>
      <h3>Phase 1 · Liquidity (months 0–12): free + boosts</h3>
      <ul>
        <li>Free listings in all categories (Jiji/autostream posture — attacks incumbent fee fatigue).</li>
        <li>Paid visibility: Boost Rs 750/7 days, Top Ad Rs 1,200, Urgent badge Rs 500 (priced against ikman's Rs 200–599 legacy price points).</li>
        <li>Display advertising to banks, insurers, OEM agents.</li>
      </ul>
      <h3>Phase 2 · B2B SaaS ladder (months 6–24): where the real money is</h3>
      <ul>
        <li>Dealer/agent/fleet subscriptions (Auto Trader & Rightmove model — both run ~70% operating margins): <b>Starter Rs 15k/mo → Pro Rs 45k/mo → Elite Rs 95k/mo</b> with listing quotas, analytics, lead CRM, verified-dealer storefronts.</li>
        <li>The growth lever is ARPR (average revenue per retailer), not just retailer count — annual price/product ladder.</li>
      </ul>
      <h3>Phase 3 · Trust products (months 12+)</h3>
      <ul>
        <li>SafePay buyer-protection: 2% capped at Rs 4,900 (goods); flat Rs 4,900 (vehicle/tenancy deposits).</li>
        <li>Inspections Rs 9,900 (sellers pay; inspected ads sell ~3× faster — Carousell Certified shows ~40% higher sell-through).</li>
        <li>Certified Refurbished program fees + extended warranties (18% of Back Market's revenue comes from such add-ons).</li>
        <li>Rental booking commission 12% incl. deposit escrow & insurance check (Turo band, no Getaround-style hardware).</li>
      </ul>
      <h3>Phase 4 · Finance & data (months 18+): the high-margin kicker</h3>
      <ul>
        <li>Leasing referrals: lenders pay per <i>funded</i> lease (Rs 15k–40k each is realistic against 4–7% dealer commissions in the market). In a 200%-duty economy nearly every vehicle is financed.</li>
        <li>Home-loan referrals (PropertyGuru facilitated SGD 6B+ in loans), insurance referrals on every vehicle & rental.</li>
        <li>Fair Price Index licensing to banks, insurers & leasing companies for collateral valuation.</li>
      </ul>

      <div className="callout amber">
        <b>What we deliberately do NOT copy:</b> Carvana/Cars24-style inventory ownership (capital-intensive;
        OLX Autos died doing it in emerging markets), Getaround's hardware + 40% take (shut US ops in 2025),
        private-label furniture retail (Urban Ladder), and Facebook's zero-verification openness — the scam
        problem is our market opening.
      </div>

      <h2>5. Defensibility flywheel</h2>
      <p>
        Free + trilingual + trust pulls listings from Facebook and fee-weary incumbents → verified transactions
        generate <b>real sale-price data</b> no one else has → the Fair Price Index gets smarter → buyers start
        every search here → dealers must subscribe → subscription revenue funds more inspectors and Safe Deal
        Points → trust gap widens. The data moat compounds; badges alone can be copied, 18 months of verified
        transaction history cannot.
      </p>

      <h2>6. Architecture: static vs dynamic (the honest answer)</h2>
      <ul>
        <li><b>This prototype</b> is a static React SPA (Vite) on GitHub Pages — GitHub Pages happily serves a <i>built</i> React app, but it can only serve static files.</li>
        <li><b>The real platform must be dynamic:</b> listings, search, chat, escrow, auth and payments all need a backend. Recommended: keep this React frontend, add a hosted API (e.g. Node/NestJS or Django + Postgres + OpenSearch/Algolia + S3-compatible media storage), deploy the frontend statically (Pages/Vercel/CloudFront) and the API on a cloud host. The SPA→API architecture means this prototype's code carries forward.</li>
        <li>Mobile apps (Android-first — ~84% of the market) follow once the API exists; PWA in the interim for low-end devices.</li>
      </ul>

      <h2>7. Sources</h2>
      <p>
        Three fully-cited research reports are committed alongside this app:{' '}
        <code>docs/research/sri-lanka-competitors.md</code>, <code>docs/research/international-platforms.md</code>,{' '}
        <code>docs/research/market-context.md</code>, plus the consolidated{' '}
        <code>docs/strategy.md</code>. Figures above trace to those documents; demo numbers in the UI are illustrative.
      </p>
    </div>
  )
}
