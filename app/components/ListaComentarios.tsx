'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ComentarioVoto {
  valor: number
  usuario_id: string
}

interface Comentario {
  id: string
  contenido: string
  fecha: string
  usuario_id: string
  comentario_votos: ComentarioVoto[]
}

interface Props {
  celebridadId: string
  userId: string
}

export default function ListaComentarios({ celebridadId, userId }: Props) {
  const supabase  = createClient()
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarComentarios()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [celebridadId])

  async function cargarComentarios() {
    setLoading(true)
    setError('')

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

    setComentarios((data as Comentario[]) || [])
    setLoading(false)
  }

  // Votar comentario: +1 o -1
  async function votarComentario(comentarioId: string, valor: number) {
    if (!userId) return
    await supabase
      .from('comentario_votos')
      .upsert(
        {
          comentario_id: comentarioId,
          usuario_id: userId,
          valor,
        },
        { onConflict: 'comentario_id,usuario_id' }
      )
    await cargarComentarios()
  }

  if (loading) return <p>Cargando comentarios...</p>
  if (error) return <p>{error}</p>
  if (!comentarios.length) return <p>No hay comentarios.</p>

  return (
    <div className="space-y-4">
      {comentarios.map((comentario) => {
        const puntaje = comentario.comentario_votos?.reduce((acc, voto) => acc + voto.valor, 0) ?? 0
        const miVoto = comentario.comentario_votos?.find((v) => v.usuario_id === userId)?.valor ?? 0
        const username = comentario.usuario_id ? comentario.usuario_id.slice(0, 8) + '...' : 'Anónimo'

        return (
          <div key={comentario.id} className="border-b pb-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="font-semibold">{username}</span>
              <span>{new Date(comentario.fecha).toLocaleString()}</span>
            </div>
            <div className="my-1">{comentario.contenido}</div>
            <div className="flex items-center gap-2">
              <button
                disabled={miVoto === 1}
                onClick={() => votarComentario(comentario.id, 1)}
                className={`text-lg px-2 ${miVoto === 1 ? 'text-green-600 font-bold' : ''}`}
                aria-label="Votar positivo"
              >
                👍
              </button>
              <span className="font-mono">{puntaje}</span>
              <button
                disabled={miVoto === -1}
                onClick={() => votarComentario(comentario.id, -1)}
                className={`text-lg px-2 ${miVoto === -1 ? 'text-red-600 font-bold' : ''}`}
                aria-label="Votar negativo"
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
