import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import '@ksurdhar/react-nice-dates/build/style.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  style: 'normal',
  weight: ['400', '600'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Constellate - Habit Tracking',
  description: 'Simple habit tracking for all',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body className={`${inter.className} bg-soft-black`}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
