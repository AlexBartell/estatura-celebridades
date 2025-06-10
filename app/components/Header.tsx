'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Header() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()
  }, [])

  const cerrarSesion = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    location.reload()
  }

  return (
    <header className="p-4 bg-gray-100 flex justify-between">
      <span>Logo</span>
      {user ? (
        <div className="text-sm">
          {user.email} - <button onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      ) : (
        <a href="/iniciar-sesion" className="text-sm underline">
          Iniciar sesión
        </a>
      )}
    </header>
  )
}
