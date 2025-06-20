'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ComentarioMod {
  id: string
  contenido: string
  username: string | null
  fecha: string
  moderado: boolean | null
  celebridad: { nombre: string } | null
}

export default function ListaComentariosModeracion() {
  const [comentarios, setComentarios] = useState<ComentarioMod[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const supabase = createClient()

  const cargarComentarios = async () => {
    setLoading(true)
    setMsg('')
    const { data, error } = await supabase
      .from('comentarios')
      .select('id, contenido, username, fecha, moderado, celebridad:celebridad_id(nombre)')
      .or('moderado.is.null,moderado.eq.false')
      .order('fecha', { ascending: true })
      .limit(50)
    if (error) setMsg('Error cargando comentarios')
    setComentarios(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    cargarComentarios()
    // eslint-disable-next-line
  }, [])

  const aprobar = async (id: string) => {
    setLoading(true)
    const { error } = await supabase
      .from('comentarios')
      .update({ moderado: true })
      .eq('id', id)
    if (error) setMsg('Error aprobando comentario')
    else setMsg('¡Comentario aprobado!')
    await cargarComentarios()
    setLoading(false)
  }

  const rechazar = async (id: string) => {
    setLoading(true)
    const { error } = await supabase
      .from('comentarios')
      .delete()
      .eq('id', id)
    if (error) setMsg('Error eliminando comentario')
    else setMsg('Comentario eliminado.')
    await cargarComentarios()
    setLoading(false)
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold mb-2">Comentarios pendientes de moderación</h2>
      {msg && <p className="text-sm text-gray-700 mb-2">{msg}</p>}
      {loading && <p className="text-gray-500">Cargando...</p>}
      {!comentarios.length && !loading && (
        <p className="text-gray-500">No hay comentarios pendientes.</p>
      )}
      <div className="space-y-4">
        {comentarios.map(c => (
          <div key={c.id} className="border p-3 rounded bg-yellow-50">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="font-semibold">{c.username || 'Anónimo'}</span>
                <span className="ml-2 text-xs text-gray-500">
                  {new Date(c.fecha).toLocaleString()}
                </span>
                {c.celebridad?.nombre && (
                  <span className="ml-3 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                    {c.celebridad.nombre}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => aprobar(c.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  disabled={loading}
                >
                  Aprobar
                </button>
                <button
                  onClick={() => rechazar(c.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  disabled={loading}
                >
                  Rechazar
                </button>
              </div>
            </div>
            <p className="mt-2">{c.contenido}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
