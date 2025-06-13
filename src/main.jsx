import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: 'hsla(232, 20%, 35%, 1)', // From your theme.scss $primary
      light: 'hsla(232, 20%, 45%, 1)',
      dark: 'hsla(232, 20%, 25%, 1)',
    },
    secondary: {
      main: 'hsla(192, 100%, 33%, 1)', // From your theme.scss $success
      light: 'hsla(192, 100%, 43%, 1)',
      dark: 'hsla(192, 100%, 23%, 1)',
    },
    background: {
      default: 'hsla(0, 9%, 98%, 1)', // From your theme.scss $secondary
      paper: '#ffffff',
    },
    text: {
      primary: 'hsla(232, 20%, 15%, 1)', // Dark version of your primary color
      secondary: 'hsla(232, 20%, 35%, 1)', // Your primary color
    },
  },
  typography: {
    fontFamily: '"Lato", "Open Sans", "Montserrat", "Roboto", system-ui, -apple-system, "Segoe UI", "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif',
    h4: {
      fontFamily: '"Playfair Display", "Bookman", serif',
      fontWeight: 700,
      fontSize: '2.125rem',
      lineHeight: 1.2,
      color: 'hsla(232, 20%, 35%, 1)',
    },
    h6: {
      fontFamily: '"Playfair Display", "Bookman", serif',
      fontWeight: 600,
      fontSize: '1.125rem',
      color: 'hsla(232, 20%, 35%, 1)',
    },
    body1: {
      fontFamily: '"Lato", sans-serif',
    },
    body2: {
      fontFamily: '"Lato", sans-serif',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#ffffff',
          border: '1px solid hsla(0, 0%, 90%, 1)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'hsla(0, 12%, 96%, 1)', // Matches your card hover effect
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid hsla(0, 0%, 85%, 1)',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#ffffff',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'hsla(232, 20%, 35%, 1)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'hsla(232, 20%, 35%, 1)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'hsla(232, 20%, 35%, 1)',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: 'hsla(232, 20%, 25%, 1)',
          },
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
); 