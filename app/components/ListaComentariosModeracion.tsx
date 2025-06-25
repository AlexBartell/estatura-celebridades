'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface CelebridadRelacion {
  nombre: string
}
interface ComentarioRaw {
  id: string
  contenido: string
  username: string | null
  fecha: string
  moderado: boolean | null
  celebridad: CelebridadRelacion | CelebridadRelacion[] | null
}

export default function ListaComentariosModeracion() {
  const [comentarios, setComentarios] = useState<ComentarioRaw[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const supabase = createClient()

  const cargarComentarios = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('comentarios')
      .select(`
        id,
        contenido,
        username,
        fecha,
        moderado,
        celebridad:celebridades(nombre)
      `)
      .eq('moderado', false)
      .order('fecha', { ascending: false })
      .limit(50)

    if (error) setMsg('Error cargando comentarios')
    // Normalizá celebridad: si viene como array, usá el primero, si viene como objeto, usalo directo.
    const normalizados: ComentarioRaw[] = (data ?? []).map((c: ComentarioRaw) => ({
      ...c,
      celebridad:
        c.celebridad && Array.isArray(c.celebridad)
          ? c.celebridad[0] || null
          : c.celebridad || null,
    }))
    setComentarios(normalizados)
    setLoading(false)
  }

  useEffect(() => {
    cargarComentarios()
    // eslint-disable-next-line
  }, [])

  const aprobarComentario = async (id: string) => {
    setLoading(true)
    const { error } = await supabase
      .from('comentarios')
      .update({ moderado: true })
      .eq('id', id)
    if (error) setMsg('Error al aprobar')
    await cargarComentarios()
    setLoading(false)
  }

  const rechazarComentario = async (id: string) => {
    setLoading(true)
    const { error } = await supabase
      .from('comentarios')
      .delete()
      .eq('id', id)
    if (error) setMsg('Error al rechazar')
    await cargarComentarios()
    setLoading(false)
  }

  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold mb-4">Comentarios pendientes de moderar</h2>
      {msg && <p className="text-red-600 mb-2">{msg}</p>}
      {loading && <p>Cargando...</p>}
      {!loading && comentarios.length === 0 && (
        <p className="text-gray-500">No hay comentarios pendientes.</p>
      )}
      <ul className="space-y-4">
        {comentarios.map((c) => (
          <li key={c.id} className="border-b pb-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold">{c.username || 'Anónimo'}</span>
                <span className="ml-3 text-sm text-gray-600">{new Date(c.fecha).toLocaleString()}</span>
                <div className="text-sm text-gray-700 mt-1">{c.contenido}</div>
                <div className="text-xs mt-1 italic text-gray-500">
                  Celebridad:{' '}
                  {
                    c.celebridad
                      ? Array.isArray(c.celebridad)
                        ? c.celebridad[0]?.nombre || 'Sin celebridad'
                        : c.celebridad.nombre || 'Sin celebridad'
                      : 'Sin celebridad'
                  }
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => aprobarComentario(c.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                  disabled={loading}
                >
                  Aprobar
                </button>
                <button
                  onClick={() => rechazarComentario(c.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  disabled={loading}
                >
                  Rechazar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
// Nota: Este componente asume que ya tienes configurado Supabase y la tabla 'comentarios' con las columnas adecuadas.