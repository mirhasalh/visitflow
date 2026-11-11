import type { Metadata } from 'next'
import './globals.css'
import ToastContainer from '@/components/ToastContainer'

export const metadata: Metadata = {
  title: 'Visit Flow',
  description: 'Manage your visits.'
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>
        <ToastContainer />
        {children}
      </body>
    </html>
  )
}
