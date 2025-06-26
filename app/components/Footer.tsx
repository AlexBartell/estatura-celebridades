import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-blue-50 to-blue-200 border-t border-blue-100 mt-16 py-6 px-2">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-4 text-sm font-medium text-blue-800">
          <Link href="/privacidad" className="hover:underline">Privacidad</Link>
          <span className="opacity-40">|</span>
          <Link href="/cookies" className="hover:underline">Cookies</Link>
          <span className="opacity-40">|</span>
          <Link href="/aviso" className="hover:underline">Aviso legal</Link>
          <span className="opacity-40">|</span>
          <Link href="/sugerir" className="hover:underline">Sugerir celebridad</Link>
        </div>
        <span className="text-xs text-gray-500 text-center md:text-right max-w-md">
          © {new Date().getFullYear()} Altura de famosos. Todas las estaturas son estimaciones aproximadas.
        </span>
      </div>
    </footer>
  )
}
