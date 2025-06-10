// components/ListaCelebridadesAdmin.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface Celebridad {
  id: string
  nombre: string
  slug: string
  foto_url: string
  altura_promedio: number
  altura_oficial: number | null
}

export default function ListaCelebridadesAdmin() {
  const [celebridades, setCelebridades] = useState<Celebridad[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)

  const porPagina = 10

  useEffect(() => {
    const fetchData = async () => {
      const from = (pagina - 1) * porPagina
      const to = from + porPagina - 1

      const { data, error, count } = await supabase
        .from('celebridades')
        .select('*', { count: 'exact' })
        .ilike('nombre', `%${busqueda}%`)
        .order('fecha_creacion', { ascending: false })
        .range(from, to)

      if (!error && data) {
        setCelebridades(data)
        setTotalPaginas(Math.ceil((count || 0) / porPagina))
      }
    }

    fetchData()
  }, [busqueda, pagina])

  return (
    <div className="mt-8">
      <input
        type="text"
        placeholder="Buscar celebridad..."
        className="p-2 border rounded w-full mb-4"
        value={busqueda}
        onChange={(e) => {
          setPagina(1)
          setBusqueda(e.target.value)
        }}
      />

      <ul className="space-y-2">
        {celebridades.map((celeb) => (
          <li key={celeb.id} className="border p-2 rounded">
            <strong>{celeb.nombre}</strong> — Altura oficial:{' '}
            {celeb.altura_oficial ?? 'N/A'} cm — Promedio:{' '}
            {celeb.altura_promedio} cm
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4 mt-4">
        <button
          className="bg-gray-300 px-3 py-1 rounded"
          disabled={pagina === 1}
          onClick={() => setPagina(pagina - 1)}
        >
          Anterior
        </button>
        <span>
          Página {pagina} de {totalPaginas}
        </span>
        <button
          className="bg-gray-300 px-3 py-1 rounded"
          disabled={pagina === totalPaginas}
          onClick={() => setPagina(pagina + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
