'use client'

import { createClient } from '@/lib/supabase/client'

export default function ComentarioVoto({
  comentarioId,
  userId,
  valor,
  onVotado,
}: {
  comentarioId: string
  userId: string
  valor: number // 1 (like) o -1 (dislike)
  onVotado: () => void
}) {
  const supabase = createClient()

  const votar = async () => {
    // Elimina voto anterior si existe y crea uno nuevo
    await supabase
      .from('comentario_votos')
      .upsert({
        comentario_id: comentarioId,
        usuario_id: userId,
        valor,
      }, { onConflict: ['comentario_id', 'usuario_id'] }) // Evita votos duplicados por usuario
    onVotado()
  }

  return (
    <button
      className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
      onClick={votar}
      title={valor === 1 ? "Me gusta" : "No me gusta"}
    >
      {valor === 1 ? '👍' : '👎'}
    </button>
  )
}
