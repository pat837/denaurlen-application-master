import { Theme } from '@mui/material'
import { createContext, ReactNode, useEffect, useState } from 'react'

import { darkTheme, theme } from '../config/theme'

const THEME_KEY = 'g5F46gj7qeP'

type ThemeMode_ = 'DARK' | 'LIGHT'

type ThemeContext_ = {
  theme: Theme
  mode: ThemeMode_
  setTheme: (mode: ThemeMode_) => void
}

const ThemeContext = createContext<ThemeContext_>({
  theme: theme,
  mode: 'LIGHT',
  setTheme: (mode: ThemeMode_) => {}
})

const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode_>('LIGHT')

  useEffect(() => {
    const html = document.querySelector('html')
    if (!localStorage || !html) {
    } else {
      const selectedTheme = localStorage.getItem(THEME_KEY)

      if (!selectedTheme) {
        localStorage.setItem(THEME_KEY, 'LIGHT')
        setMode('LIGHT')
        html.dataset.theme = 'LIGHT'
      } else {
        if (selectedTheme === 'DARK') {
          localStorage.setItem(THEME_KEY, 'DARK')
          setMode('DARK')
          html.dataset.theme = 'DARK'
        } else if (selectedTheme === 'LIGHT') {
          localStorage.setItem(THEME_KEY, 'LIGHT')
          setMode('LIGHT')
          html.dataset.theme = 'LIGHT'
        }
      }
    }
  }, [])

  const setTheme = (mode: ThemeMode_) => {
    localStorage.setItem(THEME_KEY, mode)
    setMode(mode)
    const html = document.querySelector('html')
    if (!html) {
    } else html.dataset.theme = mode
  }

  return (
    <ThemeContext.Provider
      value={{
        mode,
        theme: mode === 'DARK' ? darkTheme : theme,
        setTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeContext }
export default ThemeContextProvider
