import CTAButton from '../components/ui/CTAButton'

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-light-bg dark:bg-dark-bg px-6">
      <div className="text-center max-w-md">
        <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-4">404</p>
        <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-4">
          That page doesn't exist.
        </h1>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
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
