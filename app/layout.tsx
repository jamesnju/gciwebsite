import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Gospel Centres International - Evangelism | Discipleship | Leadership',
  description: 'Welcome to Gospel Centres International - A place of faith, community, and spiritual growth',
  icons: {
    icon: [
      {
        url: '/favicon/favicon-16x16.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/favicon/favicon-16x16.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/favicon/favicon-16x16.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
