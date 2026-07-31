import type { Metadata } from 'next'
import './globals.css'
import TopNav from '@/components/TopNav'

export const metadata: Metadata = {
  title: 'Cubor',
  description: 'Content engine for niche and affiliate content production',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <TopNav />
        {children}
      </body>
    </html>
  )
}
