import { painPoints } from '../../lib/siteConfig'
import Plot from '../drawing/Plot'
import RevisionCloud from '../drawing/RevisionCloud'
import { Delta } from '../drawing/Marks'

// The problem, marked up the way a drawing gets marked for revision: a cloud
// around what has to change and a numbered delta on each item.
export default function RevisionList() {
  return (
    <section className="section" aria-labelledby="problem-heading">
      <div className="wrap grid gap-x-14 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="problem-heading" className="t-h2">
            Your website might be losing you customers right now.
          </h2>
          <p className="t-lead mt-6">Any of this sound familiar?</p>
          <p className="mt-10 max-w-[26ch] font-display text-[1.9rem] font-semibold leading-[1.1]">
            That's not a marketing problem. That's a website problem — and it's fixable.
          </p>
        </div>

        <Plot className="lg:col-span-7">
          <RevisionCloud className="p-6 sm:p-9">
            <ol className="m-0 list-none p-0">
              {painPoints.map((point, i) => (
                <li key={point} className="flex items-start gap-4 border-b border-rule py-4 last:border-b-0">
                  <Delta>{i + 1}</Delta>
                  <span className="pt-1 text-[1.1rem] leading-snug">{point}</span>
                </li>
              ))}
            </ol>
          </RevisionCloud>
        </Plot>
      </div>
    </section>
  )
}
