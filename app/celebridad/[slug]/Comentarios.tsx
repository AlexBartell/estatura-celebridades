'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/useUser'

export default function Comentarios({ celebridadId }: { celebridadId: string }) {
  const { user } = useUser()
  const [comentarios, setComentarios] = useState<any[]>([])
  const [nuevoComentario, setNuevoComentario] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    async function cargarComentarios() {
      const { data } = await supabase
        .from('comentarios')
        .select('*')
        .eq('celebridad_id', celebridadId)
        .order('fecha', { ascending: false })
      setComentarios(data || [])
    }

    cargarComentarios()
  }, [celebridadId])

  const manejarEnvio = async () => {
    if (!nuevoComentario.trim()) return

    // Opción: moderar automáticamente con IA más adelante

    setEnviando(true)
    const { error } = await supabase.from('comentarios').insert({
      contenido: nuevoComentario,
      celebridad_id: celebridadId,
      usuario_id: user?.id || null, // soporta anónimos
    })

    if (!error) {
      setNuevoComentario('')
      // recargar comentarios
      const { data } = await supabase
        .from('comentarios')
        .select('*')
        .eq('celebridad_id', celebridadId)
        .order('fecha', { ascending: false })
      setComentarios(data || [])
    }

    setEnviando(false)
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Comentarios</h2>

      <div className="mb-4">
        <textarea
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          placeholder={user ? 'Escribí tu comentario...' : 'Comentario anónimo...'}
        />
        <button
          onClick={manejarEnvio}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={enviando}
        >
          {enviando ? 'Enviando...' : 'Comentar'}
        </button>
      </div>

      <ul className="space-y-4">
        {comentarios.map((comentario) => (
          <li key={comentario.id} className="border-b pb-2">
            <p className="text-sm">{comentario.contenido}</p>
            <p className="text-xs text-gray-500 mt-1">
              {comentario.usuario_id ? 'Usuario registrado' : 'Anónimo'} ·{' '}
              {new Date(comentario.fecha).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
