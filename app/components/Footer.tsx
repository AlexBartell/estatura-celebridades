// app/components/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="p-4 mt-12 bg-gray-100 text-sm text-gray-700 flex flex-col sm:flex-row justify-between items-center border-t">
      <div className="flex flex-wrap gap-4 mb-2 sm:mb-0">
        <Link href="/privacidad" className="hover:underline">Privacidad</Link>
        <Link href="/cookies" className="hover:underline">Cookies</Link>
        <Link href="/aviso" className="hover:underline">Aviso legal</Link>
        <Link href="/sugerir" className="hover:underline">Sugerir celebridad</Link>
      </div>
      <span className="text-xs text-gray-500 mt-2 sm:mt-0">
        © {new Date().getFullYear()} Altura de famosos. Todas las estaturas son estimaciones aproximadas.
      </span>
    </footer>
  )
}
