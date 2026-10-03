// Every raster the site ships, by name. Generated renders carry their prompt
// inside the file (impeccable embed-prompt); screenshots carry their source
// URL and capture date the same way.
//
// Images live in public/media/img as <name>-<width>.(avif|webp).

export const images = {
  portrait: { widths: [720, 1080, 1440, 2160], w: 2160, h: 1920 },
  eshb: { widths: [640, 1024, 1600, 2032], w: 2033, h: 1124 },
  sage: { widths: [640, 1024, 1600, 2688], w: 2688, h: 1152 },
  cvclimber: { widths: [640, 1024, 1600, 2048], w: 2048, h: 1360 },
  receptionist: { widths: [640, 1024, 1600, 2048], w: 2048, h: 1360 },
  nderto: { widths: [640, 1024, 1600, 2048], w: 2048, h: 1360 },
  denaro: { widths: [640, 1024, 1600, 2048], w: 2048, h: 1360 },
  posters: { widths: [640, 1024, 1600, 2048], w: 2048, h: 1360 },
  shopper: { widths: [640, 1024, 1600, 2048], w: 2048, h: 1360 },
  laptop: { widths: [560, 900, 1280, 1792], w: 1792, h: 2240 },
}

export const srcSet = (name, ext) =>
  images[name].widths.map(width => `/media/img/${name}-${width}.${ext} ${width}w`).join(', ')

export const largest = name => {
  const { widths } = images[name]
  return `/media/img/${name}-${widths[widths.length - 1]}.webp`
}

// Cover lines, cover art, motion and real screenshots for each case study,
// keyed by the project slug. Each cover line restates the project's own
// result from siteConfig in the magazine's voice. `loginOnly` marks live apps whose product sits behind sign-in:
// the screenshot shows the real login screen and says so.
export const projectMedia = {
  eshb: {
    coverline: ['The streets', 'build brands'],
    cover: 'eshb',
    coverAlt: 'Black-and-white street photo of a hooded figure, face covered, in front of an old apartment block',
    shot: 'eshb',
    long: true,
  },
  'sage-commerce': {
    coverline: ['More than', 'just sneakers'],
    cover: 'sage',
    coverAlt: 'Black-and-white sneakers and white socks resting on a concrete ledge under a deep blue sky',
    shot: 'sage',
    long: true,
  },
  'cv-climber': {
    coverline: ['Climb the', 'ladder faster'],
    cover: 'cvclimber',
    coverAlt: 'Low angle on sneakers climbing graffiti-covered concrete stairs toward a blue sky',
    video: 'stairs',
    shot: 'cvclimber',
    long: true,
  },
  'ai-receptionist': {
    coverline: ['Every call', 'gets answered'],
    cover: 'receptionist',
    coverAlt: 'A street payphone at night, its handset hanging off the hook',
    video: 'payphone',
    shot: 'aireceptionist',
    loginOnly: true,
  },
  nderto: {
    coverline: ['One dashboard', 'for the whole crew'],
    cover: 'nderto',
    coverAlt: 'Gloved hands holding a rugged tablet over rebar on a construction site',
    shot: 'nderto',
    loginOnly: true,
  },
  denaro: {
    coverline: ['Know where', 'the money goes'],
    cover: 'denaro',
    coverAlt: 'A hand pulling folded notes from a worn leather wallet on a café table',
    shot: 'denaro',
    long: true,
  },
}

export const templateShots = {
  Grandeur: 'tpl-grandeur',
  Doctor: 'tpl-doctor',
  Construct: 'tpl-construct',
  MaxMuseum: 'tpl-maxmuseum',
  'Admin Dashboard': 'tpl-admin',
}
