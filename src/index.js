import React from 'react';
import ReactDOM from 'react-dom/client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import TaxRefundForm from './components/TaxRefundForm';

// RTL setup
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// Create RTL theme
const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: [
      'Rubik',
      'Arial',
      'sans-serif'
    ].join(','),
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));

// Add global styles
const GlobalStyles = () => {
  return (
    <style>
      {`
        body {
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          min-height: 100vh;
          font-family: 'Rubik', sans-serif;
        }
      `}
    </style>
  );
};

root.render(
  <React.StrictMode>
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <TaxRefundForm />
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>
);
