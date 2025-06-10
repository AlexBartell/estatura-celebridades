'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function VotacionEstatura({ celebridadId, userId }: { celebridadId: string, userId: string }) {
  const supabase = createClient()
  const [altura, setAltura] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)
  const [alturaPromedio, setAlturaPromedio] = useState<number | null>(null)
  const [yaVoto, setYaVoto] = useState(false)

  // Cargar promedio y si ya votó
  const cargarDatos = async () => {
    // Traer promedio guardado en la tabla
    const { data: celeb } = await supabase
      .from('celebridades')
      .select('altura_promedio')
      .eq('id', celebridadId)
      .single()

    setAlturaPromedio(celeb?.altura_promedio ?? null)

    // Chequear si ya votó este usuario
    const { data: voto } = await supabase
      .from('votos')
      .select('id')
      .eq('celebridad_id', celebridadId)
      .eq('usuario_id', userId)
      .maybeSingle()

    setYaVoto(!!voto)
  }

  useEffect(() => {
    cargarDatos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [celebridadId, userId])

  const manejarVoto = async () => {
    const alturaNum = parseFloat(altura)
    if (isNaN(alturaNum) || alturaNum < 100 || alturaNum > 250) {
      setMensaje('Por favor ingresa una altura válida entre 100 y 250 cm.')
      return
    }

    setLoading(true)
    // Usar el endpoint en vez de llamar a Supabase desde el front
    const res = await fetch('/api/votar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        celebridadId,
        userId,
        valor: alturaNum,
      }),
    })
    const data = await res.json()

    if (!data.ok) {
      setMensaje(data.error || 'Error al guardar tu voto. Puede que ya hayas votado.')
      setLoading(false)
      return
    }

    setYaVoto(true)
    setAlturaPromedio(data.promedio ?? null)
    setMensaje('¡Voto registrado! Gracias por participar.')
    setAltura('')
    setLoading(false)
  }

  return (
    <div className="mt-6 space-y-2">
      <h3 className="text-lg font-semibold">¿Cuánto crees que mide esta celebridad?</h3>
      {alturaPromedio !== null && (
        <p className="text-gray-700 mb-2">
          <strong>Altura promedio:</strong> {alturaPromedio} cm
        </p>
      )}
      {yaVoto ? (
        <p className="text-green-600 font-semibold">¡Ya votaste por esta celebridad!</p>
      ) : (
        <>
          <input
            type="number"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
            placeholder="Altura en cm"
            className="border px-3 py-2 rounded w-full max-w-xs"
          />
          <button
            onClick={manejarVoto}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Votar'}
          </button>
        </>
      )}
      {mensaje && <p className="text-sm text-gray-700">{mensaje}</p>}
    </div>
  )
}
