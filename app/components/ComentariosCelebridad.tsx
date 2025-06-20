'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ComentarioVoto from './ComentarioVoto'

interface Comentario {
  id: string
  contenido: string
  fecha: string
  usuario_id: string | null
  username: string | null
  moderado?: boolean | null    // ← Añadido para TypeScript
  comentario_votos?: { valor: number; usuario_id: string }[]
}

export default function ComentariosCelebridad({
  celebridadId,
  userId
}: {
  celebridadId: string
  userId?: string
}) {
  const supabase = createClient()
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [contenido, setContenido] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')

  // Traer solo comentarios moderados
  const cargarComentarios = async () => {
    const { data, error } = await supabase
      .from('comentarios')
      .select(`
        id,
        contenido,
        fecha,
        usuario_id,
        username,
        moderado,
        comentario_votos (valor, usuario_id)
      `)
      .eq('celebridad_id', celebridadId)
      .eq('moderado', true) // ← SOLO los moderados
      .order('fecha', { ascending: false })

    if (error) {
      setMensaje('Error cargando comentarios')
      setComentarios([])
    } else {
      setComentarios(data ?? [])
      setMensaje('')
    }
  }

  useEffect(() => {
    cargarComentarios()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [celebridadId])

  // Al guardar, también guarda el username
  const manejarComentario = async () => {
    if (!contenido.trim()) {
      setMensaje('El comentario no puede estar vacío.')
      return
    }
    setLoading(true)

    // Traé el username del usuario logueado
    let username = null
    if (userId) {
      const { data: usuarioData } = await supabase
        .from('usuarios')
        .select('username')
        .eq('id', userId)
        .single()
      username = usuarioData?.username || null
    }

    const { error } = await supabase.from('comentarios').insert({
      celebridad_id: celebridadId,
      usuario_id: userId,
      username,
      contenido,
      fecha: new Date().toISOString(),
      moderado: false // Cuando se crea NO está moderado
    })
    if (error) {
      setMensaje('Error al guardar el comentario.')
    } else {
      setContenido('')
      setMensaje('¡Comentario publicado! Será visible tras ser moderado.')
      await cargarComentarios()
    }
    setLoading(false)
  }

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-bold">Comentarios</h3>
      {comentarios.length === 0 && (
        <p className="text-gray-500">No hay comentarios todavía.</p>
      )}
      {comentarios.map((c) => {
        const likes = c.comentario_votos?.filter(v => v.valor === 1).length || 0
        const dislikes = c.comentario_votos?.filter(v => v.valor === -1).length || 0
        return (
          <div key={c.id} className="border-b pb-2 mb-2">
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
              <span className="font-semibold">
                {c.username
                  ? c.username
                  : c.usuario_id
                  ? c.usuario_id.slice(0, 8) + '...'
                  : 'Anónimo'}
              </span>
              <span>{new Date(c.fecha).toLocaleString()}</span>
            </div>
            <p className="text-gray-800">{c.contenido}</p>
            <div className="flex items-center gap-4 mt-1">
              <span>{likes} 👍</span>
              <span>{dislikes} 👎</span>
              {userId && (
                <>
                  <ComentarioVoto
                    comentarioId={c.id}
                    userId={userId}
                    valor={1}
                    onVotado={cargarComentarios}
                  />
                  <ComentarioVoto
                    comentarioId={c.id}
                    userId={userId}
                    valor={-1}
                    onVotado={cargarComentarios}
                  />
                </>
              )}
            </div>
          </div>
        )
      })}
      {userId ? (
        <div className="mt-4">
          <textarea
            value={contenido}
            onChange={e => setContenido(e.target.value)}
            placeholder="Dejá tu comentario..."
            className="w-full border rounded p-2"
            rows={2}
          />
          <button
            onClick={manejarComentario}
            disabled={loading || !contenido.trim()}
            className="mt-2 bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Comentar'}
          </button>
          {mensaje && <p className="text-sm text-gray-600 mt-1">{mensaje}</p>}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-2">Iniciá sesión para comentar.</p>
      )}
    </div>
  )
}
