'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Voto = {
  valor: number | string
  usuario_id: string
}

export default function Votacion({
  celebridadId,
  userId,
}: {
  celebridadId: string
  userId: string
}) {
  const [valor, setValor] = useState('')
  const [promedio, setPromedio] = useState<number | null>(null)
  const [cantidad, setCantidad] = useState<number>(0)
  const [yaVoto, setYaVoto] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const supabase  = createClient() // aquí adentro
    async function cargarDatos() {
      const { data } = await supabase
        .from('votos')
        .select('valor, usuario_id')
        .eq('celebridad_id', celebridadId)

      if (data && data.length) {
        const suma = data.reduce((acc: number, voto: Voto) => acc + parseFloat(String(voto.valor)), 0)
        setPromedio(suma / data.length)
        setCantidad(data.length)
        setYaVoto(data.some((voto: Voto) => voto.usuario_id === userId))
      } else {
        setPromedio(null)
        setCantidad(0)
        setYaVoto(false)
      }
    }
    cargarDatos()
  }, [celebridadId, userId, loading])

  const votar = async () => {
    const supabase  = createClient()
    const num = parseFloat(valor)
    if (isNaN(num) || num < 100 || num > 250) {
      alert('Ingresá una estatura válida (entre 100 y 250 cm)')
      return
    }
    setLoading(true)
    // Prevenir doble voto
    const { data: yaExiste } = await supabase
      .from('votos')
      .select('id')
      .eq('celebridad_id', celebridadId)
      .eq('usuario_id', userId)
      .maybeSingle()

    if (yaExiste) {
      setYaVoto(true)
      setLoading(false)
      return
    }

    await supabase.from('votos').insert({
      celebridad_id: celebridadId,
      usuario_id: userId,
      valor: num,
    })
    setValor('')
    setLoading(false)
    // El useEffect recarga promedio y estado
  }

  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold mb-2">¿Cuánto creés que mide?</h2>
      {yaVoto ? (
        <div className="mb-2 text-green-600 font-semibold">¡Ya votaste!</div>
      ) : (
        <div className="flex items-center space-x-2 mb-2">
          <input
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Ej: 178"
            className="border px-2 py-1 rounded w-24"
            disabled={loading}
          />
          <button
            onClick={votar}
            className="bg-green-600 text-white px-3 py-1 rounded"
            disabled={loading || !valor.trim()}
          >
            {loading ? 'Enviando...' : 'Votar'}
          </button>
        </div>
      )}
      {promedio !== null && (
        <p className="text-sm text-gray-700">
          Promedio estimado: <strong>{promedio.toFixed(1)} cm</strong> ({cantidad} voto{cantidad !== 1 && 's'})
        </p>
      )}
    </section>
  )
}
