import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Roboto, Inter } from "next/font/google";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { ThemeProvider } from "@mui/material/styles";
import { SessionProvider } from "next-auth/react";
import theme from "@material/theme";

import { type Metadata } from "next";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

const inter = Inter({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
      <head>
        {process.env.NODE_ENV === "development" && (
          <script
            crossOrigin="anonymous"
            src="//unpkg.com/react-scan/dist/auto.global.js"
            defer
          ></script>
        )}
      </head>
      <body
        className={`${inter.variable} ${roboto.variable}`}
        style={{ fontFamily: "var(--font-inter)", margin: 0 }}
      >
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <SessionProvider>
              <InitColorSchemeScript attribute="data-color-scheme" />
              {children}
            </SessionProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
