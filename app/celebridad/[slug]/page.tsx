import { createClient } from '@/lib/supabase/server'
import VotacionEstatura from '@/app/components/VotacionEstructura'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ComentariosCelebridad from '@/app/components/ComentariosCelebridad'

export default async function Page({ params }: { params: { slug: string } }) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: celeb, error } = await supabase
    .from('celebridades')
    .select('id, nombre, slug, foto_url, altura_promedio, altura_oficial, descripcion')
    .eq('slug', params.slug)
    .single()

  if (error || !celeb) return notFound()

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">{celeb.nombre}</h1>
      {celeb.foto_url && (
        <Image
          src={celeb.foto_url}
          alt={celeb.nombre}
          width={400}
          height={400}
          className="w-full max-h-[500px] object-cover rounded"
        />
      )}
      <p className="text-gray-600">{celeb.descripcion || 'No hay descripción disponible.'}</p>

      <p className="text-gray-700">
        <strong>Altura promedio por usuarios:</strong>{' '}
        {celeb.altura_promedio ? `${celeb.altura_promedio} cm` : 'No hay votos aún'}
      </p>

      {user ? (
        <VotacionEstatura celebridadId={celeb.id} userId={user.id} />
      ) : (
        <p className="text-sm text-gray-500">Iniciá sesión para votar.</p>
      )}

      {celeb.altura_oficial && (
        <p className="text-gray-500">
          <strong>Estatura oficial:</strong> {celeb.altura_oficial} cm
        </p>
      )}

    <ComentariosCelebridad celebridadId={celeb.id} userId={user?.id} />
    </main>
  )
}
