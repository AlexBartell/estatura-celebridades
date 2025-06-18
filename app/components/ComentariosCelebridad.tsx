'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// Para debug, declaramos las relaciones como opcionales y unknown
interface ComentarioDebug {
  id: string
  contenido: string
  fecha: string
  usuario_id: string
  usuario?: unknown
  usuarios?: unknown
  comentario_votos?: { valor: number; usuario_id: string }[]
}

export default function ComentariosCelebridad({
  celebridadId
}: {
  celebridadId: string
}) {
  const supabase = createClient()
  const [comentarios, setComentarios] = useState<ComentarioDebug[]>([])
  const [mensaje, setMensaje] = useState('')

  const { data, error } = await supabase
  .from('comentarios')
  .select(`
    id,
    contenido,
    fecha,
    usuario_id,
    usuario_id(username),
    comentario_votos(valor, usuario_id)
  `)
  .eq('celebridad_id', celebridadId)
  .order('fecha', { ascending: false })


    if (error) {
      setMensaje('Error cargando comentarios: ' + error.message)
      setComentarios([])
    } else {
      setComentarios(data ?? [])
      setMensaje('')
      // Mostrá el primer resultado en consola para debug
      if (data && data.length > 0) {
        console.log('DEBUG primer comentario:', data[0])
      }
    }
  }

  useEffect(() => {
    cargarComentarios()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [celebridadId])

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-bold">DEBUG Comentarios (copiame el output de abajo!)</h3>
      {mensaje && <p className="text-red-500">{mensaje}</p>}
      {comentarios.length === 0 && (
        <p className="text-gray-500">No hay comentarios todavía.</p>
      )}
      {/* Muestra el objeto del primer comentario para copiar aquí */}
      {comentarios.length > 0 && (
        <pre style={{ background: '#eee', padding: 8, fontSize: 12, overflowX: 'auto' }}>
          {JSON.stringify(comentarios[0], null, 2)}
        </pre>
      )}
    </div>
  )
}
