// Every page is a sheet in the drawing set. Sheet numbers follow the
// architectural convention: A-0xx cover, A-1xx and up for the rest.
export const sheets = {
  '/': { number: 'A-001', title: 'Cover sheet' },
  '/work': { number: 'A-101', title: 'As-built drawings' },
  '/pricing': { number: 'A-201', title: 'Package schedule' },
  '/about': { number: 'A-301', title: 'The builder' },
  '/contact': { number: 'A-401', title: 'Request for quote' },
}

export const sheetFor = pathname => sheets[pathname] ?? { number: 'A-404', title: 'Sheet not found' }
