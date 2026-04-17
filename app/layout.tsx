import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Source_Sans_3 } from 'next/font/google'
import { AudioProvider } from '@/components/audio-provider'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
});

const sourceSans = Source_Sans_3({ 
  subsets: ["latin"],
  variable: '--font-source-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'KNOCK — Design Your Door',
  description: 'An AI-powered artistic exploration of Bob Dylan\'s "Knockin\' on Heaven\'s Door" (1973). A meditation on farewell, transition, and the thresholds we all must cross.',
  keywords: ['Bob Dylan', 'AI Art', 'Knockin on Heavens Door', '1973', 'generative art', 'interactive experience'],
}

export const viewport: Viewport = {
  themeColor: '#0f0d1a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        <AudioProvider>
          {children}
        </AudioProvider>
      </body>
    </html>
  )
}
