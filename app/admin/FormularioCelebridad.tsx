'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function FormularioCelebridad() {
  const [nombre, setNombre] = useState('')
  const [slug, setSlug] = useState('')
  const [imagen, setImagen] = useState('')
  const [altura, setAltura] = useState('')

  const crear = async () => {
    if (!nombre || !slug || !altura) {
      alert('Faltan campos obligatorios.')
      return
    }

    const { error } = await supabase.from('celebridades').insert({
      nombre,
      slug,
      imagen_url: imagen,
      altura_promedio: parseFloat(altura),
    })

    if (error) {
      alert('Error al guardar')
    } else {
      alert('Guardado correctamente')
      setNombre('')
      setSlug('')
      setImagen('')
      setAltura('')
    }
  }

  return (
    <div className="space-y-4 max-w-md">
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => {
          setNombre(e.target.value)
          setSlug(
            e.target.value
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/\s+/g, '-')
          )
        }}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Slug (URL)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        placeholder="URL de imagen"
        value={imagen}
        onChange={(e) => setImagen(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="number"
        placeholder="Altura promedio (cm)"
        value={altura}
        onChange={(e) => setAltura(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button onClick={crear} className="bg-blue-600 text-white px-4 py-2 rounded">
        Guardar celebridad
      </button>
    </div>
  )
}
