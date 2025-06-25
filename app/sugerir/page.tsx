'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SugerirCelebridadPage() {
  const supabase = createClient()
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Obtener usuario logueado
  const sugerirCelebridad = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)
    setMensaje('')

    // 1. Chequear sesión de usuario
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
      setMensaje('Debés iniciar sesión para sugerir una celebridad.')
      setEnviando(false)
      return
    }
    const userId = userData.user.id

    // 2. Obtener el nombre de usuario (opcional, pero lo pediste)
    let usuarioNombre = null
    if (userId) {
      const { data: usuario } = await supabase
        .from('usuarios')
        .select('username')
        .eq('id', userId)
        .single()
      usuarioNombre = usuario?.username || null
    }

    // 3. Insertar sugerencia con campos extra
    const { error } = await supabase.from('solicitudes_pendientes').insert({
      slug: nombre.trim(),
      fecha: new Date().toISOString(),
      id_usuario: userId,
      usuario_nombre: usuarioNombre,
    })

    if (error) {
      setMensaje('Error al enviar sugerencia.')
    } else {
      setMensaje('¡Sugerencia enviada! Gracias por tu aporte.')
      setNombre('')
      // router.push('/')  // Si querés redirigir después
    }
    setEnviando(false)
  }

  return (
    <main className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Sugerir nueva celebridad</h1>
      <form onSubmit={sugerirCelebridad} className="space-y-4">
        <input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Nombre o slug de la celebridad"
          disabled={enviando}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={enviando || !nombre.trim()}
        >
          {enviando ? 'Enviando...' : 'Sugerir'}
        </button>
      </form>
      {mensaje && <p className="mt-4 text-sm text-gray-700">{mensaje}</p>}
    </main>
  )
}
