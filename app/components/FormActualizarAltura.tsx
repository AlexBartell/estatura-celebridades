'use client'
import { useState } from 'react'
import { actualizarAlturaOficial } from '@/app/admin/actions'

export default function FormActualizarAltura({ id, alturaActual }: { id: string, alturaActual: number | null }) {
  const [altura, setAltura] = useState(alturaActual || '')
  const [mensaje, setMensaje] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await actualizarAlturaOficial(id, Number(altura))
      setMensaje('Altura actualizada correctamente.')
    } catch (err) {
      console.error(err)
      setMensaje('Hubo un error al actualizar la altura.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-2">
      <label className="block text-sm font-medium">Altura oficial (cm):</label>
      <input
        type="number"
        step="0.1"
        value={altura}
        onChange={(e) => setAltura(e.target.value)}
        className="border px-2 py-1 rounded w-full"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Actualizar
      </button>
      {mensaje && <p className="text-sm text-gray-700 mt-1">{mensaje}</p>}
    </form>
  )
}
