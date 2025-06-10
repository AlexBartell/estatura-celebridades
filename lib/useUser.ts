'use client'

import { useEffect, useState } from 'react'
import { createClient } from './supabase'

// Puedes definir solo las propiedades que necesitas del user (¡más seguro y eficiente!)
export interface SupabaseUser {
  id: string
  email: string
  [key: string]: any // si necesitas más propiedades, pero lo ideal es ser estricto
}

export function useUser() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user ? {
        id: user.id,
        email: user.email,
        ...user // si necesitas más propiedades, las incluyes aquí
      } : null)
      setLoading(false)
    }

    getUser()
  }, [])

  return { user, loading }
}
