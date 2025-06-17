'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getOrCreateUsername } from '@/lib/supabase/useOrCreateUsername'

export default function AuthCallback() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fn = async () => {
      const { data } = await supabase.auth.getUser()
      const user = data.user

      if (!user) {
        router.push('/iniciar-sesion') // o la ruta de login que uses
        return
      }
const username = await getOrCreateUsername(user.id)
      // Si es admin, va a /admin
      if (user.email === 'alex.dunno@gmail.com') {
        router.push('/admin')
        return
      }

      // Chequear si ya tiene username (en tabla usuarios)
      
      if (!username) {
        router.push('/elige-nombre')
      } else {
        router.push('/')
      }
    }

    fn()
  }, [router, supabase])

  return <p>Redirigiendo...</p>
}
