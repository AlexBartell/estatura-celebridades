'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'

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
    <main className="min-h-[80vh] flex flex-col items-center justify-start bg-gradient-to-b from-white to-blue-50">
      {/* HERO SECTION */}
      <section className="w-full py-8 mb-6 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 text-center mb-2 drop-shadow">
          Descubrí la estatura real de famosos y celebridades
        </h1>
        <p className="text-center text-gray-600 mb-6 max-w-2xl">
          Votá, comentá y descubrí cuánto miden tus actores, deportistas y estrellas favoritas.
          Todas las estaturas son aproximaciones, calculadas por la comunidad.
        </p>
        {/* BUSCADOR DESTACADO */}
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Buscar celebridad (ej: Messi, Shakira...)"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-5 py-3 shadow focus:outline-blue-400 text-lg"
          />
        </div>
        {user && (
          <p className="text-green-600 text-sm mt-2">Sesión activa: {user.email}</p>
        )}
      </section>

      {/* LISTADO CELEBRIDADES */}
      <section className="w-full max-w-6xl px-2 md:px-0">
        {loading && <p className="text-gray-500 text-sm text-center">Cargando resultados...</p>}
        {!loading && !celebridades.length && (
          <p className="text-gray-500 text-sm text-center">No hay celebridades que coincidan.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {celebridades.map((celeb) => (
            <Link key={celeb.id} href={`/celebridad/${celeb.slug}`}>
              <div className="border p-4 bg-white rounded-xl hover:shadow-2xl transition cursor-pointer flex flex-col items-center">
                {celeb.foto_url && (
                  <Image
                    src={celeb.foto_url}
                    alt={celeb.nombre}
                    width={180}
                    height={180}
                    className="rounded-full mb-3 border-4 border-blue-100 object-cover"
                  />
                )}
                <h2 className="text-lg font-semibold text-center">{celeb.nombre}</h2>
                <p className="text-gray-600 text-center">
                  Altura promedio: {celeb.altura_promedio !== null ? `${celeb.altura_promedio} cm` : 'Sin votos'}
                </p>
                {celeb.altura_oficial && (
                  <p className="text-gray-500 text-xs text-center">
                    Estatura oficial: {celeb.altura_oficial} cm
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
      {/* CTA final */}
      <section className="mt-10 text-center text-sm text-gray-500">
        <span>
          ¿Falta una celebridad?&nbsp;
          <Link href="/sugerir" className="text-blue-700 underline hover:text-blue-900">Sugerila acá</Link>
        </span>
      </section>
    </main>
  )
}
// This code is a Next.js page that displays a list of celebrities with their heights.
// It includes a search feature, user session management, and responsive design.
// The page fetches data from a Supabase database and displays it in a grid format.
// Users can click on a celebrity to view more details on a separate page.
// The page also includes a call-to-action for suggesting new celebrities.
// The code is structured to handle loading states and display appropriate messages when no results are found.
// It uses TypeScript for type safety and Next.js features like Image and Link components for optimized performance.
