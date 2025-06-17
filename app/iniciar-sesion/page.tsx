'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { getOrSuggestUsername } from '@/lib/supabase/getOrSuggestUsername'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user

      if (!user) return

      // Primero chequea si es admin
      if (user.email === 'alex.dunno@gmail.com') {
        router.push('/admin')
        return
      }

      // Chequea si ya tiene username
      const username = await getOrSuggestUsername(user.id)
      if (!username) {
        router.push('/elige-nombre')
      } else {
        router.push('/')
      }
    }

    checkUser()
  }, [router, supabase])

  const login = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://estatura-celebridades.vercel.app/auth/callback', // Para prod
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
