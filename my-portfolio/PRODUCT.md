# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Owners of small businesses and early-stage founders who need a website or web
app that brings in customers. They are not developers. They are comparing a
freelancer against agencies, page builders (Wix) and templates, and they worry
about cost overruns, slow delivery and being passed between account managers.
(Inferred from the site copy: "For business owners, not developers" and the
meta description "small businesses and founders".)

## Product Purpose

The site sells Eljo Shurdhi's freelance frontend work: custom websites and web
apps built around conversion. Success means a visitor understands the offer,
trusts the work, and starts a project through the contact form, email or
WhatsApp.

## Positioning

One person designs and hand-codes the site around a single goal, getting the
client customers, with a fixed price in writing before work starts and a direct
line to the person building it. No agency layers, no page builder.

## Operating Context

Visitors arrive from LinkedIn, GitHub and referrals, on phones and desktops.
They compare packages, look at past work, and contact Eljo through a form that
opens their email app pre-filled, or directly by email, WhatsApp or LinkedIn.
Eljo is based in Tirana, Albania.

## Capabilities and Constraints

- Stack: React 19, Vite, Tailwind CSS 4, react-router 7, deployed on Vercel as
  an SPA. Routes: `/`, `/work`, `/pricing`, `/about`, `/contact`, 404.
- Content source of truth: `src/lib/siteConfig.js` (brand, CTA, packages,
  process, methodology, pain points, why-me, objections, case studies,
  templates, form options).
- Lead form validates its fields and opens a pre-filled email to
  `brand.leadEmail`; `src/lib/leadForm.js` is the swap point for a real
  backend later.
- Light and dark themes, chosen by the visitor and remembered.
- Package prices and timeframes are flagged as placeholders in siteConfig but
  are already shown on the live site. (Inferred: keep showing them as
  "starting at" prices with the note that every project gets a fixed quote in
  writing; the owner did not answer the pricing question.)
- Licensed templates (Envato) are a cheaper starting point and must never be
  presented as Eljo's own work.

## Brand Commitments

- Name: Eljo Shurdhi. Role: Frontend Developer. Location: Tirana, Albania.
- One primary CTA phrase, "Start My Project", repeated on purpose.
- Voice: plain, direct, about business outcomes (customers, inquiries); no
  framework talk, no invented numbers.
- The previous visual identity is not a commitment: the owner asked for a full
  redesign from zero.

## Evidence on Hand

- Six case studies with problem, role, result, highlights and live links:
  Sage Commerce, CV Climber, AI Receptionist, Nderto, ESHB, Denaro
  (`src/lib/siteConfig.js`).
- Three portrait photos of Eljo in `public/`.
- CV: `public/eljo-shurdhi-cv.pdf`.
- No testimonials, client logos, metrics or reviews exist. Do not fabricate
  them.
- No real screenshots of the projects are in the repo, and the build sandbox
  cannot reach the live sites. (Inferred: show code-drawn previews of each
  product, clearly illustrations, with an optional screenshot per project.)

## Product Principles

1. Prove with the work, not with adjectives.
2. Make buying feel safe: fixed price, a clear process, a direct line.
3. Talk about the visitor's customers and inquiries, never the tech stack.
4. Every page ends in one clear next step.

## Accessibility & Inclusion

WCAG AA contrast, full keyboard use, and reduced-motion support (inferred as
the standard; no specific requirement was stated).
