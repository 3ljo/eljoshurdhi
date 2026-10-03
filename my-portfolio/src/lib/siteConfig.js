// ---------------------------------------------------------------------------
// Single source of truth for anything commercial on the site: brand info,
// positioning copy, packages, pricing, proof, and objection handling. Edit
// copy and numbers here — nothing below is hardcoded again inside a component.
//
// Voice: every line sells what the business gets (calls, bookings, orders,
// trust, hours back), in words an owner uses. No tool names, no jargon, and
// no claim the projects can't back up.
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
  { label: 'How it works', href: '/#how-it-works', type: 'hash' },
  { label: 'Pricing', href: '/pricing', type: 'route' },
  { label: 'Why me', href: '/about', type: 'route' },
]

export const packages = [
  {
    slug: 'launch',
    name: 'Launch',
    forWho: 'Get online fast and start taking inquiries',
    problem: 'One sharp page that turns visitors into messages and bookings.',
    price: '$649',
    priceNote: 'starting at',
    timeframe: '5 days',
    recommended: false,
    ctaLabel: 'Start My Project',
    includes: [
      'One page built around your best offer',
      'Fast on every phone',
      'Messages and bookings land in your inbox',
      'Live on your own web address',
      '1 round of changes included',
    ],
  },
  {
    slug: 'growth',
    name: 'Growth',
    forWho: 'People visit, but too few get in touch',
    problem: 'Look as established as you really are, so visitors trust you enough to call.',
    price: '$1,797',
    priceNote: 'starting at',
    timeframe: '2–3 weeks',
    recommended: true,
    ctaLabel: "Yes, Let's Build This",
    includes: [
      'Up to 5 pages, each built to get you contacted',
      'Built to show up on Google and work on any phone',
      'Inquiries straight to your inbox',
      'See what visitors actually do on your site',
      '2 rounds of changes included',
    ],
  },
  {
    slug: 'conversion',
    name: 'Conversion',
    forWho: 'You need a system that does the work, not just a website',
    problem: 'Stop losing hours and customers to spreadsheets and back-and-forth emails.',
    price: '$4,497',
    priceNote: 'starting at',
    timeframe: 'Scoped on a discovery call',
    recommended: false,
    ctaLabel: 'Plan My Project',
    includes: [
      'Your own tool: bookings, payments, customer accounts or dashboards',
      'Built around the exact job eating your time or customers',
      'Works with the tools you already use',
      'One fixed price once we agree the plan, no surprise bills',
    ],
  },
  {
    slug: 'care',
    name: 'Care',
    forWho: "Your site keeps working, so you don't have to think about it",
    problem: 'Broken forms and stale pages quietly lose customers. I keep watch and fix them.',
    price: '$147',
    priceNote: '/mo',
    timeframe: 'Monthly retainer',
    recommended: false,
    ctaLabel: 'Start My Care Plan',
    includes: [
      'Text, photo and small updates done for you',
      'Your site watched so it stays online',
      'Problems fixed, usually the same week',
      'Cancel anytime, no contract',
    ],
  },
]

// The buying journey, in plain terms. This is the "How It Works" section —
// the goal is a visitor thinking "that's easy, let's do it."
export const processSteps = [
  {
    step: '01',
    title: 'Tell me what you need',
    description: 'One message: what you sell, and what you want more of. Calls, bookings or sales.',
  },
  {
    step: '02',
    title: 'Get your fixed price',
    description: 'Price, plan and launch date in writing, before any work starts.',
  },
  {
    step: '03',
    title: 'Go live',
    description: 'Watch it come together, then launch a site ready to earn its keep.',
  },
]

// The symptoms a business owner recognizes in themselves — this drives the
// Pain/Problem section.
export const painPoints = [
  "No website, or one you'd be embarrassed to send a customer to.",
  "People visit, but the phone doesn't ring.",
  'Your competitors look more professional online than you do.',
  "It's slow on a phone, so people leave before it loads.",
]

// Why trust him with the project — risk-reducers, not a biography.
export const whyMe = [
  {
    title: 'Fixed price, in writing, before we start',
    description: 'You know the cost and the date upfront. No surprise bills.',
  },
  {
    title: 'Direct line to the person building it',
    description: 'No account manager, no runaround. You talk to me.',
  },
  {
    title: 'Live in days or weeks, not months',
    description: 'Launch in 5 days, a full site in 2–3 weeks. It starts working for you sooner.',
  },
  {
    title: 'Built to bring you customers',
    description: 'Every word and button is there to get visitors to contact you.',
  },
]

export const objections = [
  {
    question: 'I already have a website.',
    answer: "If it isn't bringing in customers, I'll tell you why on a quick call, or rebuild it so it does.",
  },
  {
    question: "I don't have a big budget.",
    answer: 'Launch starts at $649 for a real, working site, live in 5 days.',
  },
  {
    question: 'How fast can I be live?',
    answer: 'Launch: 5 days. Growth: 2–3 weeks. You get a firm date before work starts.',
  },
  {
    question: 'What about after it goes live?',
    answer: "I'm still one message away. Want updates handled for you? Care covers it for $147 a month.",
  },
]

