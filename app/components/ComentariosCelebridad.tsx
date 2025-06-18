'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// interface Comentario igual que antes...
interface Comentario {
  id: string
  contenido: string
  fecha: string
  usuario_id: string
  usuario?: any // Para debuggear, ponelo en any, después lo tipificamos
  usuarios?: any // idem, para debug
  comentario_votos?: { valor: number; usuario_id: string }[]
}

export default function ComentariosCelebridad({
  celebridadId
}: {
  celebridadId: string
}) {
  const supabase = createClient()
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [mensaje, setMensaje] = useState('')

  // Traer comentarios con usuario/usuarios join para debug
  const cargarComentarios = async () => {
    const { data, error } = await supabase
      .from('comentarios')
      .select(`
        id,
        contenido,
        fecha,
        usuario_id,
        usuario (username),
        usuarios (username),
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
      // Log completo para ver cómo viene:
      console.log('DEBUG comentarios:', data)
    }
  }

  useEffect(() => {
    cargarComentarios()
    // No hay problema de dependencias porque la función no cambia
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [celebridadId])

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-lg font-bold">DEBUG Comentarios (copiame el output de abajo!)</h3>
      {mensaje && <p className="text-red-500">{mensaje}</p>}
      {comentarios.length === 0 && (
        <p className="text-gray-500">No hay comentarios todavía.</p>
      )}
      {comentarios.map((c, idx) => (
        <pre key={c.id} style={{ background: '#eee', padding: 8, fontSize: 12, overflowX: 'auto' }}>
          {JSON.stringify(c, null, 2)}
        </pre>
      ))}
    </div>
  )
}
