import { Picture } from '../components/Media'
import { BackCover, Interview, PriceList } from '../components/sections/Departments'

export default function Services() {
  return (
    <main id="main">
      <header className="page-head">
        <div className="page-head__text">
          <h1 className="display" style={{ fontSize: 'clamp(3.5rem, 1.5rem + 8vw, 8.5rem)' }}>
            Pricing
          </h1>
          <p className="lead">
            Fixed prices, in writing, before anything starts. Pick the package that matches where your business is today.
          </p>
        </div>
        <div className="page-head__media">
          <Picture
            name="shopper"
            eager
            alt="Black-and-white street photo of a person in a hoodie carrying shopping bags and a shoebox out of a concrete arcade"
            sizes="(min-width: 960px) 48vw, 100vw"
          />
        </div>
      </header>
      <PriceList detailed />
      <Interview />
      <BackCover title="Not sure which one fits?" body="Tell me about your business and I'll tell you honestly what it needs, and which package gets you there." />
    </main>
  )
}