// Case studies as proof, not a portfolio gallery: the result first (outcome),
// then Before → The fix. Results are stated honestly in plain terms — no
// invented numbers, and no tool names: the reader is a business owner.
//
// Cover art, motion and the real screenshots for each project live in
// src/lib/media.js, keyed by the project slug.
export const caseStudies = [
  {
    title: 'Sage Commerce',
    niche: 'Online store',
    outcome: 'An online store, live and taking orders.',
    description: 'An online store that takes shoppers from browsing to checkout.',
    href: 'https://ecomerce-sage-eight.vercel.app/',
    problem: 'Small brands need a fast, simple shop, not a bloated one.',
    role: 'The whole store, designed and built: products, cart and checkout.',
  },
  {
    title: 'CV Climber',
    niche: 'Career tool',
    outcome: 'A polished CV in minutes, with payments live from day one.',
    description: 'An AI CV builder that helps job seekers write a standout CV and climb the career ladder faster.',
    href: 'https://www.cvclimber.lol/',
    problem: 'Job seekers struggle to write a CV recruiters notice.',
    role: 'An AI CV writer, with payments and downloads built in.',
  },
  {
    title: 'AI Receptionist',
    niche: 'Calls & bookings',
    outcome: 'Answers 24/7 and books the appointment. No more voicemail.',
    description: 'An AI that answers calls, books appointments and handles questions 24/7 for service businesses.',
    href: 'https://ai-recepsionist-codo.vercel.app/dashboard',
    problem: 'Calls go unanswered after hours, and those customers are gone.',
    role: 'An AI voice that answers callers, plus a dashboard for every call.',
  },
  {
    title: 'Nderto',
    niche: 'Construction',
    outcome: 'Construction work and materials, organised in one place.',
    description: 'A construction app that keeps work and materials organised in one place.',
    href: 'https://nderto.vercel.app/login',
    problem: 'Jobs and materials juggled across spreadsheets and chat apps.',
    role: 'The whole app, designed and built, behind a secure sign-in.',
  },
  {
    title: 'ESHB',
    niche: 'Agency launch',
    outcome: 'A new agency, looking premium and ready for inquiries from day one.',
    description: 'A bold launch site for a new agency, with a clear path to get in touch.',
    href: 'https://eshb.vercel.app/',
    problem: 'A new agency needed to look premium and win inquiries.',
    role: 'The whole site: the look, the motion, the contact form.',
  },
  {
    title: 'Denaro',
    niche: 'Finance app',
    outcome: 'Money and markets, made readable at a glance.',
    description: 'A finance app that turns money and market numbers into charts you read at a glance.',
    href: 'https://denaro-one.vercel.app/',
    problem: 'Financial numbers spread out and hard to read.',
    role: 'A clear dashboard with charts and private accounts.',
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
    description: 'Show listings and collect buyer inquiries. For realtors and property managers.',
    href: 'https://st.ourhtmldemo.com/new/Grandeur/?storefront=envato-elements',
  },
  {
    title: 'Doctor',
    niche: 'Medical & Clinics',
    description: 'Let patients book appointments online. For clinics and private practices.',
    href: 'https://demoxml.com/html/doctor/?storefront=envato-elements',
  },
  {
    title: 'Construct',
    niche: 'Construction & Contracting',
    description: 'Show your projects and collect quote requests. For contractors and builders.',
    href: 'https://demoxml.com/html/construct/?storefront=envato-elements',
  },
  {
    title: 'MaxMuseum',
    niche: 'Museums & Culture',
    description: 'Show exhibits and events, and tell visitors when to come. For museums and venues.',
    href: 'https://demoxml.com/html/maxmuseum/?storefront=envato-elements',
  },
  {
    title: 'Admin Dashboard',
    niche: 'Business dashboards',
    description: 'Tables, charts and staff-only views on one screen. For running your business.',
    href: 'https://innap.dexignzone.com/codeigniter/demo/index_2',
  },
]

export const projectTypeOptions = [
  { value: 'launch', label: 'Launch · one page' },
  { value: 'growth', label: 'Growth · full site' },
  { value: 'conversion', label: 'Conversion · custom system' },
  { value: 'care', label: 'Care · monthly upkeep' },
  { value: 'not-sure', label: "Not sure yet" },
]

export const budgetOptions = [
  { value: 'under-1k', label: 'Under $1,000' },
  { value: '1k-3k', label: '$1,000 – $3,000' },
  { value: '3k-6k', label: '$3,000 – $6,000' },
  { value: '6k-plus', label: '$6,000+' },
  { value: 'not-sure', label: "Not sure yet" },
]
