import { objections } from '../../lib/siteConfig'

// Objections, answered the way a drawing set answers questions before they
// are asked: as numbered general notes.
export default function GeneralNotes({ title = "Let's answer the objections before you type them.", compact = false }) {
  return (
    <section className={compact ? '' : 'section rule-top'} aria-labelledby="notes-heading">
      <div className={compact ? '' : 'wrap'}>
        <h2 id="notes-heading" className={compact ? 't-h3' : 't-h2 max-w-[20ch]'}>
          {title}
        </h2>
        <ol className={`m-0 mt-10 grid list-none gap-x-12 p-0 ${compact ? '' : 'md:grid-cols-2'}`}>
          {objections.map((item, i) => (
            <li key={item.question} className="grid grid-cols-[2.25rem_1fr] border-t border-rule py-6">
              <span className="t-figure pt-0.5 text-[0.95rem] text-ink-2">{i + 1}.</span>
              <div>
                <h3 className="font-sans text-[1.15rem] font-semibold leading-snug">{item.question}</h3>
                <p className="mt-2 t-muted">{item.answer}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
