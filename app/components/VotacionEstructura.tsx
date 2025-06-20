'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function VotacionEstatura({ celebridadId, userId }: { celebridadId: string, userId?: string }) {
  const supabase = createClient()
  const [alturaOficial, setAlturaOficial] = useState<number | null>(null)
  const [alturaPromedio, setAlturaPromedio] = useState<number | null>(null)
  const [cantidadVotos, setCantidadVotos] = useState<number>(0)
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

    // Cantidad de votos
    const { count } = await supabase
      .from('votos')
      .select('id', { count: 'exact', head: true })
      .eq('celebridad_id', celebridadId)
    setCantidadVotos(count || 0)

    // Chequear si ya votó este usuario
    if (userId) {
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
    if (!userId) return
    if (opcion === null || typeof opcion !== 'number') {
      setMensaje('Seleccioná una opción para votar.')
      return
    }

    setLoading(true)
    let error = null

    if (yaVoto && votoId) {
      // Actualiza voto
      const res = await supabase.from('votos')
        .update({ valor: opcion })
        .eq('id', votoId)
      error = res.error
    } else {
      // Inserta voto
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

  // Borrar voto
  const borrarVoto = async () => {
    if (!votoId) return
    setLoading(true)
    const { error } = await supabase.from('votos').delete().eq('id', votoId)
    if (error) {
      setMensaje('Error al borrar tu voto.')
    } else {
      setMensaje('Voto eliminado.')
      setOpcion(null)
      setYaVoto(false)
      setVotoId(null)
      await cargarDatos()
    }
    setLoading(false)
  }

  // Generar las opciones de voto (13 opciones de 0,5 cm en 6cm de rango)
  const opciones: number[] = typeof alturaOficial === 'number'
  ? Array.from({ length: 13 }, (_, i) =>
      Number((alturaOficial + (i - 6) * 0.5).toFixed(1))
    )
  : []
  // Si no hay altura oficial, usar un rango por defecto


  // Si no está logueado:
  if (!userId) {
    return (
      <div className="mt-6 space-y-2">
        <p className="text-gray-500">Iniciá sesión para votar la estatura.</p>
        {alturaPromedio !== null && (
          <p className="text-gray-700 mb-2">
            <strong>Altura promedio:</strong> {alturaPromedio} cm
          </p>
        )}
        <p className="text-xs text-gray-500">Cantidad de votos: {cantidadVotos}</p>
      </div>
    )
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
      <div className="flex gap-2 mt-2">
        <button
          onClick={manejarVoto}
          disabled={loading || opcion === null}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {yaVoto ? (loading ? 'Actualizando...' : 'Actualizar voto') : (loading ? 'Enviando...' : 'Votar')}
        </button>
        {yaVoto && (
          <button
            onClick={borrarVoto}
            disabled={loading}
            className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Borrando...' : 'Borrar voto'}
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500">Cantidad de votos: {cantidadVotos}</p>
      {mensaje && <p className="text-sm text-gray-700">{mensaje}</p>}
    </div>
  )
}
