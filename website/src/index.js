// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Define your monotone color palette
const greyPalette = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#eeeeee',
  300: '#e0e0e0',
  400: '#bdbdbd',
  500: '#9e9e9e', // Base grey
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
  A100: '#d5d5d5',
  A200: '#aaaaaa',
  A400: '#909090',
  A700: '#616161',
};

const theme = createTheme({
  palette: {
    mode: 'light', // Keep light mode, or switch to 'dark' if you prefer a dark theme with color accents
    primary: {
      main: '#2196f3', // Material Blue 500 - a classic, trustworthy primary blue
      light: '#6ec6ff',
      dark: '#0069c0',
      contrastText: '#fff', // White text for contrast on primary
    },
    secondary: {
      main: '#ff4081', // Material Pink A200 - a vibrant, energetic secondary pink/magenta
      light: '#ff79b0',
      dark: '#c60055',
      contrastText: '#fff', // White text for contrast on secondary
    },
    background: {
      default: '#f5f5f5', // Light gray background - still clean, but slightly warmer than pure white
      paper: '#fff',      // White for paper surfaces
    },
    text: {
      primary: '#333',      // Dark gray primary text
      secondary: '#757575', // Medium gray secondary text
    },
    // You can customize error, warning, info, success colors as needed
  },
  typography: {
    // You can adjust typography as desired
  },
  components: {
    // You can customize specific components if needed
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#2196f3', // Ensure AppBar uses primary.main
          color: '#fff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: '#fff',
        },
        containedSecondary: {
          color: '#fff',
        },
      },
    },
  },
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);