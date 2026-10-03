import { useId, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BrandIcon, Icon } from '../components/Icons'
import { validateLead, submitLead } from '../lib/leadForm'
import { brand, budgetOptions, projectTypeOptions } from '../lib/siteConfig'

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
        className="field"
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
      style={{ margin: 0, padding: 0, border: 0 }}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
    >
      <legend className="field-label" style={{ padding: 0 }}>
        {legend}
      </legend>
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
    <main id="main" className="reply">
      <section className="reply__side on-ink" aria-labelledby="contact-title">
        <h1 id="contact-title" className="display" style={{ fontSize: 'clamp(3.25rem, 1.5rem + 6vw, 7rem)' }}>
          Tell me what you're building.
        </h1>
        <p className="lead" style={{ color: 'var(--on-ink-2)' }}>
          A few details now saves a back-and-forth later. I read every message myself and reply personally.
        </p>
        <div>
          <p className="label" style={{ color: 'var(--on-ink-2)', marginBottom: '0.5rem' }}>
            Prefer a direct line?
          </p>
          <ul className="reply__lines">
            <li>
              <a href={`mailto:${brand.directEmail}`}>
                <span>
                  <Icon name="mail" />
                  {brand.directEmail}
                </span>
                <Icon name="arrowUpRight" />
              </a>
            </li>
            <li>
              <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer">
                <span>
                  <BrandIcon name="whatsapp" />
                  WhatsApp {brand.whatsappLabel}
                </span>
                <Icon name="arrowUpRight" />
              </a>
            </li>
            <li>
              <a href={brand.linkedin} target="_blank" rel="noopener noreferrer">
                <span>
                  <BrandIcon name="linkedin" />
                  LinkedIn
                </span>
                <Icon name="arrowUpRight" />
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="reply__card" aria-labelledby="form-title">
        <form ref={formRef} onSubmit={handleSubmit} noValidate className="reply__form" aria-labelledby="form-title">
          <h2 id="form-title" className="display d-md">
            Reply card
          </h2>
          <p style={{ marginTop: '0.5rem', fontWeight: 700, maxWidth: '48ch' }}>
            Fill it in and send it. It opens your email app with everything addressed to me.
          </p>
          <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1.75rem' }}>
            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))' }}>
              <TextField label="Name" name="name" autoComplete="name" value={fields.name} onChange={update('name')} error={errors.name} />
              <TextField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                value={fields.email}
                onChange={update('email')}
                error={errors.email}
              />
            </div>
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

          <button type="submit" className="btn btn-lg" style={{ width: '100%', marginTop: '2rem' }} disabled={status === 'sending'}>
            {status === 'sending' ? 'Opening your email…' : 'Send project details'}
            {status !== 'sending' && <Icon name="arrowRight" className="btn-arrow" />}
          </button>
          <p style={{ marginTop: '0.9rem', textAlign: 'center', fontWeight: 600, fontSize: '0.95rem' }} aria-live="polite">
            {status === 'success'
              ? 'Opened in your email app. Hit send there and it reaches me.'
              : 'Nothing sends until you press send in your own email app.'}
          </p>
        </form>
      </section>
    </main>
  )
}
