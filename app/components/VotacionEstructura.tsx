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

  // Cargar datos
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

    // Si está logueado, buscar voto previo
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
    }
  }

  useEffect(() => {
    cargarDatos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [celebridadId, userId])

  // Opciones en rango de 6cm (13 botones) en pasos de 0.5
  const opciones: number[] = typeof alturaOficial === 'number'
    ? Array.from({ length: 13 }, (_, i) => Number((alturaOficial + (i - 6) * 0.5).toFixed(1)))
    : []

  const manejarVoto = async () => {
    if (!userId) return
    if (opcion === null) {
      setMensaje('Seleccioná una opción para votar.')
      return
    }
    setLoading(true)
    let error = null

    if (yaVoto && votoId) {
      // Modificar voto existente
      const res = await supabase.from('votos').update({ valor: opcion }).eq('id', votoId)
      error = res.error
      setMensaje(error ? 'Error actualizando tu voto.' : '¡Voto actualizado!')
    } else {
      // Votar por primera vez
      const res = await supabase.from('votos').insert({
        celebridad_id: celebridadId,
        usuario_id: userId,
        valor: opcion,
      })
      error = res.error
      setMensaje(error ? 'Error al guardar tu voto.' : '¡Voto registrado! Gracias por participar.')
    }

    setLoading(false)
    await cargarDatos()
  }

  const borrarVoto = async () => {
    if (!votoId) return
    setLoading(true)
    const { error } = await supabase.from('votos').delete().eq('id', votoId)
    setMensaje(error ? 'Error al borrar tu voto.' : 'Voto eliminado.')
    setOpcion(null)
    setYaVoto(false)
    setVotoId(null)
    setLoading(false)
    await cargarDatos()
  }

  // Mostrar solo si logueado
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
        {opciones.map((op) => (
          <button
            key={op}
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
