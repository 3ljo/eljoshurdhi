import { methodology } from '../../lib/siteConfig'

// The methodology as a building section, read from the foundation up:
// strategy is below grade, optimizing is the mast on the roof.
const fills = ['hatch-dots', 'hatch-cross', 'hatch-diag', 'hatch-vert', '']

export default function BuildingSection() {
  return (
    <section className="section rule-top" aria-labelledby="method-heading">
      <div className="wrap">
        <div className="grid gap-x-14 gap-y-6 lg:grid-cols-12">
          <h2 id="method-heading" className="t-h2 lg:col-span-6">
            A website built like a sales tool, not a brochure.
          </h2>
          <p className="t-lead lg:col-span-5 lg:col-start-8 lg:self-end">
            Not React, not Next.js, not framework talk — a business transformation with five parts, each one earning its
            place.
          </p>
        </div>

        <ol className="m-0 mt-14 flex list-none flex-col-reverse p-0" aria-label="The five parts, from the foundation up">
          {methodology.map((item, i) => {
            const top = i === methodology.length - 1
            const foundation = i === 0
            return (
              <li key={item.phase} className="grid grid-cols-[minmax(0,2fr)_minmax(0,5fr)] gap-x-5 sm:gap-x-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
                <div className="relative" aria-hidden="true">
                  {top ? (
                    <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="drawing absolute inset-x-[8%] bottom-0 h-full w-[84%]">
                      <path d="M0 100 L0 70 L200 70 L200 100" className="ln ln-bold" vectorEffect="non-scaling-stroke" />
                      <path d="M150 70 L150 8 M140 22 L160 22 M143 36 L157 36" className="ln" vectorEffect="non-scaling-stroke" />
                      <circle cx="150" cy="6" r="3" className="f-action" />
                    </svg>
                  ) : (
                    <div
                      className={`absolute inset-y-0 ${foundation ? 'inset-x-0' : 'inset-x-[8%]'} border-x-2 border-t-[3px] border-line ${foundation ? 'border-b-2' : ''} ${fills[i]}`}
                    />
                  )}
                  {foundation && (
                    <span className="absolute inset-x-[-6%] top-0 border-t border-dashed border-line" />
                  )}
                  <span
                    className={`t-mono absolute left-[calc(8%+0.6rem)] rounded-[2px] bg-paper px-1.5 py-0.5 text-[0.6875rem] text-ink-2 max-sm:hidden ${top ? 'bottom-2' : 'top-2.5'}`}
                  >
                    {foundation ? 'Below grade' : top ? 'Roof' : `Level ${i}`}
                  </span>
                </div>
                <div className={`py-7 ${top ? '' : 'border-t border-rule'}`}>
                  <h3 className="t-h3">{item.phase}</h3>
                  <p className="measure mt-2.5 text-[1.05rem] t-muted">{item.description}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
