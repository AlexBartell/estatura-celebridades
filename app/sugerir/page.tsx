'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SugerirCelebridad() {
  const [nombre, setNombre] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [logeado, setLogeado] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Chequear si el usuario está logueado
    const fn = async () => {
      const { data } = await supabase.auth.getUser()
      setLogeado(!!data.user)
    }
    fn()
  }, [supabase])

  function slugify(text: string) {
    return text
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }

  const enviarSugerencia = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) {
      setMensaje('Por favor escribí el nombre.')
      return
    }
    setEnviando(true)
    const slug = slugify(nombre.trim())

    const { error } = await supabase.from('solicitudes_pendientes').insert({
      slug,
      fecha: new Date().toISOString(),
    })
    setEnviando(false)
    if (error) {
      setMensaje('Error al enviar sugerencia.')
    } else {
      setMensaje('¡Gracias! Tu sugerencia fue enviada.')
      setNombre('')
      setTimeout(() => router.push('/'), 1500)
    }
  }

  if (!logeado) {
    return (
      <main className="max-w-lg mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">Sugerir nueva celebridad</h1>
        <p className="text-gray-600">Debés iniciar sesión para sugerir celebridades.</p>
      </main>
    )
  }

  return (
    <main className="max-w-lg mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Sugerir nueva celebridad</h1>
      <form onSubmit={enviarSugerencia} className="space-y-4">
        <input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Nombre de la celebridad"
          className="w-full border rounded p-2"
          disabled={enviando}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={enviando}
        >
          {enviando ? 'Enviando...' : 'Sugerir'}
        </button>
      </form>
      {mensaje && <p className="mt-2 text-gray-700">{mensaje}</p>}
    </main>
  )
}
