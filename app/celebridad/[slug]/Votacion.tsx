'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Votacion({
  celebridadId,
  userId
}: {
  celebridadId: string
  userId: string
}) {
  const supabase = createClient()
  const [valor, setValor] = useState('')
  const [promedio, setPromedio] = useState<number | null>(null)
  const [cantidad, setCantidad] = useState<number>(0)

  useEffect(() => {
    async function cargarDatos() {
      const { data, error } = await supabase
        .from('votos')
        .select('valor')
        .eq('celebridad_id', celebridadId)

      if (data && data.length) {
        const suma = data.reduce((acc, voto) => acc + parseFloat(voto.valor), 0)
        setPromedio(suma / data.length)
        setCantidad(data.length)
      } else {
        setPromedio(null)
        setCantidad(0)
      }
    }

    cargarDatos()
  }, [celebridadId])

  const votar = async () => {
    const num = parseFloat(valor)
    if (isNaN(num) || num < 100 || num > 250) {
      alert('Ingresá una estatura válida (entre 100 y 250 cm)')
      return
    }

    await supabase.from('votos').insert({
      celebridad_id: celebridadId,
      usuario_id: userId,
      valor: num,
    })

    setValor('')

    // recargar
    const { data } = await supabase
      .from('votos')
      .select('valor')
      .eq('celebridad_id', celebridadId)

    if (data && data.length) {
      const suma = data.reduce((acc, voto) => acc + parseFloat(voto.valor), 0)
      setPromedio(suma / data.length)
      setCantidad(data.length)
    } else {
      setPromedio(null)
      setCantidad(0)
    }
  }

  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold mb-2">¿Cuánto creés que mide?</h2>
      <div className="flex items-center space-x-2 mb-2">
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="Ej: 178"
          className="border px-2 py-1 rounded w-24"
        />
        <button onClick={votar} className="bg-green-600 text-white px-3 py-1 rounded">
          Votar
        </button>
      </div>
      {promedio !== null && (
        <p className="text-sm text-gray-700">
          Promedio estimado: <strong>{promedio.toFixed(1)} cm</strong> ({cantidad} votos)
        </p>
      )}
    </section>
  )
}
