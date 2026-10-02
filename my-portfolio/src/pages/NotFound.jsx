import CTAButton from '../components/ui/CTAButton'
import RevisionCloud from '../components/drawing/RevisionCloud'
import Plot from '../components/drawing/Plot'
import { TitleBlock } from '../components/drawing/Marks'

export default function NotFound() {
  return (
    <main className="pt-[calc(68px+env(safe-area-inset-top,0px))]">
      <div className="wrap grid min-h-[70vh] items-center gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h1 className="t-display">That page doesn't exist.</h1>
          <p className="t-lead mt-6">The link might be old, or the URL has a typo. Here's where you probably meant to go.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <CTAButton to="/" size="lg" arrow>
              Back to home
            </CTAButton>
            <CTAButton to="/pricing" size="lg" variant="secondary">
              See pricing
            </CTAButton>
          </div>
        </div>
        <Plot className="lg:col-span-5 lg:col-start-8">
          <RevisionCloud className="p-6">
            <TitleBlock
              className="grid-cols-2"
              cells={[
                { label: 'Sheet', value: 'A-404' },
                { label: 'Status', value: 'Not in this set' },
                { label: 'Cover sheet', value: 'A-001 · Home' },
                { label: 'Schedule', value: 'A-201 · Pricing' },
              ]}
            />
          </RevisionCloud>
        </Plot>
      </div>
    </main>
  )
}
