'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/useUser'

type Comentario = {
  id: string
  contenido: string
  celebridad_id: string
  usuario_id: string | null
  fecha: string
}

export default function Comentarios({ celebridadId }: { celebridadId: string }) {
  const { user } = useUser()
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [nuevoComentario, setNuevoComentario] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    async function cargarComentarios() {
      const { data, error } = await supabase
        .from('comentarios')
        .select('*')
        .eq('celebridad_id', celebridadId)
        .order('fecha', { ascending: false })

      if (!error && data) setComentarios(data as Comentario[])
      else setComentarios([])
    }

    cargarComentarios()
  }, [celebridadId])

  const manejarEnvio = async () => {
    if (!nuevoComentario.trim()) return

    setEnviando(true)
    const { error } = await supabase.from('comentarios').insert({
      contenido: nuevoComentario,
      celebridad_id: celebridadId,
      usuario_id: user?.id ?? null,
    })

    if (!error) {
      setNuevoComentario('')
      // recargar comentarios
      const { data, error } = await supabase
        .from('comentarios')
        .select('*')
        .eq('celebridad_id', celebridadId)
        .order('fecha', { ascending: false })

      if (!error && data) setComentarios(data as Comentario[])
      else setComentarios([])
    }

    setEnviando(false)
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Comentarios</h2>
      <div className="mb-4">
        <textarea
          value={nuevoComentario}
          onChange={e => setNuevoComentario(e.target.value)}
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
              {comentario.usuario_id ? `Usuario: ${comentario.usuario_id.slice(0, 8)}...` : 'Anónimo'} ·{' '}
              {new Date(comentario.fecha).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
