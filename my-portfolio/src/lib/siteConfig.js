// ---------------------------------------------------------------------------
// Single source of truth for anything commercial on the site: brand info,
// positioning copy, packages, pricing, methodology, proof, and objection
// handling. Edit copy and numbers here — nothing below is hardcoded again
// inside a component.
//
// FLAGGED AS PLACEHOLDER: every `price` and `timeframe` in `packages` below.
// Structure, positioning, and copy are real; the numbers are starting points
// until real pricing is locked in.
// ---------------------------------------------------------------------------

export const brand = {
  name: 'Eljo Shurdhi',
  role: 'Frontend Developer',
  location: 'Tirana, Albania',
  // Where the "Start My Project" form sends leads. Currently delivered via a
  // mailto fallback — see src/lib/leadForm.js for the swap-in point once a
  // real form backend (Formspree / EmailJS / Resend) is wired up.
  leadEmail: 'eljoshurdhi3095@gmail.com',
  directEmail: 'shurdhieljo@outlook.com',
  whatsapp: 'https://wa.me/355682080411',
  whatsappLabel: '+355 682 080 411',
  linkedin: 'https://www.linkedin.com/in/eljo-shurdhi-6580111bb/',
  github: 'https://github.com/3ljo',
}

// One dominant CTA phrase, repeated everywhere on purpose — recognition beats
// variety for a primary CTA. Secondary CTAs stay contextual per-section.
export const primaryCta = 'Start My Project'

export const navLinks = [
  { label: 'Work', href: '/work', type: 'route' },
  { label: 'How It Works', href: '/#how-it-works', type: 'hash' },
  { label: 'Pricing', href: '/pricing', type: 'route' },
  { label: 'Why Me', href: '/about', type: 'route' },
]

// Short, punchy marketing lines for the scrolling trust strip (<ProofStrip />)
// — adjectives and value statements, not stats or invented numbers. Each
// pairs with an icon key rendered in ProofStrip.jsx.
export const proofChips = [
  { icon: 'sparkles', text: 'Fully custom-built, never templated' },
  { icon: 'bolt', text: 'Fast without cutting corners' },
  { icon: 'document', text: 'Fixed price, always in writing' },
  { icon: 'chat', text: 'Direct line to the person building it' },
  { icon: 'shield', text: 'No agency layers, no runaround' },
  { icon: 'check', text: 'Live, working products — not prototypes' },
]

export const packages = [
  {
    slug: 'launch',
    name: 'Launch',
    forWho: 'You need to look legitimate online — today',
    problem: "No website, or one so outdated it's actively costing you trust and customers.",
    price: '$649',
    priceNote: 'starting at',
    timeframe: '5 days',
    recommended: false,
    ctaLabel: 'Start My Project',
    includes: [
      'One high-impact page built around your best offer',
      'Mobile-first — loads fast on any device',
      'Contact form or booking link wired in, leads land in your inbox',
      'Live on your domain, ready to send traffic to',
      '1 round of revisions included',
    ],
  },
  {
    slug: 'growth',
    name: 'Growth',
    forWho: 'Your site gets visitors, but too few of them convert',
    problem: 'Your business looks smaller and less credible online than it really is — and visitors leave without a word.',
    price: '$1,797',
    priceNote: 'starting at',
    timeframe: '2–3 weeks',
    recommended: true,
    ctaLabel: "Yes, Let's Build This",
    includes: [
      'Up to 5 pages, built to move visitors toward contacting you',
      'Mobile-first, accessible, built to rank on Google',
      'Lead form wired straight to your inbox',
      'Analytics set up so you can see what visitors actually do',
      '2 rounds of revisions included',
    ],
  },
  {
    slug: 'conversion',
    name: 'Conversion',
    forWho: 'Your business runs on logins, bookings, or data — not just pages',
    problem: 'Manual processes, spreadsheets, and back-and-forth emails are quietly costing you hours and leads every week.',
    price: '$4,497',
    priceNote: 'starting at',
    timeframe: 'Scoped on a discovery call',
    recommended: false,
    ctaLabel: 'Scope My Project',
    includes: [
      'Custom web app — logins, dashboards, bookings, or payments',
      'Built around the exact bottleneck costing you time or leads',
      'Integrates with the tools you already use',
      'One fixed price once scope is locked, no surprise invoices',
    ],
  },
  {
    slug: 'care',
    name: 'Care',
    forWho: 'Your site is live and needs to stay that way',
    problem: "Sites rot — broken forms, stale content, and slow load times quietly bleed leads if nobody's watching.",
    price: '$147',
    priceNote: '/mo',
    timeframe: 'Monthly retainer',
    recommended: false,
    ctaLabel: 'Get a Quote',
    includes: [
      'Content updates and small feature requests',
      'Uptime and dependency monitoring',
      'Bug fixes, typically same-week',
      'Cancel anytime — no lock-in contract',
    ],
  },
]

