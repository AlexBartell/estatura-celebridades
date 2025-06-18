'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/lib/useUser'

type Comentario = {
  id: string
  contenido: string
  celebridad_id: string
  usuario_id: string | null
  username: string | null
  fecha: string
}

export default function Comentarios({ celebridadId }: { celebridadId: string }) {
  const { user } = useUser()
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [nuevoComentario, setNuevoComentario] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    async function cargarComentarios() {
      const { data, error } = await supabase
        .from('comentarios')
        .select('*')
        .eq('celebridad_id', celebridadId)
        .order('fecha', { ascending: false })

      if (!error && data) setComentarios(data as Comentario[])
      else setComentarios([])
    }

    cargarComentarios()
  }, [celebridadId])

  // Al cargar usuario, traé el username de la tabla usuarios si está logueado
  useEffect(() => {
    async function traerUsername() {
      if (user?.id) {
        const { data } = await supabase
          .from('usuarios')
          .select('username')
          .eq('id', user.id)
          .single()
        setUsername(data?.username || null)
      } else {
        setUsername(null)
      }
    }
    traerUsername()
  }, [user])

  const manejarEnvio = async () => {
    if (!nuevoComentario.trim()) return

    setEnviando(true)
    const { error } = await supabase.from('comentarios').insert({
      contenido: nuevoComentario,
      celebridad_id: celebridadId,
      usuario_id: user?.id ?? null,
      username: username ?? null, // ← Guardá el username acá!
    })

    if (!error) {
      setNuevoComentario('')
      // recargar comentarios
      const { data, error } = await supabase
        .from('comentarios')
        .select('*')
        .eq('celebridad_id', celebridadId)
        .order('fecha', { ascending: false })

      if (!error && data) setComentarios(data as Comentario[])
      else setComentarios([])
    }

    setEnviando(false)
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Comentarios</h2>
      <div className="mb-4">
        <textarea
          value={nuevoComentario}
          onChange={e => setNuevoComentario(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          placeholder={user ? 'Escribí tu comentario...' : 'Comentario anónimo...'}
        />
        <button
          onClick={manejarEnvio}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={enviando}
        >
          {enviando ? 'Enviando...' : 'Comentar'}
        </button>
      </div>
      <ul className="space-y-4">
        {comentarios.map((comentario) => (
          <li key={comentario.id} className="border-b pb-2">
            <p className="text-sm">{comentario.contenido}</p>
            <p className="text-xs text-gray-500 mt-1">
              {comentario.username
                ? `Usuario: ${comentario.username}`
                : comentario.usuario_id
                  ? `Usuario: ${comentario.usuario_id.slice(0, 8)}...`
                  : 'Anónimo'}{' '}
              · {new Date(comentario.fecha).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
