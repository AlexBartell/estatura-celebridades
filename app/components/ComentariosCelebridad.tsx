'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ComentarioVoto from './ComentarioVoto'

interface Comentario {
  id: string
  contenido: string
  fecha: string
  usuario_id: string
  // Pueden ser usuarios o usuario, según el join
  usuarios?: { username: string | null }[] | null
  usuario?: { username: string | null } | null
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
  const [mensaje, setMensaje] = useState('')

  const cargarComentarios = async () => {
    const { data, error } = await supabase
      .from('comentarios')
      .select(`
        id,
        contenido,
        fecha,
        usuario_id,
        usuarios (
          username
        ),
        usuario (
          username
        ),
        comentario_votos (valor, usuario_id)
      `)
      .eq('celebridad_id', celebridadId)
      .order('fecha', { ascending: false })

    if (error) {
      setMensaje('Error cargando comentarios: ' + error.message)
      setComentarios([])
    } else {
      setComentarios(data ?? [])
      setMensaje('')
      // Debug: Mostrá el array entero en consola
      //veamos si hay mas cambios...
      console.log('Comentarios desde Supabase:', data)
    }
  }

  useEffect(() => {
    cargarComentarios()
  }, [celebridadId])

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-bold">Comentarios (debug)</h3>
      {mensaje && <p>{mensaje}</p>}
      {comentarios.length > 0 && (
        <pre style={{ background: "#eee", fontSize: 12, padding: 8 }}>
          {JSON.stringify(comentarios[0], null, 2)}
        </pre>
      )}
      {/* El resto del render lo podés comentar si querés */}
    </div>
  )
}
