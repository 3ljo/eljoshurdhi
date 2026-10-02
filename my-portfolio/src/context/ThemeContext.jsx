import { useEffect, useState } from 'react'
import { ThemeContext } from './theme'

const STORAGE_KEY = 'theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'
// Browser chrome colours: the paper of each print.
const CHROME = { light: '#F1F4F6', dark: '#0D2C4D' }

function readSaved() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function ThemeProvider({ children }) {
  // A choice made with the toggle wins; until then, follow the system.
  const [saved, setSaved] = useState(readSaved)
  const [systemDark, setSystemDark] = useState(() => window.matchMedia(DARK_QUERY).matches)
  const dark = saved ? saved === 'dark' : systemDark

  useEffect(() => {
    const query = window.matchMedia(DARK_QUERY)
    const onChange = event => setSystemDark(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
      meta.setAttribute('content', dark ? CHROME.dark : CHROME.light)
    })
  }, [dark])

  const toggle = () => {
    const next = dark ? 'light' : 'dark'
    setSaved(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage is blocked; the choice still holds for this visit.
    }
  }

  return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>
}
