'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallback() {
  const router = useRouter()
  const supabase  = createClient()

  useEffect(() => {
    const fn = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user?.email === 'alex.dunno@gmail.com') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    }

    fn()
  }, [router, supabase])

  return <p>Redirigiendo...</p>
}
