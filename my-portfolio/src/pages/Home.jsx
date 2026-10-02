import { Link } from 'react-router-dom'
import Hero from '../components/sections/Hero'
import ProofLegend from '../components/sections/ProofLegend'
import RevisionList from '../components/sections/RevisionList'
import BuildingSection from '../components/sections/BuildingSection'
import PackageSchedule from '../components/sections/PackageSchedule'
import Specifications from '../components/sections/Specifications'
import ProofSection from '../components/sections/ProofSection'
import ProcessSequence from '../components/sections/ProcessSequence'
import GeneralNotes from '../components/sections/GeneralNotes'
import FinalCta from '../components/sections/FinalCta'
import { Icon } from '../components/drawing/Icons'

function Offer() {
  return (
    <section className="section rule-top" aria-labelledby="offer-heading">
      <div className="wrap">
        <div className="grid gap-x-14 gap-y-6 lg:grid-cols-12">
          <h2 id="offer-heading" className="t-h2 lg:col-span-7">
            Pick the package that matches where your business is.
          </h2>
          <p className="t-lead lg:col-span-4 lg:col-start-9 lg:self-end">
            Four ways to work together — every one ships a live site built to convert, not just look good.
          </p>
        </div>
        <div className="mt-12">
          <PackageSchedule />
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="t-muted text-[0.98rem]">
            Prices are starting points — every project gets a fixed quote in writing before work begins.
          </p>
          <Link to="/pricing" className="link">
            See full package details &amp; pricing
            <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="wrap mt-12">
        <ProofLegend />
      </div>
      <RevisionList />
      <BuildingSection />
      <Offer />
      <Specifications />
      <ProofSection />
      <ProcessSequence id="how-it-works" />
      <GeneralNotes />
      <FinalCta />
    </main>
  )
}
