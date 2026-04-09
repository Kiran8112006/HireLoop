import './globals.css'
import Providers from '../components/Providers'

export const metadata = {
  title: 'HireLoop',
  description: 'Streamline hiring with smart workflows.'
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
