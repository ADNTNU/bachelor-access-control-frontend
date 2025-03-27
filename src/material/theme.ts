'use client';
import { createTheme } from '@mui/material/styles';

const sharedThemeOptions: Parameters<typeof createTheme>[0] = {
  colorSchemes: {
    light: true,
    dark: true,
  },
  typography: {
    // fontFamily: 'var(--font-roboto)',
    fontFamily: 'var(--font-inter)',
  },
} satisfies Parameters<typeof createTheme>[0];

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-color-scheme',
  },
  ...sharedThemeOptions,
});

export default theme;

export const toolpadTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  ...sharedThemeOptions,
});

import type {} from '@mui/material/themeCssVarsAugmentation';
