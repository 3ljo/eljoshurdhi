import { templateScreenshot } from '../lib/siteConfig'

/**
 * Live-screenshot visual for a template starting point. `compact` strips it
 * to just the image, niche badge, and name — for a small teaser row — vs.
 * the fuller version on /work with a description and preview pill.
 */
export default function TemplateTile({ template, compact = false }) {
  return (
    <>
      <img
        src={templateScreenshot(template.href)}
        alt={`${template.title} template preview`}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 bg-gray-200 dark:bg-dark-border"
      />
      <div className={`absolute inset-0 bg-gradient-to-t ${template.accent} opacity-90 sm:opacity-80 sm:group-hover:opacity-90 transition-opacity duration-500`} />

      <span className="absolute top-4 left-4 text-[10px] font-semibold uppercase tracking-widest text-white/90 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full">
        {template.niche}
      </span>

      <div className={compact ? 'absolute bottom-0 left-0 right-0 p-4' : 'relative p-5'}>
        <h3 className={compact ? 'text-base font-heading font-bold text-white' : 'text-lg font-heading font-bold text-white mb-1'}>
          {template.title}
        </h3>
        {!compact && (
          <>
            <p className="text-white/80 text-sm leading-relaxed mb-3 line-clamp-2">{template.description}</p>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full">
              Preview live demo
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </>
        )}
      </div>
    </>
  )
}
