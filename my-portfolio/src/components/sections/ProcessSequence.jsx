import { processSteps } from '../../lib/siteConfig'
import Plot from '../drawing/Plot'

// The buying journey as a construction sequence. The numbers stay because
// the order is the information.
export default function ProcessSequence({ id, title = "Buying this should feel easy. Here's how it works." }) {
  return (
    <section id={id} className="section rule-top scroll-mt-20" aria-labelledby={`${id ?? 'process'}-heading`}>
      <div className="wrap">
        <h2 id={`${id ?? 'process'}-heading`} className="t-h2 max-w-[18ch]">
          {title}
        </h2>

        <Plot as="ol" className="m-0 mt-14 grid list-none gap-y-10 p-0 lg:grid-cols-5 lg:gap-x-0">
          {processSteps.map((step, i) => (
            <li key={step.step} className="relative pr-6 max-lg:grid max-lg:grid-cols-[3rem_1fr] max-lg:gap-x-4">
              <div className="relative flex items-center" aria-hidden="true">
                <span className="bubble h-12 w-12 border-2 text-[0.95rem]">{step.step}</span>
                {i < processSteps.length - 1 && (
                  <svg className="drawing ml-3 h-4 flex-1 max-lg:hidden" viewBox="0 0 100 16" preserveAspectRatio="none">
                    <line x1="0" y1="8" x2="100" y2="8" pathLength="1" className="ln" vectorEffect="non-scaling-stroke" style={{ '--d': 300 + i * 200 }} />
                  </svg>
                )}
                {i < processSteps.length - 1 && (
                  <span className="absolute left-6 top-12 h-[calc(100%+2.5rem)] border-l border-line lg:hidden" />
                )}
              </div>
              <div className="lg:mt-6">
                <h3 className="t-h4">{step.title}</h3>
                <p className="mt-2 text-[1.02rem] t-muted">{step.description}</p>
                {i === 1 && <span className="stamp mt-4">Fixed price · in writing</span>}
              </div>
            </li>
          ))}
        </Plot>
      </div>
    </section>
  )
}
