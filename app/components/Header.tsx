'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'

interface User {
  email: string
  id: string
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user as User | null)
      setLoading(false)
    }
    getUser()
  }, [])

  const cerrarSesion = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="w-full bg-gradient-to-r from-blue-50 to-blue-200 shadow-md rounded-b-2xl mb-3 px-0">
      <div className="max-w-6xl mx-auto flex justify-between items-center py-3 px-2 md:px-0">
        {/* Logo y título */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
            {/* Cambiá el src si tenés logo, si no, dejá el emoji */}
            {/* <Image src="/logo.png" alt="Logo" width={36} height={36} className="rounded-full" /> */}
            <span className="text-2xl select-none">📏</span>
            <span className="font-extrabold text-xl md:text-2xl text-blue-800 drop-shadow-sm">
              Altura de famosos
            </span>
          </Link>
        </div>
        {/* Nav y sesión */}
        <nav className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden sm:inline-block text-blue-700 text-sm font-medium px-3 py-1 rounded-xl hover:bg-blue-100 transition"
          >
            Inicio
          </Link>
          <Link
            href="/sugerir"
            className="text-blue-700 underline text-sm px-2 hover:text-blue-900 transition"
          >
            Sugerir celebridad
          </Link>
          {!loading && user ? (
            <div className="flex items-center gap-2 ml-3">
              <span className="text-gray-800 text-xs md:text-sm bg-blue-100 px-2 py-1 rounded-lg">
                {user.email}
              </span>
              <button
                onClick={cerrarSesion}
                className="bg-red-500 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-lg shadow transition"
              >
                Cerrar sesión
              </button>
            </div>
          ) : !loading ? (
            <Link
              href="/iniciar-sesion"
              className="bg-blue-600 hover:bg-blue-800 text-white text-xs px-3 py-1 rounded-lg shadow transition ml-3"
            >
              Iniciar sesión
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  )
}
