'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function FormAgregarCelebridad({ userId }: { userId: string }) {
  const [nombre, setNombre] = useState('')
  const [fotoUrl, setFotoUrl] = useState('')
  const [altura, setAltura] = useState('')
  const [mensaje, setMensaje] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensaje('')

    if (!nombre.trim()) {
      setMensaje('El nombre es obligatorio.')
      return
    }

    const alturaNum = parseFloat(altura)
    if (isNaN(alturaNum) || alturaNum <= 0) {
      setMensaje('La altura debe ser un número válido mayor a 0.')
      return
    }

    const slug = nombre
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    const supabase = createClient()

    const { error } = await supabase.from('celebridades').insert({
      nombre,
      slug,
      foto_url: fotoUrl || null,
      altura_oficial: alturaNum,
      votos_total: 0,
      fecha_creacion: new Date().toISOString(),
    })

    if (error) {
      console.error('Error al insertar:', JSON.stringify(error, null, 2))
      setMensaje('Error al guardar. Quizás ya existe una celebridad con ese nombre.')
    } else {
      setMensaje('Celebridad agregada correctamente.')
      setNombre('')
      setFotoUrl('')
      setAltura('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">URL de la foto</label>
        <input
          type="text"
          value={fotoUrl}
          onChange={(e) => setFotoUrl(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Altura (en cm)</label>
        <input
          type="number"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Guardar celebridad
      </button>

      {mensaje && <p className="text-sm mt-2 text-center">{mensaje}</p>}
    </form>
  )
}
