import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Roboto, Inter } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@material/theme';

import { type Metadata } from "next";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

const inter = Inter({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Access control",
  description: "Access control frontend for bachelor project",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <body className={`${inter.variable} ${roboto.variable}`} style={{ fontFamily: 'var(--font-inter)', margin: 0 }}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
       </body>
    </html>
  );
}
