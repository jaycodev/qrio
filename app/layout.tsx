import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import NextTopLoader from 'nextjs-toploader'

import { ThemeScript } from '@/components/shared/theme-script'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: '400',
})

export const metadata: Metadata = {
  title: 'Next.js + shadcn/ui Starter',
  description: 'Starter template with Next.js 15, Tailwind CSS v4, and shadcn/ui.',
  icons: {
    icon: [
      { url: '/favicon-light.svg', media: '(prefers-color-scheme: light)', type: 'image/svg+xml' },
      { url: '/favicon-dark.svg', media: '(prefers-color-scheme: dark)', type: 'image/svg+xml' },
    ],
  },
}

export function generateViewport() {
  return {
    themeColor: [{ color: 'oklch(0.141 0.005 285.823)' }],
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          enableColorScheme
        >
          <NextTopLoader color="var(--primary)" height={2} easing="linear" showSpinner={false} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
