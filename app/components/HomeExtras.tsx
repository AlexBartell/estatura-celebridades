'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'

interface ComentarioDB {
  id: string
  contenido: string
  username: string | null
  fecha: string
  celebridad: { slug: string; nombre: string } | { slug: string; nombre: string }[] | null
}

interface Comentario {
  id: string
  contenido: string
  username: string | null
  celebridad_slug: string
  celebridad_nombre: string
  fecha: string
}

interface CelebridadDestacada {
  id: string
  nombre: string
  slug: string
  foto_url: string | null
}

interface Stats {
  celebridades: number
  comentarios: number
  votos: number
}

export default function HomeExtras() {
  const supabase = createClient()

  // Últimos comentarios
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  // Destacados
  const [destacadas, setDestacadas] = useState<CelebridadDestacada[]>([])
  // Stats
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    // Últimos comentarios moderados
    const cargarComentarios = async () => {
      const { data, error } = await supabase
        .from('comentarios')
        .select(`
          id,
          contenido,
          username,
          fecha,
          celebridad:celebridades (
            slug, nombre
          )
        `)
        .eq('moderado', true)
        .order('fecha', { ascending: false })
        .limit(5)

      if (!error && data) {
        setComentarios(
          (data as ComentarioDB[]).map((c) => {
            let celebridadSlug = ''
            let celebridadNombre = ''
            if (Array.isArray(c.celebridad)) {
              if (c.celebridad.length > 0) {
                celebridadSlug = c.celebridad[0].slug ?? ''
                celebridadNombre = c.celebridad[0].nombre ?? ''
              }
            } else if (c.celebridad && typeof c.celebridad === 'object') {
              celebridadSlug = c.celebridad.slug ?? ''
              celebridadNombre = c.celebridad.nombre ?? ''
            }
            return {
              id: c.id,
              contenido: c.contenido,
              username: c.username,
              fecha: c.fecha,
              celebridad_slug: celebridadSlug,
              celebridad_nombre: celebridadNombre,
            }
          })
        )
      }
    }

    // Destacados: top 3 por votos_total
    const cargarDestacadas = async () => {
      const { data, error } = await supabase
        .from('celebridades')
        .select('id, nombre, slug, foto_url')
        .order('votos_total', { ascending: false })
        .limit(3)

      if (!error && data) {
        setDestacadas(data as CelebridadDestacada[])
      }
    }

    // Stats rápidas
    const cargarStats = async () => {
      const [{ count: cels }, { count: comms }, { count: votos }] = await Promise.all([
        supabase.from('celebridades').select('id', { count: 'exact', head: true }),
        supabase.from('comentarios').select('id', { count: 'exact', head: true }),
        supabase.from('votos').select('id', { count: 'exact', head: true }),
      ])
      setStats({
        celebridades: cels || 0,
        comentarios: comms || 0,
        votos: votos || 0,
      })
    }

    cargarComentarios()
    cargarDestacadas()
    cargarStats()
    // eslint-disable-next-line
  }, [])

  return (
    <section className="my-10 grid md:grid-cols-3 gap-6">
      {/* Últimos comentarios */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="font-bold text-lg mb-2">Últimos comentarios</h3>
        <ul className="space-y-2">
          {comentarios.map((c) => (
            <li key={c.id}>
              <Link href={`/celebridad/${c.celebridad_slug}`}>
                <span className="font-semibold">{c.username ?? 'Anónimo'}:</span>
                <span className="ml-1">{c.contenido.slice(0, 60)}{c.contenido.length > 60 ? '…' : ''}</span>
                <span className="block text-xs text-gray-500">
                  en <span className="underline">{c.celebridad_nombre}</span>
                  {' • '}
                  {new Date(c.fecha).toLocaleDateString()}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Celebridades destacadas */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="font-bold text-lg mb-2">Destacados</h3>
        <ul className="space-y-3">
          {destacadas.map((c) => (
            <li key={c.id} className="flex gap-3 items-center">
              {c.foto_url && (
                <Image
                  src={c.foto_url}
                  alt={c.nombre}
                  width={48}
                  height={48}
                  className="h-12 w-12 object-cover rounded"
                  unoptimized // Eliminalo si quieres optimizar en producción
                />
              )}
              <div>
                <Link href={`/celebridad/${c.slug}`} className="font-semibold underline">{c.nombre}</Link>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Cajita de stats */}
      <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center justify-center">
        <h3 className="font-bold text-lg mb-2">Estadísticas</h3>
        {stats ? (
          <ul className="text-center text-gray-700 space-y-1">
            <li>
              <strong>{stats.celebridades}</strong> celebridades
            </li>
            <li>
              <strong>{stats.comentarios}</strong> comentarios
            </li>
            <li>
              <strong>{stats.votos}</strong> votos registrados
            </li>
          </ul>
        ) : (
          <p className="text-gray-400">Cargando…</p>
        )}
      </div>
    </section>
  )
}
// Este componente se encarga de mostrar los extras en la página de inicio:
// - Últimos comentarios moderados
// - Celebridades destacadas por votos  