'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ListaComentarios({ celebridadId, userId }: { celebridadId: string, userId: string }) {
  const supabase = createClient()
  const [comentarios, setComentarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarComentarios()
    // eslint-disable-next-line
  }, [celebridadId])

  async function cargarComentarios() {
    setLoading(true)
    // Traer comentarios y votos
    const { data, error } = await supabase
      .from('comentarios')
      .select(`
        id, contenido, fecha, usuario_id,
        comentario_votos (
          valor,
          usuario_id
        )
      `)
      .eq('celebridad_id', celebridadId)
      .order('fecha', { ascending: false })

    if (error) {
      setError('Error cargando comentarios')
      setLoading(false)
      return
    }

    setComentarios(data || [])
    setLoading(false)
  }

  // Votar comentario
  async function votarComentario(comentarioId: string, valor: number) {
    await supabase
      .from('comentario_votos')
      .upsert(
        {
          comentario_id: comentarioId,
          usuario_id: userId,
          valor,
        },
        { onConflict: ['comentario_id', 'usuario_id'] }
      )
    cargarComentarios()
  }

  if (loading) return <p>Cargando comentarios...</p>
  if (error) return <p>{error}</p>
  if (!comentarios.length) return <p>No hay comentarios.</p>

  return (
    <div className="space-y-4">
      {comentarios.map((comentario) => {
        const puntaje = comentario.comentario_votos
          ? comentario.comentario_votos.reduce((acc: number, voto: any) => acc + voto.valor, 0)
          : 0

        // Voto del usuario actual
        const miVoto = comentario.comentario_votos?.find((v: any) => v.usuario_id === userId)?.valor ?? 0

        return (
          <div key={comentario.id} className="border-b pb-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="font-semibold">{comentario.usuario_id.slice(0, 8)}...</span>
              <span>{new Date(comentario.fecha).toLocaleString()}</span>
            </div>
            <div className="my-1">{comentario.contenido}</div>
            <div className="flex items-center gap-2">
              <button
                disabled={miVoto === 1}
                onClick={() => votarComentario(comentario.id, 1)}
                className={`text-lg px-2 ${miVoto === 1 ? 'text-green-600 font-bold' : ''}`}
              >
                👍
              </button>
              <span className="font-mono">{puntaje}</span>
              <button
                disabled={miVoto === -1}
                onClick={() => votarComentario(comentario.id, -1)}
                className={`text-lg px-2 ${miVoto === -1 ? 'text-red-600 font-bold' : ''}`}
              >
                👎
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
