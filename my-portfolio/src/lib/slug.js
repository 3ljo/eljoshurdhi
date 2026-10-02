// URL-safe anchor for a project, e.g. 'AI Receptionist' -> 'ai-receptionist'.
export const projectSlug = title => title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
