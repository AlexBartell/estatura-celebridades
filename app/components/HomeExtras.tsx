'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Comentario {
  id: string
  contenido: string
  celebridad_id: string
  username: string | null
  fecha: string
  celebridad: { nombre: string; slug: string } | null
}

export default function HomeExtras() {
  const supabase = createClient()
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [stats, setStats] = useState({
    totalCelebridades: 0,
    totalComentarios: 0,
    totalVotos: 0
  })

  useEffect(() => {
    // Últimos 5 comentarios moderados
    supabase
      .from('comentarios')
      .select(`
        id,
        contenido,
        celebridad_id,
        username,
        fecha,
        celebridad:celebridades(nombre, slug)
      `)
      .eq('moderado', true)
      .order('fecha', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        setComentarios(
          (data ?? []).map((c: any) => ({
            ...c,
            celebridad: c.celebridad ?? null,
          }))
        )
      })

    // Estadísticas rápidas
    Promise.all([
      supabase.from('celebridades').select('id', { count: 'exact', head: true }),
      supabase.from('comentarios').select('id', { count: 'exact', head: true }).eq('moderado', true),
      supabase.from('votos').select('id', { count: 'exact', head: true }),
    ]).then(([c, com, v]) => {
      setStats({
        totalCelebridades: c.count ?? 0,
        totalComentarios: com.count ?? 0,
        totalVotos: v.count ?? 0
      })
    })
  }, [])

  return (
    <aside className="space-y-6 mb-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded shadow">
        <h3 className="text-lg font-bold mb-2">Estadísticas rápidas</h3>
        <ul className="text-sm space-y-1">
          <li>Famosos en el sitio: <b>{stats.totalCelebridades}</b></li>
          <li>Comentarios aprobados: <b>{stats.totalComentarios}</b></li>
          <li>Total de votos: <b>{stats.totalVotos}</b></li>
        </ul>
      </div>
      <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded shadow">
        <h3 className="text-lg font-bold mb-2">Últimos comentarios</h3>
        {comentarios.length === 0 ? (
          <p className="text-sm text-gray-600">Aún no hay comentarios aprobados.</p>
        ) : (
          <ul className="space-y-3">
            {comentarios.map((c) => (
              <li key={c.id} className="text-sm">
                <span className="font-semibold">{c.username || 'Anónimo'}</span> en{' '}
                <Link href={`/celebridad/${c.celebridad?.slug || ''}`} className="underline">
                  {c.celebridad?.nombre || 'Celebridad desconocida'}
                </Link>
                <span className="text-gray-500 ml-2">{new Date(c.fecha).toLocaleDateString()}</span>
                <br />
                <span className="text-gray-700">{c.contenido.slice(0, 70)}{c.contenido.length > 70 ? '...' : ''}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
