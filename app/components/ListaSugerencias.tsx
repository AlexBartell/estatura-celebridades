'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Sugerencia {
  id: string
  slug: string
  fecha: string
}

export default function ListaSugerencias() {
  const [sugerencias, setSugerencias] = useState<Sugerencia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    const cargar = async () => {
      setLoading(true)
      setError('')
      const { data, error } = await supabase
        .from('solicitudes_pendientes')
        .select('id, slug, fecha')
        .order('fecha', { ascending: false })
        .limit(50)

      if (error) {
        setError('Error cargando sugerencias')
        setSugerencias([])
      } else {
        setSugerencias(data ?? [])
      }
      setLoading(false)
    }
    cargar()
  }, [])

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold mb-4">Sugerencias de Celebridades</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {loading ? (
        <p>Cargando sugerencias...</p>
      ) : sugerencias.length === 0 ? (
        <p className="text-gray-500">No hay sugerencias pendientes.</p>
      ) : (
        <ul className="space-y-3">
          {sugerencias.map((sug) => (
            <li key={sug.id} className="border-b pb-2">
              <div className="font-semibold">{sug.slug}</div>
              <div className="text-xs text-gray-500">{new Date(sug.fecha).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
