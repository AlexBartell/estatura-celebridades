'use client'

import { createClient } from '@/lib/supabase/client'

type Props = {
  comentarioId: string
  userId: string
  valor: number // 1 para like, -1 para dislike
  onVotado: () => void
}

export default function ComentarioVoto({ comentarioId, userId, valor, onVotado }: Props) {
  const supabase  = createClient()

  const votar = async () => {
    await supabase
      .from('comentario_votos')
      .upsert(
        {
          comentario_id: comentarioId,
          usuario_id: userId,
          valor,
        },
        { onConflict: 'comentario_id,usuario_id' } // ← AQUÍ EL FIX
      )
    onVotado()
  }

  return (
    <button
      className={`px-2 py-1 rounded ${valor === 1 ? 'text-green-600' : 'text-red-600'}`}
      onClick={votar}
    >
      {valor === 1 ? '👍' : '👎'}
    </button>
  )
}
