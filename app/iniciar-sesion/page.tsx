'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Si querés usar iconos, asegurate de tener instalado react-icons: npm i react-icons
import { FcGoogle } from 'react-icons/fc'

export default function LoginPage() {
  const router = useRouter()
  const supabase  = createClient()

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
        redirectTo: 'https://estatura-celebridades.vercel.app/auth/callback',
      },
    })
    if (error) alert('Error al iniciar sesión')
  }

  return (
    <main className="min-h-[50vh] flex flex-col justify-center items-center">
      <div className="max-w-xs w-full p-6 bg-white rounded-xl shadow-md border">
        <h1 className="text-xl font-semibold mb-6 text-center">Iniciar sesión</h1>
        <button
          onClick={login}
          className="flex items-center justify-center gap-3 w-full bg-white border border-gray-300 hover:bg-gray-100 px-4 py-3 rounded-lg font-medium text-gray-700 shadow transition"
        >
          <FcGoogle size={22} />
          Iniciar sesión con Google
        </button>
        <p className="mt-6 text-xs text-gray-400 text-center">
          Solo usaremos tu email para autenticarte. Nunca compartiremos tu información.
        </p>
      </div>
    </main>
  )
}
