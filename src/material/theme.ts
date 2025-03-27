'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: true,
    dark: true,
  },
  typography: {
    // fontFamily: 'var(--font-roboto)',
    fontFamily: 'var(--font-inter)',
  },
});

export default theme;