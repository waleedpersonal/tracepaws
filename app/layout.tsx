import './globals.css'
import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { cn } from '@/lib/utils'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const jakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-jakarta'
})

export const metadata: Metadata = {
  title: 'TracePaws - Chain of Custody for Pet Crematoriums',
  description: 'Simple, affordable software that helps pet crematoriums document every step with photos and gives families peace of mind.',
  keywords: ['pet cremation', 'chain of custody', 'crematorium software', 'pet tracking'],
  authors: [{ name: 'TracePaws Team' }],
  openGraph: {
    title: 'TracePaws - Chain of Custody for Pet Crematoriums',
    description: 'Document every step of the cremation process with photos and timestamps.',
    type: 'website',
    locale: 'en_US'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={cn(
        "min-h-full bg-gray-50 font-sans antialiased",
        inter.variable,
        jakartaSans.variable
      )}>
        <div className="min-h-full">
          {children}
        </div>
      </body>
    </html>
  )
}