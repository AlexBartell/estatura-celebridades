'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface User {
  email: string
  id: string
  // Agrega otros campos que quieras mostrar aquí
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
    // Mejor UX: recarga después de cerrar sesión exitosamente
    window.location.href = '/'
  }

  return (
    <header className="p-4 bg-gray-100 flex justify-between items-center">
      <Link href="/" className="font-bold text-xl">Altura de famosos</Link>
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
