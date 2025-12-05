import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import NextTopLoader from 'nextjs-toploader'

import { ThemeScript } from '@/components/shared/theme-script'
import { Toaster } from '@/components/ui/sonner'

import { QueryProvider } from './providers/query-provider'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: '400',
})

export const metadata: Metadata = {
  title: {
    default: 'Qrio',
    template: '%s - Qrio',
  },
  description: 'Starter template with Next.js 15, Tailwind CSS v4, and shadcn/ui.',
  icons: {
    icon: [{ url: '/icons/favicon.svg', type: 'image/svg+xml' }],
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
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
            enableColorScheme
          >
            <NextTopLoader color="var(--primary)" height={2} easing="linear" showSpinner={false} />
            <Toaster duration={5000} />
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
