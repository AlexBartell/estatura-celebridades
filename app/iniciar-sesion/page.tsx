'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const supabase  = createClient() // ✅ Ahora está disponible en toda la función

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const userEmail = session?.user?.email

      if (userEmail === 'alex.dunno@gmail.com') {
        router.push('/admin')
      } else if (userEmail) {
        router.push('/')
      }
    }

    checkUser()
  }, [router, supabase])

  const login = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://estatura-celebridades.vercel.app/auth/callback', // Cambiar para producción
      },
    })
    if (error) alert('Error al iniciar sesión')
  }

  return (
    <main className="p-6">
      <h1 className="text-xl mb-4">Iniciar sesión</h1>
      <button onClick={login} className="bg-blue-600 text-white px-4 py-2 rounded">
        Iniciar con Google
      </button>
    </main>
  )
}
