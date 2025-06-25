'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Sugerencia {
  id: string
  slug: string
  fecha: string
  leida: boolean | null
}

export default function ListaSugerencias() {
  const [sugerencias, setSugerencias] = useState<Sugerencia[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  const supabase = createClient()

  const cargar = async () => {
    setLoading(true)
    setMsg('')
    const { data, error } = await supabase
      .from('solicitudes_pendientes')
      .select('id, slug, fecha, leida')
      .or('leida.is.null,leida.eq.false') // Solo no leídas o null
      .order('fecha', { ascending: false })
      .limit(50)

    if (error) {
      setMsg('Error cargando sugerencias')
      setSugerencias([])
    } else {
      setSugerencias(data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => { cargar() }, [])

  const marcarLeida = async (id: string) => {
    setLoading(true)
    const { error } = await supabase
      .from('solicitudes_pendientes')
      .update({ leida: true })
      .eq('id', id)
    if (error) setMsg('Error al marcar como leída')
    await cargar()
    setLoading(false)
  }

  const eliminar = async (id: string) => {
    setLoading(true)
    const { error } = await supabase
      .from('solicitudes_pendientes')
      .delete()
      .eq('id', id)
    if (error) setMsg('Error al eliminar')
    await cargar()
    setLoading(false)
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold mb-4">Sugerencias de Celebridades</h2>
      {msg && <p className="text-red-600 mb-2">{msg}</p>}
      {loading ? (
        <p>Cargando sugerencias...</p>
      ) : sugerencias.length === 0 ? (
        <p className="text-gray-500">No hay sugerencias pendientes.</p>
      ) : (
        <ul className="space-y-3">
          {sugerencias.map((sug) => (
            <li key={sug.id} className="border-b pb-2 flex justify-between items-center">
              <div>
                <div className="font-semibold">{sug.slug}</div>
                <div className="text-xs text-gray-500">{new Date(sug.fecha).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => marcarLeida(sug.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                  disabled={loading}
                >
                  Marcar como leída
                </button>
                <button
                  onClick={() => eliminar(sug.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                  disabled={loading}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
