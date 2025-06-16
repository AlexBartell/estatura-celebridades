'use client'

import { useEffect, useState } from 'react'
import { createClient } from './supabase/client' // <-- o './supabase' si tu archivo es ese

export interface SupabaseUser {
  id: string
  email: string
}

export function useUser() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(
  user
    ? { id: user.id, email: user.email ?? '' }
    : null
)
      setLoading(false)
    }

    getUser()
  }, [])

  return { user, loading }
}
