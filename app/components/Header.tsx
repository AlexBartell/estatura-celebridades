'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface User {
  email: string
  id: string
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase  = createClient()

    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user as User | null)
      setLoading(false)
    }

    getUser()
  }, [])

  const cerrarSesion = async () => {
    const supabase  = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="p-4 bg-gray-100 flex justify-between items-center">
      <nav className="flex gap-4 items-center">
        <Link href="/" className="font-bold text-xl">Altura de famosos</Link>
        <Link href="/sugerir" className="text-sm underline text-blue-700 hover:text-blue-900">
          Sugerir celebridad
        </Link>
      </nav>
      {loading ? null : user ? (
        <div className="text-sm flex items-center gap-3">
          <span className="text-gray-800">{user.email}</span>
          <button
            onClick={cerrarSesion}
            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <Link
          href="/iniciar-sesion"
          className="text-sm underline text-blue-700 hover:text-blue-900"
        >
          Iniciar sesión
        </Link>
      )}
    </header>
  )
}
// app/components/Header.tsx
// Este componente Header muestra el logo, enlaces de navegación y el estado de sesión del usuario.
// Si el usuario está autenticado, muestra su email y un botón para cerrar sesión.
// Si no está autenticado, muestra un enlace para iniciar sesión.