import { createTheme } from '@mui/material'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      light: '#7d38b3',
      main: '#4b0082',
      dark: '#190054',
      contrastText: 'rgba(255, 255, 255, 0.86)'
    }
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    allVariants: {
      fontFamily: `'Inter', sans-serif`
    }
  }
})

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: '#b067e6',
      main: '#7d38b3',
      dark: '#4b0082',
      contrastText: 'rgba(255, 255, 255, 0.86)'
    },
    background: {
      default: '#1a1a1a',
      paper: '#000'
    }
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    allVariants: {
      fontFamily: `'Inter', sans-serif`
    }
  }
})