// The business case for the methodology — why each phase matters, not what
// framework it's built in. This is the "Solution" section: a transformation,
// not a coding process.
export const methodology = [
  {
    phase: 'Strategy',
    description:
      "Before any design happens, we get clear on who your customer is and what has to happen for them to contact you. Skip this and you get a pretty site that still doesn't sell.",
  },
  {
    phase: 'Design',
    description:
      'Every layout decision moves a stranger toward one action — not toward a design award. Credible, fast, and built around your offer.',
  },
  {
    phase: 'Build',
    description:
      "Hand-coded, not templated. Fast on every device, because a slow site loses customers before they even see what you sell.",
  },
  {
    phase: 'Launch',
    description:
      'Live on your domain, tested on real phones and browsers, connected to the tools you already use.',
  },
  {
    phase: 'Optimize',
    description:
      "A website is never really 'done.' Small fixes after launch — copy, forms, page speed — compound into more inquiries over time.",
  },
]

// The buying journey, in plain terms. This is the "How It Works" section —
// the goal is a visitor thinking "that's easy, let's do it."
export const processSteps = [
  {
    step: '01',
    title: 'Tell me what you need',
    description: "A quick message — what's the business problem, and what does success look like.",
  },
  {
    step: '02',
    title: 'We define the offer',
    description: 'A fixed price and scope, in writing. You know exactly what you\'re getting before anything starts.',
  },
  {
    step: '03',
    title: 'I design the experience',
    description: 'Not just what it looks like — how it moves a stranger toward contacting you.',
  },
  {
    step: '04',
    title: 'I build it',
    description: 'You see real progress as it happens, not a surprise reveal at the end.',
  },
  {
    step: '05',
    title: 'You launch',
    description: "Live on your domain, tested on real devices, ready to start earning its keep.",
  },
]

// The symptoms a business owner recognizes in themselves — this drives the
// Pain/Problem section.
export const painPoints = [
  "Your website looks like it hasn't been touched since 2015.",
  "You don't have a website at all, and you know it's costing you customers.",
  "You get visitors, but the phone doesn't ring and the inbox stays empty.",
  "Your competitors' websites look more professional than yours.",
  "People land on your site and can't tell what you actually do.",
  "It's slow, it's not mobile-friendly, and people leave before it loads.",
]

// Why trust him with the project — risk-reducers, not a biography.
export const whyMe = [
  {
    title: 'Direct line to the person building it',
    description: 'No account manager, no relay, no agency layers. You talk to me, I write the code.',
  },
  {
    title: 'Custom-built, never templated',
    description: "No page builder, no recycled theme. Every site is built around your business, not squeezed into one.",
  },
  {
    title: 'Fast, because slow costs you customers',
    description: 'Most projects launch in days or weeks, not months — with a fixed timeline confirmed before we start.',
  },
  {
    title: 'Built around one goal: conversions',
    description: 'Every layout and word choice exists to move a visitor toward contacting you, not to win design awards.',
  },
  {
    title: 'No bloat, no unnecessary complexity',
    description: "You get exactly what your business needs to convert — nothing you're paying for and never using.",
  },
  {
    title: 'Fixed price, in writing, before we start',
    description: 'No hourly billing surprises. You know the cost and the timeline upfront.',
  },
]

export const objections = [
  {
    question: 'I already have a website.',
    answer:
      "Good — that means you already know it's not pulling its weight, or you wouldn't be reading this. I can rebuild it around conversion, or tell you exactly what's costing you leads on a quick call.",
  },
  {
    question: "I don't have a big budget.",
    answer:
      'Neither did most of my clients when they started. The Launch package exists for exactly that — a real, working site for less than most businesses spend on ads in a month.',
  },
  {
    question: 'Can you do it quickly?',
    answer:
      "Yes — Launch ships in 5 days, Growth in 2–3 weeks. You get a specific date in writing before any work starts, not a vague estimate.",
  },
  {
    question: 'Will I be able to edit it myself?',
    answer:
      'Yes. You get a site built on tools you can actually update yourself — text, images, and content — without calling me for every small change.',
  },
  {
    question: 'What happens after launch?',
    answer:
      "I'm reachable, and the Care plan exists if you want ongoing updates and monitoring handled for you. Nothing gets abandoned the day it goes live.",
  },
  {
    question: 'Why not just use Wix or a template?',
    answer:
      "You can — plenty of businesses do, and plenty of visitors can tell within five seconds. A custom build loads faster, looks like nobody else's site, and is built around getting YOU customers instead of fitting a generic layout.",
  },
]

