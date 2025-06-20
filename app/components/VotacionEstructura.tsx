'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function VotacionEstatura({ celebridadId, userId }: { celebridadId: string, userId: string }) {
  const supabase = createClient()
  const [alturaOficial, setAlturaOficial] = useState<number | null>(null)
  const [alturaPromedio, setAlturaPromedio] = useState<number | null>(null)
  const [opcion, setOpcion] = useState<number | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)
  const [yaVoto, setYaVoto] = useState(false)
  const [votoId, setVotoId] = useState<string | null>(null)

  // Cargar datos de la celebridad y si ya votó el usuario
  const cargarDatos = async () => {
    const { data: celeb } = await supabase
      .from('celebridades')
      .select('altura_oficial, altura_promedio')
      .eq('id', celebridadId)
      .single()

    setAlturaOficial(celeb?.altura_oficial ?? null)
    setAlturaPromedio(celeb?.altura_promedio ?? null)

    // Chequear si ya votó este usuario
    const { data: voto } = await supabase
      .from('votos')
      .select('id, valor')
      .eq('celebridad_id', celebridadId)
      .eq('usuario_id', userId)
      .maybeSingle()

    if (voto) {
      setOpcion(voto.valor)
      setYaVoto(true)
      setVotoId(voto.id)
    } else {
      setOpcion(null)
      setYaVoto(false)
      setVotoId(null)
    }
  }

  useEffect(() => {
    cargarDatos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [celebridadId, userId])

  const manejarVoto = async () => {
    if (opcion === null || typeof opcion !== 'number') {
      setMensaje('Seleccioná una opción para votar.')
      return
    }

    setLoading(true)
    let error = null

    if (yaVoto && votoId) {
      // Si ya votó, actualiza el voto
      const res = await supabase.from('votos')
        .update({ valor: opcion })
        .eq('id', votoId)
      error = res.error
    } else {
      // Si no votó, inserta
      const res = await supabase.from('votos').insert({
        celebridad_id: celebridadId,
        usuario_id: userId,
        valor: opcion,
      })
      error = res.error
    }

    if (error) {
      setMensaje('Error al guardar tu voto.')
      setLoading(false)
      return
    }

    await cargarDatos()
    setMensaje(yaVoto ? '¡Voto actualizado!' : '¡Voto registrado! Gracias por participar.')
    setLoading(false)
  }

  // Generar las opciones de voto (13 opciones de 0,5 cm en 6cm de rango)
  let opciones: number[] = []
  if (typeof alturaOficial === 'number') {
    for (let i = -3; i <= 3; i += 0.5) {
      opciones.push(Number((alturaOficial + i).toFixed(1)))
    }
  }

  return (
    <div className="mt-6 space-y-2">
      <h3 className="text-lg font-semibold">¿Cuánto crees que mide esta celebridad?</h3>
      {alturaPromedio !== null && (
        <p className="text-gray-700 mb-2">
          <strong>Altura promedio:</strong> {alturaPromedio} cm
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {opciones.map((op, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setOpcion(op)}
            className={`px-3 py-2 rounded border transition
              ${opcion === op ? 'bg-blue-600 text-white font-bold border-blue-700' : 'bg-white text-gray-900 border-gray-300'}
              hover:border-blue-500 hover:bg-blue-50`}
            disabled={loading}
          >
            {op} cm
          </button>
        ))}
      </div>
      <button
        onClick={manejarVoto}
        disabled={loading || opcion === null}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 mt-2"
      >
        {yaVoto ? (loading ? 'Actualizando...' : 'Actualizar voto') : (loading ? 'Enviando...' : 'Votar')}
      </button>
      {mensaje && <p className="text-sm text-gray-700">{mensaje}</p>}
    </div>
  )
}
