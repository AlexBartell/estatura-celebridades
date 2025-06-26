import './globals.css'
import Header from './components/Header'
import CookieBanner from '@/app/components/CookieBanner'
import Footer from './components/Footer'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Header />
        {children}
        <CookieBanner />
        <Footer />
      </body>
    </html>
  )
}
