'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function FormAgregarCelebridad() { // <--- eliminado { userId }
  const [nombre, setNombre] = useState('')
  const [fotoUrl, setFotoUrl] = useState('')
  const [altura, setAltura] = useState('')
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMensaje(null)

    if (!nombre.trim()) {
      setMensaje('El nombre es obligatorio.')
      return
    }

    const alturaNum = parseFloat(altura)
    if (isNaN(alturaNum) || alturaNum < 50 || alturaNum > 300) {
      setMensaje('La altura debe ser un número válido entre 50 y 300.')
      return
    }

    const slug = nombre
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    const supabase = createClient()

    setLoading(true)
    // Chequear si existe
    const { data: yaExiste } = await supabase
      .from('celebridades')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (yaExiste) {
      setMensaje('Ya existe una celebridad con ese nombre o slug.')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('celebridades').insert({
      nombre,
      slug,
      foto_url: fotoUrl || null,
      altura_oficial: alturaNum,
      votos_total: 0,
      fecha_creacion: new Date().toISOString(),
      // Si quieres guardar el usuario que crea, agrega aquí: user_id: userId,
    })

    if (error) {
      setMensaje('Error al guardar. Intenta nuevamente.')
    } else {
      setMensaje('Celebridad agregada correctamente.')
      setNombre('')
      setFotoUrl('')
      setAltura('')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">URL de la foto</label>
        <input
          type="url"
          value={fotoUrl}
          onChange={e => setFotoUrl(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="https://..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Altura (en cm)</label>
        <input
          type="number"
          min={50}
          max={300}
          value={altura}
          onChange={e => setAltura(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Guardando...' : 'Guardar celebridad'}
      </button>
      {mensaje && (
        <p
          className={`text-sm mt-2 text-center ${
            mensaje.includes('Error') ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {mensaje}
        </p>
      )}
    </form>
  )
}
