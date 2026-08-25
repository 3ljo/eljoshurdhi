import { useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useScrollAnimation, fadeUp, slideLeft, slideRight, staggerContainer } from '../hooks/useScrollAnimation'
import { brand, projectTypeOptions, budgetOptions, objections } from '../lib/siteConfig'
import { validateLead, submitLead } from '../lib/leadForm'
import ProofStrip from '../components/ProofStrip'

const fieldClass =
  'w-full px-4 py-3 rounded-xl bg-white dark:bg-dark-card border text-gray-900 dark:text-white focus:outline-none transition-colors'

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

export default function Contact() {
  const { ref, controls } = useScrollAnimation()
  const [searchParams] = useSearchParams()
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | sending | success
  const [errors, setErrors] = useState({})
  const [fields, setFields] = useState({
    name: '',
    email: '',
    projectType: searchParams.get('type') ?? '',
    budget: '',
    message: '',
  })

  const update = (key) => (e) => setFields(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateLead(fields)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setStatus('sending')
    const projectTypeLabel = projectTypeOptions.find(o => o.value === fields.projectType)?.label
    const budgetLabel = budgetOptions.find(o => o.value === fields.budget)?.label
    await submitLead(fields, { projectTypeLabel, budgetLabel })

    setStatus('success')
    formRef.current?.reset()
    setFields({ name: '', email: '', projectType: '', budget: '', message: '' })
    setTimeout(() => setStatus('idle'), 5000)
  }

  return (
    <main className="bg-light-bg dark:bg-dark-bg">
      <section className="pt-32 pb-24 lg:pt-40 lg:pb-28">
        <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={controls} className="max-w-6xl mx-auto px-6">
          <motion.div variants={fadeUp} className="max-w-2xl mb-14">
            <p className="text-emerald-accent font-semibold text-sm uppercase tracking-widest mb-3">Start a Project</p>
            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              Tell me what you're building.
            </h1>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              A few details now saves a back-and-forth later. I read every message myself and reply personally.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-14">
            {/* Left — proof + alternative contact */}
            <motion.div variants={slideLeft} className="space-y-10">
              <ProofStrip />

              <div className="rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card p-6">
                <h2 className="font-heading font-semibold text-gray-900 dark:text-white mb-4">Prefer to reach out directly?</h2>
                <div className="space-y-3">
                  <a href={`mailto:${brand.directEmail}`} className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-accent transition-colors">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {brand.directEmail}
                  </a>
                  <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-accent transition-colors">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {brand.whatsappLabel}
                  </a>
                  <a href={brand.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-accent transition-colors">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>

              <div>
                <h2 className="font-heading font-semibold text-gray-900 dark:text-white mb-4">Before you send this</h2>
                <div className="space-y-4">
                  {objections.map(item => (
                    <div key={item.question}>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.question}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-1">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div variants={slideRight}>
              <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6 rounded-3xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card p-6 sm:p-8">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Name" error={errors.name}>
                    <input
                      type="text" value={fields.name} onChange={update('name')}
                      className={`${fieldClass} ${errors.name ? 'border-red-400' : 'border-gray-200 dark:border-dark-border focus:border-emerald-accent'}`}
                    />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <input
                      type="email" value={fields.email} onChange={update('email')}
                      className={`${fieldClass} ${errors.email ? 'border-red-400' : 'border-gray-200 dark:border-dark-border focus:border-emerald-accent'}`}
                    />
                  </Field>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Project type" error={errors.projectType}>
                    <select
                      value={fields.projectType} onChange={update('projectType')}
                      className={`${fieldClass} ${errors.projectType ? 'border-red-400' : 'border-gray-200 dark:border-dark-border focus:border-emerald-accent'}`}
                    >
                      <option value="" disabled>Choose one</option>
                      {projectTypeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Budget range" error={errors.budget}>
                    <select
                      value={fields.budget} onChange={update('budget')}
                      className={`${fieldClass} ${errors.budget ? 'border-red-400' : 'border-gray-200 dark:border-dark-border focus:border-emerald-accent'}`}
                    >
                      <option value="" disabled>Choose one</option>
                      {budgetOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </Field>
                </div>

                <Field label="Project details" error={errors.message}>
                  <textarea
                    rows={6} value={fields.message} onChange={update('message')}
                    placeholder="What are you building, and what does &quot;done&quot; look like?"
                    className={`${fieldClass} resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500 ${errors.message ? 'border-red-400' : 'border-gray-200 dark:border-dark-border focus:border-emerald-accent'}`}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full py-4 rounded-full font-semibold text-white bg-emerald-accent hover:bg-emerald-dark transition-colors disabled:opacity-70"
                >
                  {status === 'sending' && 'Opening your email…'}
                  {status === 'success' && 'Opened in your email app — hit send there ✓'}
                  {status === 'idle' && 'Send project details'}
                </button>
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center -mt-2">
                  This opens your email app with everything pre-filled, addressed to me. Nothing sends until you do.
                </p>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
