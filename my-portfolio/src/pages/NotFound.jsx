import CTAButton from '../components/ui/CTAButton'

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-bg dark:bg-bg-dark px-6">
      <div className="text-center max-w-md">
        <p className="font-mono text-signal dark:text-signal-dark text-sm mb-4">404</p>
        <h1 className="font-display text-3xl font-bold text-ink dark:text-ink-dark mb-4">
          That page doesn't exist.
        </h1>
        <p className="text-slate dark:text-slate-dark leading-relaxed mb-8">
          The link might be old, or the URL has a typo. Here's where you probably meant to go.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <CTAButton to="/">Back to home</CTAButton>
          <CTAButton to="/pricing" variant="secondary">See pricing</CTAButton>
        </div>
      </div>
    </main>
  )
}
