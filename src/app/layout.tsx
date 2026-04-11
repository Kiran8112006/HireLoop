import './globals.css'
import Providers from '../components/Providers'

export const metadata = {
  title: 'HireLoop | College Hiring Portal',
  description: 'A professional college hiring portal for students, recruiters, and the placement team.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="hydrated" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
