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
    <main className="min-h-[80vh] flex flex-col items-center bg-gradient-to-b from-white to-blue-50 px-2">
      {/* HERO */}
      <section className="w-full flex flex-col items-center mt-8 mb-5">
        <div className="bg-white rounded-2xl shadow-xl p-7 flex flex-col items-center w-full max-w-xl">
          {celeb.foto_url && (
            <Image
              src={celeb.foto_url}
              alt={celeb.nombre}
              width={200}
              height={200}
              className="rounded-full border-4 border-blue-100 shadow mb-4 object-cover"
              style={{ background: "#f5f8ff" }}
              priority
            />
          )}
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-2 text-center drop-shadow">
            {celeb.nombre}
          </h1>
          {celeb.altura_promedio && (
            <p className="text-blue-600 text-lg font-medium mt-1 mb-0.5">
              Altura promedio: {celeb.altura_promedio} cm
            </p>
          )}
          {celeb.altura_oficial && (
            <p className="text-gray-600 text-sm">
              Estatura oficial: {celeb.altura_oficial} cm
            </p>
          )}
        </div>
      </section>

      {/* DESCRIPCIÓN */}
      <section className="w-full max-w-xl">
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h2 className="font-semibold text-lg text-blue-800 mb-2">Descripción</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {celeb.descripcion || 'No hay descripción disponible.'}
          </p>
        </div>
      </section>

      {/* VOTACIÓN */}
      <section className="w-full max-w-xl mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl shadow-sm p-5">
          <VotacionEstatura celebridadId={celeb.id} userId={user?.id} />
        </div>
      </section>

      {/* COMENTARIOS */}
      <section className="w-full max-w-xl mb-16">
        <div className="bg-white rounded-xl shadow p-5">
          <ComentariosCelebridad celebridadId={celeb.id} userId={user?.id} />
        </div>
      </section>
    </main>
  )
}
