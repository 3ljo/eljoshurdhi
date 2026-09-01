/**
 * Big-photo, minimal-copy visual for a case study — a title and one outcome
 * line, never a paragraph. `compact` drops the index number and shrinks the
 * padding, for use in a smaller teaser tile (homepage) vs. the full /work
 * grid. The caller supplies the interactive wrapper (button, Link, etc.) —
 * this only renders the absolutely-positioned visual layers inside it.
 */
export default function CaseStudyTile({ project, index, compact = false }) {
  return (
    <>
      <img
        src={project.image}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className={`absolute inset-0 bg-gradient-to-t ${project.accent} opacity-90 sm:opacity-70 sm:group-hover:opacity-90 transition-opacity duration-500`} />

      <span className="absolute top-5 left-6 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/90 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full">
        {project.niche}
      </span>
      {!compact && index != null && (
        <span className="absolute top-5 right-6 text-6xl font-heading font-extrabold text-white/10 leading-none select-none pointer-events-none">
          {String(index + 1).padStart(2, '0')}
        </span>
      )}

      <div className={compact ? 'absolute bottom-0 left-0 right-0 p-5' : 'absolute bottom-0 left-0 right-0 p-6 sm:p-7'}>
        <h3 className={compact ? 'text-lg font-heading font-bold text-white mb-1' : 'text-xl sm:text-2xl font-heading font-bold text-white mb-2'}>
          {project.title}
        </h3>
        {!compact && (
          <p className="text-white/80 text-sm leading-relaxed max-w-md line-clamp-2">{project.outcome}</p>
        )}
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full">
          {compact ? 'View case study' : 'Read case study'}
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </>
  )
}
