'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type ComentarioMod = {
  id: string
  contenido: string
  username: string | null
  fecha: string
  moderado: boolean | null
  celebridad: { nombre: string } | null
}

export default function ListaComentariosModeracion() {
  const supabase = createClient()
  const [comentarios, setComentarios] = useState<ComentarioMod[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  // Traer comentarios no moderados con el nombre de la celebridad
  const cargarComentarios = async () => {
    setLoading(true)
    setMsg('')
    const { data, error } = await supabase
      .from('comentarios')
      .select(`
        id,
        contenido,
        username,
        fecha,
        moderado,
        celebridad:celebridad_id (
          nombre
        )
      `)
      .eq('moderado', false)
      .order('fecha', { ascending: false })
      .limit(50)
    if (error) setMsg('Error cargando comentarios')
    setComentarios(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    cargarComentarios()
  }, [])

  // Aprobar
  const aprobarComentario = async (id: string) => {
    setLoading(true)
    const { error } = await supabase
      .from('comentarios')
      .update({ moderado: true })
      .eq('id', id)
    if (!error) {
      setMsg('Comentario aprobado.')
      await cargarComentarios()
    }
    setLoading(false)
  }

  // Rechazar (borrar)
  const borrarComentario = async (id: string) => {
    setLoading(true)
    const { error } = await supabase
      .from('comentarios')
      .delete()
      .eq('id', id)
    if (!error) {
      setMsg('Comentario eliminado.')
      await cargarComentarios()
    }
    setLoading(false)
  }

  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold mb-4">Moderación de comentarios</h2>
      {msg && <p className="text-green-700 mb-2">{msg}</p>}
      {loading && <p className="text-gray-500">Cargando...</p>}
      {!loading && comentarios.length === 0 && (
        <p className="text-gray-500">No hay comentarios pendientes.</p>
      )}
      <ul className="space-y-4">
        {comentarios.map((c) => (
          <li key={c.id} className="border p-3 rounded shadow bg-white">
            <div className="mb-1">
              <span className="font-semibold text-blue-700">
                Celebridad: {c.celebridad?.nombre || <span className="text-red-600">Sin celebridad</span>}
              </span>
            </div>
            <div className="mb-1">
              <span className="font-semibold">{c.username ?? 'Anónimo'}</span>{' '}
              <span className="text-xs text-gray-600">{new Date(c.fecha).toLocaleString()}</span>
            </div>
            <p className="mb-2">{c.contenido}</p>
            <div className="flex gap-3">
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={() => aprobarComentario(c.id)}
                disabled={loading}
              >
                Aprobar
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => borrarComentario(c.id)}
                disabled={loading}
              >
                Rechazar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
