'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// Tipo para comentario pendiente de moderación
type ComentarioMod = {
  id: string
  contenido: string
  username: string | null
  fecha: string
  moderado: boolean | null
  celebridad: { nombre: string } | null // Relación normalizada
}

// Tipo crudo que retorna Supabase (celebridad es array o null)
type ComentarioDB = {
  id: string
  contenido: string
  username: string | null
  fecha: string
  moderado: boolean | null
  celebridad: { nombre: string }[] | null
}

export default function ListaComentariosModeracion() {
  const supabase = createClient()
  const [comentarios, setComentarios] = useState<ComentarioMod[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

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
        celebridad:celebridad_id (nombre)
      `)
      .or('moderado.is.null,moderado.eq.false')
      .order('fecha', { ascending: true })
      .limit(50)

    if (error) setMsg('Error cargando comentarios')

    // Normalizá la relación (celebridad como objeto, no array)
    const normalizados: ComentarioMod[] = (data ?? []).map((c: ComentarioDB) => ({
      ...c,
      celebridad: c.celebridad && Array.isArray(c.celebridad) ? c.celebridad[0] : null,
    }))

    setComentarios(normalizados)
    setLoading(false)
  }

  useEffect(() => {
    cargarComentarios()
  }, [])

  // Aprobar comentario
  const aprobar = async (id: string) => {
    await supabase.from('comentarios').update({ moderado: true }).eq('id', id)
    await cargarComentarios()
  }

  // Rechazar (borrar) comentario
  const rechazar = async (id: string) => {
    await supabase.from('comentarios').delete().eq('id', id)
    await cargarComentarios()
  }

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Comentarios pendientes de moderación</h2>
      {msg && <p className="text-red-600 mb-2">{msg}</p>}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="space-y-4">
          {comentarios.length === 0 && (
            <p className="text-gray-500">No hay comentarios pendientes.</p>
          )}
          {comentarios.map((c) => (
            <div key={c.id} className="border p-3 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-yellow-50">
              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1">
                  <span className="font-bold">{c.username || 'Anónimo'}</span>{' · '}
                  <span>{new Date(c.fecha).toLocaleString()}</span>{' · '}
                  <span className="italic text-blue-800">
                    {c.celebridad?.nombre || 'Sin celebridad'}
                  </span>
                </div>
                <div className="text-gray-900">{c.contenido}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => aprobar(c.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => rechazar(c.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
