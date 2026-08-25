// ---------------------------------------------------------------------------
// Single source of truth for anything commercial on the site: brand info,
// service packages, pricing, process, objection-handling copy, and proof
// points. Edit numbers and copy here — nothing below is hardcoded again
// inside a component.
//
// FLAGGED AS PLACEHOLDER: every `price` and `timeframe` in `packages` below.
// Structure, inclusions, and copy are real; the numbers are starting points
// until real pricing is locked in.
// ---------------------------------------------------------------------------

export const brand = {
  name: 'Eljo Shurdhi',
  role: 'Frontend Developer',
  location: 'Tirana, Albania',
  // Where the "Start a project" form sends leads. Currently delivered via a
  // mailto fallback — see src/lib/leadForm.js for the swap-in point once a
  // real form backend (Formspree / EmailJS / Resend) is wired up.
  leadEmail: 'eljoshurdhi3095@gmail.com',
  directEmail: 'shurdhieljo@outlook.com',
  whatsapp: 'https://wa.me/355682080411',
  whatsappLabel: '+355 682 080 411',
  linkedin: 'https://www.linkedin.com/in/eljo-shurdhi-6580111bb/',
  github: 'https://github.com/3ljo',
}

export const navLinks = [
  { label: 'Work', href: '/work' },
  { label: 'Services & Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
]

// Real, verifiable — years counted from the WhiteDesk start date on record,
// project count from the shipped projects listed in `caseStudies` below.
export const proofStats = [
  { value: '4+ yrs', label: 'building production web apps' },
  { value: '6', label: 'live projects shipped end-to-end' },
  { value: 'React / Next.js', label: 'day-to-day stack, every build' },
]

export const proofNote =
  "Currently building production software at WhiteDesk. Every project below is live — click through and use it."

export const packages = [
  {
    slug: 'landing',
    name: 'Landing Page',
    forWho: 'One offer, one page, built to convert',
    price: '$650',
    priceNote: 'starting at',
    timeframe: '5 business days',
    recommended: false,
    includes: [
      'One page, built around a single offer',
      'Mobile-first, fast-loading build',
      'Contact form or booking link wired in',
      'Deployed live on your domain',
      '1 round of revisions included',
    ],
  },
  {
    slug: 'business',
    name: 'Business Website',
    forWho: 'The site that does your selling for you',
    price: '$1,800',
    priceNote: 'starting at',
    timeframe: '2–3 weeks',
    recommended: true,
    includes: [
      'Up to 5 pages (Home, About, Services, Work, Contact)',
      'Mobile-first, accessible, SEO-ready structure',
      'Lead form wired to your inbox',
      'On-page SEO basics + analytics set up',
      '2 rounds of revisions included',
    ],
  },
  {
    slug: 'webapp',
    name: 'Web App / Custom Build',
    forWho: 'A product with logins, data, or logic',
    price: '$4,500',
    priceNote: 'starting at',
    timeframe: 'Scoped on a discovery call',
    recommended: false,
    includes: [
      'Accounts, dashboards, and databases — built to spec',
      'API and third-party integrations (payments, email, data)',
      'Built in React / Next.js on a codebase you can hand off',
      'Fixed price once scope is locked, no surprise invoices',
    ],
  },
  {
    slug: 'maintenance',
    name: 'Maintenance & Support',
    forWho: 'Keep an existing site current and working',
    price: '$150',
    priceNote: '/mo',
    timeframe: 'Monthly retainer',
    recommended: false,
    includes: [
      'Content updates and small feature requests',
      'Uptime and dependency monitoring',
      'Bug fixes, typically same-week',
      'Cancel anytime — no lock-in contract',
    ],
  },
]

export const processSteps = [
  {
    step: '01',
    title: 'Inquiry',
    description: "You tell me what you need and what “done” looks like. I ask questions until the scope is actually clear.",
  },
  {
    step: '02',
    title: 'Proposal',
    description: 'A fixed price and timeline, in writing, before any work starts. No hourly surprises.',
  },
  {
    step: '03',
    title: 'Build',
    description: "You see progress as it happens, not just a reveal at the end.",
  },
  {
    step: '04',
    title: 'Launch',
    description: 'Live on your domain, tested on real devices, handed off with everything you need to make future edits.',
  },
  {
    step: '05',
    title: 'Support',
    description: "I'm reachable after launch. A maintenance plan is there if you want it — not required.",
  },
]

export const objections = [
  {
    question: 'Why a solo freelancer instead of an agency?',
    answer:
      "You talk directly to the person writing the code — no account manager, no relay, no agency markup. Decisions happen in one message instead of one meeting.",
  },
  {
    question: 'What do revisions actually look like?',
    answer:
      'Each package includes a set number of revision rounds (see the package for the exact count). Changes inside the original scope are free; new features or a different direction are quoted separately before any work starts — no surprise invoices.',
  },
  {
    question: "What's a realistic turnaround?",
    answer:
      'The timeframe listed on each package is the real one, confirmed in writing before work starts. Custom builds get a specific date after the discovery call, once scope is locked.',
  },
]

// Reframed as outcomes for the visitor, not a list of technologies used.
// No client metrics are invented — only what actually shipped.
export const caseStudies = [
  {
    title: 'CV Climber',
    niche: 'Career SaaS',
    outcome: 'Built the AI resume tool that turns a rough work history into an ATS-ready CV in minutes.',
    description: 'AI-powered resume builder that helps job seekers craft standout CVs and climb the career ladder faster.',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1600&h=900&fit=crop',
    tags: ['Next.js', 'AI', 'Tailwind', 'Stripe'],
    size: 'large',
    href: 'https://www.cvclimber.lol/',
    accent: 'from-emerald-600/30 via-emerald-950/50 to-black/90',
    problem: 'Job seekers struggle to translate their experience into a CV that ranks well on ATS systems and stands out to recruiters.',
    role: 'Designed the product end-to-end, built the AI resume generator, payment flow, and templated PDF export.',
    highlights: [
      'AI-assisted bullet rewriting tuned for ATS keywords',
      'Multiple modern templates with one-click PDF export',
      'Stripe checkout for premium plans',
    ],
  },
  {
    title: 'AI Receptionist',
    niche: 'AI Automation',
    outcome: 'Built a voice AI that answers the phone and books the appointment, so leads stop going to voicemail.',
    description: 'Voice AI that answers calls, books appointments, and handles customer queries 24/7 for service businesses.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=900&fit=crop',
    tags: ['Next.js', 'OpenAI', 'Twilio', 'Supabase'],
    size: 'small',
    href: 'https://ai-recepsionist-codo.vercel.app/dashboard',
    accent: 'from-violet-600/30 via-indigo-950/50 to-black/90',
    problem: 'Small businesses lose leads when calls go unanswered outside hours or while staff are busy with clients.',
    role: 'Built the dashboard, the Twilio voice integration, and the OpenAI prompt layer that handles real-time conversations.',
    highlights: [
      'Real-time voice conversations powered by OpenAI',
      'Call logs, transcripts, and lead capture in one dashboard',
      'Configurable per business — hours, services, knowledge base',
    ],
  },
  {
    title: 'Nderto',
    niche: 'Construction SaaS',
    outcome: "Replaced a construction team's spreadsheet-and-group-chat workflow with one dashboard for projects and crews.",
    description: 'A management platform for construction crews — projects, materials, and team coordination in one dashboard.',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=900&fit=crop',
    tags: ['Next.js', 'Auth', 'Postgres', 'Tailwind'],
    size: 'small',
    href: 'https://nderto.vercel.app/login',
    accent: 'from-amber-600/30 via-orange-950/50 to-black/90',
    problem: 'Construction teams juggle projects, materials, and crew assignments across spreadsheets and chat apps.',
    role: 'Designed the data model, built the auth and project workflows, and shipped a clean dashboard UI.',
    highlights: [
      'Authenticated multi-role access (admin / crew)',
      'Projects, tasks, and material tracking in one place',
      'Postgres-backed schema with proper relations',
    ],
  },
  {
    title: 'ESHB',
    niche: 'Brand & Agency',
    outcome: 'Gave a new agency a launch site built to read as premium and turn visitors into leads from day one.',
    description: 'A modern agency landing site with bold typography, smooth scroll animations, and a clear conversion path.',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&h=900&fit=crop',
    tags: ['React', 'Framer Motion', 'Tailwind'],
    size: 'small',
    href: 'https://eshb.vercel.app/',
    accent: 'from-rose-600/30 via-pink-950/50 to-black/90',
    problem: 'A new agency needed a landing page that communicates premium positioning and converts visitors into leads.',
    role: 'Designed and built the entire site — typography system, scroll-triggered animations, and contact flow.',
    highlights: [
      'Custom typography and color system',
      'Scroll-triggered animations with Framer Motion',
      'Mobile-first responsive layout',
    ],
  },
  {
    title: 'Sage Commerce',
    niche: 'E-commerce',
    outcome: 'Built a storefront that takes a shopper from browsing to checkout without the bloat of an off-the-shelf platform.',
    description: 'A modern online store with product browsing, cart, and a smooth checkout flow built for conversion.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=900&fit=crop',
    tags: ['Next.js', 'Tailwind', 'Stripe', 'React'],
    size: 'small',
    href: 'https://ecomerce-sage-eight.vercel.app/',
    accent: 'from-teal-600/30 via-emerald-950/50 to-black/90',
    problem: 'Small brands need a fast, clean storefront that handles product discovery and checkout without the bloat of off-the-shelf platforms.',
    role: 'Designed and built the storefront end-to-end — product catalog, cart logic, and a frictionless checkout experience.',
    highlights: [
      'Responsive product grid with category filtering',
      'Persistent cart with quantity and total updates',
      'Clean, conversion-focused checkout flow',
    ],
  },
  {
    title: 'Denaro',
    niche: 'Fintech',
    outcome: 'Built the dashboard, budgeting flows, and charts behind a finance app people actually read at a glance.',
    description: 'A personal finance app for tracking income, expenses, and budgets with clean charts and clear insights.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=900&fit=crop',
    tags: ['Next.js', 'Tailwind', 'Charts', 'Auth'],
    size: 'small',
    href: 'https://denaro-one.vercel.app/',
    accent: 'from-lime-600/30 via-green-950/50 to-black/90',
    problem: 'People juggle finances across notes, banking apps, and spreadsheets without a clear picture of where their money goes.',
    role: 'Designed the dashboard and built the tracking flows, charting, and authenticated user accounts.',
    highlights: [
      'Track income, expenses, and budget categories in one place',
      'Visual breakdowns of spending with interactive charts',
      'Authenticated accounts with persistent personal data',
    ],
  },
]

export const projectTypeOptions = [
  { value: 'landing', label: 'Landing Page' },
  { value: 'business', label: 'Business Website' },
  { value: 'webapp', label: 'Web App / Custom Build' },
  { value: 'maintenance', label: 'Maintenance & Support' },
  { value: 'not-sure', label: "Not sure yet" },
]

export const budgetOptions = [
  { value: 'under-1k', label: 'Under $1,000' },
  { value: '1k-3k', label: '$1,000 – $3,000' },
  { value: '3k-6k', label: '$3,000 – $6,000' },
  { value: '6k-plus', label: '$6,000+' },
  { value: 'not-sure', label: "Not sure yet" },
]
