// app/components/BuscadorCelebridades.tsx

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export type Celebridad = {
  id: string
  nombre: string
  slug: string
  foto_url?: string
  altura_promedio?: number
  altura_oficial?: number
}

interface BuscadorCelebridadesProps {
  onBuscar: (resultados: Celebridad[]) => void
}

export default function BuscadorCelebridades({ onBuscar }: BuscadorCelebridadesProps) {
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(false)

  const buscar = async () => {
    setLoading(true)
    const supabase  = await createClient()
    const { data, error } = await supabase
      .from('celebridades')
      .select('id, nombre, slug, foto_url, altura_promedio, altura_oficial')
      .ilike('nombre', `%${busqueda}%`)
      .limit(20)
    setLoading(false)
    if (!error && data) onBuscar(data)
    // puedes mostrar mensaje de error si lo necesitas
  }

  return (
    <div className="mb-4 flex gap-2">
      <input
        type="text"
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        placeholder="Buscar celebridad..."
        className="border px-3 py-2 rounded w-full"
      />
      <button
        onClick={buscar}
        disabled={loading || !busqueda.trim()}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Buscando...' : 'Buscar'}
      </button>
    </div>
  )
}
