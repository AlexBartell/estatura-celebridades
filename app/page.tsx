'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import CookieBanner from '@/app/components/CookieBanner'

interface Celebridad {
  id: string
  nombre: string
  slug: string
  foto_url: string | null
  altura_promedio: number | null
  altura_oficial: number | null
}

export default function HomePage() {
  const [celebridades, setCelebridades] = useState<Celebridad[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const supabase  = createClient()

  useEffect(() => {
    const cargarUsuario = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user && user.email ? { email: user.email } : null)
    }
    cargarUsuario()
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const cargarCelebridades = async () => {
        setLoading(true)
        let query = supabase
          .from('celebridades')
          .select('id, nombre, slug, foto_url, altura_promedio, altura_oficial')
          .order('fecha_creacion', { ascending: false })
          .limit(30)

        if (busqueda.trim()) {
          query = query.ilike('nombre', `%${busqueda}%`)
        }

        const { data, error } = await query
        if (error) {
          console.error('Error al buscar celebridades:', error)
          setCelebridades([])
        } else {
          setCelebridades((data as Celebridad[]) || [])
        }
        setLoading(false)
      }

      cargarCelebridades()
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [busqueda])

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Listado de Celebridades</h1>
      {user && <p className="text-green-600 text-sm">Sesión activa: {user.email}</p>}

      <input
        type="text"
        placeholder="Buscar celebridad..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full max-w-md border border-gray-300 rounded px-4 py-2"
      />

      {loading && <p className="text-gray-500 text-sm">Cargando resultados...</p>}

      {!loading && !celebridades.length && (
        <p className="text-gray-500 text-sm">No hay celebridades que coincidan.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {celebridades.map((celeb) => (
          <Link key={celeb.id} href={`/celebridad/${celeb.slug}`}>
            <div className="border p-4 rounded hover:shadow-lg transition cursor-pointer">
              {celeb.foto_url && (
                <Image
                  src={celeb.foto_url}
                  alt={celeb.nombre}
                  width={300}
                  height={300}
                  className="w-full h-60 object-cover rounded mb-2"
                />
              )}
              <h2 className="text-lg font-semibold">{celeb.nombre}</h2>
              <p className="text-gray-600">
                Altura promedio: {celeb.altura_promedio !== null ? `${celeb.altura_promedio} cm` : 'Sin votos'}
              </p>
              {celeb.altura_oficial && (
                <p className="text-gray-500 text-sm">Estatura oficial: {celeb.altura_oficial} cm</p>
              )}
            </div>
          </Link>
        ))}
      </div>
      <CookieBanner />
    </main>
  )
}
