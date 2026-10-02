import { useId, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { brand, projectTypeOptions, budgetOptions } from '../lib/siteConfig'
import { validateLead, submitLead } from '../lib/leadForm'
import PageHeader from '../components/sections/PageHeader'
import GeneralNotes from '../components/sections/GeneralNotes'
import { BrandIcon, Icon } from '../components/drawing/Icons'

function TextField({ label, error, multiline = false, ...props }) {
  const id = useId()
  const Tag = multiline ? 'textarea' : 'input'
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <Tag
        id={id}
        className={`field ${multiline ? 'min-h-[10rem] resize-y' : ''}`}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  )
}

function ChoiceField({ legend, name, options, value, onChange, error }) {
  const id = useId()
  return (
    <fieldset
      className="choices-group m-0 border-0 p-0"
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
    >
      <legend className="field-label p-0">{legend}</legend>
      <div className="choices">
        {options.map(option => (
          <label key={option.value} className="choice">
            <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={onChange} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
    </fieldset>
  )
}

export default function Contact() {
  const [searchParams] = useSearchParams()
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | sending | success
  const [errors, setErrors] = useState({})
  const [fields, setFields] = useState({
    name: '',
    email: '',
    projectType: projectTypeOptions.some(o => o.value === searchParams.get('type')) ? searchParams.get('type') : '',
    budget: '',
    message: '',
  })

  const update = key => e => setFields(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    const validationErrors = validateLead(fields)
    setErrors(validationErrors)
    // Errors render on the next paint, so find the first invalid field by
    // name (in form order) rather than by its aria-invalid attribute.
    const firstInvalid = Object.keys(fields).find(key => validationErrors[key])
    if (firstInvalid) {
      formRef.current?.querySelector(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    setStatus('sending')
    const projectTypeLabel = projectTypeOptions.find(o => o.value === fields.projectType)?.label
    const budgetLabel = budgetOptions.find(o => o.value === fields.budget)?.label
    await submitLead(fields, { projectTypeLabel, budgetLabel })

    setStatus('success')
    setFields({ name: '', email: '', projectType: '', budget: '', message: '' })
    setTimeout(() => setStatus('idle'), 6000)
  }

  return (
    <main>
      <PageHeader
        title="Tell me what you're building."
        lead="A few details now saves a back-and-forth later. I read every message myself and reply personally."
      />

      <div className="wrap grid gap-x-16 gap-y-14 pb-[clamp(5rem,4rem+6vw,9rem)] lg:grid-cols-12">
        <form ref={formRef} onSubmit={handleSubmit} noValidate className="lg:col-span-7" aria-label="Project inquiry">
          <div className="border-t-2 border-ink pt-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField label="Name" name="name" autoComplete="name" value={fields.name} onChange={update('name')} error={errors.name} />
              <TextField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                autoCapitalize="none"
                value={fields.email}
                onChange={update('email')}
                error={errors.email}
              />
            </div>
            <div className="mt-8 grid gap-8">
              <ChoiceField
                legend="Project type"
                name="projectType"
                options={projectTypeOptions}
                value={fields.projectType}
                onChange={update('projectType')}
                error={errors.projectType}
              />
              <ChoiceField
                legend="Budget range"
                name="budget"
                options={budgetOptions}
                value={fields.budget}
                onChange={update('budget')}
                error={errors.budget}
              />
              <TextField
                label="Project details"
                name="message"
                multiline
                rows={6}
                placeholder={'What are you building, and what does "done" look like?'}
                value={fields.message}
                onChange={update('message')}
                error={errors.message}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg mt-9 w-full" disabled={status === 'sending'}>
              {status === 'sending' ? 'Opening your email…' : 'Send project details'}
              {status !== 'sending' && <Icon name="arrowRight" className="btn-arrow h-5 w-5" strokeWidth={2} />}
            </button>
            <p className="mt-4 text-center text-[0.95rem] t-muted" aria-live="polite">
              {status === 'success'
                ? 'Opened in your email app — hit send there and it reaches me.'
                : 'This opens your email app with everything pre-filled, addressed to me. Nothing sends until you do.'}
            </p>
          </div>
        </form>

        <aside className="lg:col-span-5" aria-label="Other ways to reach me">
          <div className="title-block">
            <div>
              <span className="tb-label">Prefer to reach out directly?</span>
              <ul className="m-0 mt-2 grid list-none gap-2.5 p-0">
                <li>
                  <a href={`mailto:${brand.directEmail}`} className="link">
                    <Icon name="mail" className="h-4 w-4" />
                    {brand.directEmail}
                  </a>
                </li>
                <li>
                  <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer" className="link">
                    <BrandIcon name="whatsapp" />
                    WhatsApp {brand.whatsappLabel}
                  </a>
                </li>
                <li>
                  <a href={brand.linkedin} target="_blank" rel="noopener noreferrer" className="link">
                    <BrandIcon name="linkedin" />
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <span className="tb-label">Sheet</span>
              <span className="tb-value">A-401 · Request for quote</span>
            </div>
          </div>

          <div className="mt-12">
            <GeneralNotes title="Before you send this" compact />
          </div>
        </aside>
      </div>
    </main>
  )
}