// Case studies as proof, not a portfolio gallery: Problem → What I Changed →
// Result. Results are stated honestly in plain terms — no invented numbers.
export const caseStudies = [
  {
    title: 'Sage Commerce',
    niche: 'E-commerce',
    outcome: 'Built a storefront that takes a shopper from browsing to checkout without the bloat of an off-the-shelf platform.',
    description: 'A modern online store with product browsing, cart, and a smooth checkout flow built for conversion.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=900&fit=crop',
    tags: ['Next.js', 'Tailwind', 'Stripe', 'React'],
    size: 'large',
    href: 'https://ecomerce-sage-eight.vercel.app/',
    accent: 'from-teal-600/30 via-emerald-950/50 to-black/90',
    problem: 'Small brands need a fast, clean storefront that handles product discovery and checkout without the bloat of off-the-shelf platforms.',
    role: 'Designed and built the storefront end-to-end — product catalog, cart logic, and a frictionless checkout experience.',
    result: 'Went from no online store to a full browse-to-checkout flow, live and taking orders.',
    highlights: [
      'Responsive product grid with category filtering',
      'Persistent cart with quantity and total updates',
      'Clean, conversion-focused checkout flow',
    ],
  },
  {
    title: 'CV Climber',
    niche: 'Career SaaS',
    outcome: 'Built the AI resume tool that turns a rough work history into an ATS-ready CV in minutes.',
    description: 'AI-powered resume builder that helps job seekers craft standout CVs and climb the career ladder faster.',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1600&h=900&fit=crop',
    tags: ['Next.js', 'AI', 'Tailwind', 'Stripe'],
    size: 'small',
    href: 'https://www.cvclimber.lol/',
    accent: 'from-emerald-600/30 via-emerald-950/50 to-black/90',
    problem: 'Job seekers struggle to translate their experience into a CV that ranks well on ATS systems and stands out to recruiters.',
    role: 'Designed the product end-to-end, built the AI resume generator, payment flow, and templated PDF export.',
    result: 'Launched with Stripe payments live from day one — a working, paid SaaS product, not a prototype.',
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
    result: 'Went from missed calls to a 24/7 answering system — every call now logged, transcribed, and turned into a lead.',
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
    result: 'Replaced spreadsheets and group chats with one login-protected dashboard the whole crew actually uses.',
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
    result: 'Went live with a premium-feeling site and a working contact funnel in place from day one.',
    highlights: [
      'Custom typography and color system',
      'Scroll-triggered animations with Framer Motion',
      'Mobile-first responsive layout',
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
    result: 'Replaced scattered notes and banking apps with one dashboard showing exactly where the money goes.',
    highlights: [
      'Track income, expenses, and budget categories in one place',
      'Visual breakdowns of spending with interactive charts',
      'Authenticated accounts with persistent personal data',
    ],
  },
]

// Template starting points — licensed, pre-built designs Eljo customizes with a
// client's brand, copy, and content for a faster, lower-cost launch than a fully
// custom build. These are NOT his own designs — never label them as case studies
// or portfolio work, always as licensed templates open for customization.
export const templateStyles = [
  {
    title: 'Grandeur',
    niche: 'Real Estate',
    description: 'Property listings, agent profiles, and inquiry forms — a starting point for realtors and property managers.',
    href: 'https://st.ourhtmldemo.com/new/Grandeur/?storefront=envato-elements',
    accent: 'from-amber-600/30 via-orange-950/60 to-black/90',
  },
  {
    title: 'Doctor',
    niche: 'Medical & Clinics',
    description: 'Appointment booking, doctor profiles, and service pages — a starting point for clinics and private practices.',
    href: 'https://demoxml.com/html/doctor/?storefront=envato-elements',
    accent: 'from-sky-600/30 via-blue-950/60 to-black/90',
  },
  {
    title: 'Construct',
    niche: 'Construction & Contracting',
    description: 'Project galleries, service breakdowns, and quote requests — a starting point for contractors and builders.',
    href: 'https://demoxml.com/html/construct/?storefront=envato-elements',
    accent: 'from-yellow-600/30 via-amber-950/60 to-black/90',
  },
  {
    title: 'MaxMuseum',
    niche: 'Museums & Culture',
    description: 'Exhibit showcases, event calendars, and visitor info — a starting point for museums and cultural venues.',
    href: 'https://demoxml.com/html/maxmuseum/?storefront=envato-elements',
    accent: 'from-violet-600/30 via-purple-950/60 to-black/90',
  },
  {
    title: 'Admin Dashboard',
    niche: 'Internal Tools',
    description: 'Data tables, charts, and role-based views — a starting point for internal or client-facing dashboards.',
    href: 'https://innap.dexignzone.com/codeigniter/demo/index_2',
    accent: 'from-emerald-600/30 via-teal-950/60 to-black/90',
  },
]

// Live thumbnail for a template demo link, via thum.io's public screenshot
// service — no API key, no manual asset sourcing. Renders the actual current
// page, so it stays accurate if the template demo changes.
export const templateScreenshot = href => `https://image.thum.io/get/width/1200/${href}`

export const projectTypeOptions = [
  { value: 'launch', label: 'Launch' },
  { value: 'growth', label: 'Growth' },
  { value: 'conversion', label: 'Conversion' },
  { value: 'care', label: 'Care' },
  { value: 'not-sure', label: "Not sure yet" },
]

export const budgetOptions = [
  { value: 'under-1k', label: 'Under $1,000' },
  { value: '1k-3k', label: '$1,000 – $3,000' },
  { value: '3k-6k', label: '$3,000 – $6,000' },
  { value: '6k-plus', label: '$6,000+' },
  { value: 'not-sure', label: "Not sure yet" },
]
