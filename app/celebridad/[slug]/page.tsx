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
    <main className="min-h-[80vh] flex justify-center bg-gradient-to-b from-white to-blue-50 px-2 py-8">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
        {/* Columna Izquierda: FOTO + INFO */}
        <aside className="md:w-1/3 flex flex-col items-center">
          <div className="bg-white rounded-2xl shadow-xl p-7 flex flex-col items-center w-full">
            {celeb.foto_url && (
              <Image
                src={celeb.foto_url}
                alt={celeb.nombre}
                width={180}
                height={180}
                className="rounded-full border-4 border-blue-100 shadow mb-4 object-cover"
                style={{ background: "#f5f8ff" }}
                priority
              />
            )}
            <h1 className="text-2xl font-extrabold text-blue-800 mb-1 text-center drop-shadow">
              {celeb.nombre}
            </h1>
            {celeb.altura_promedio && (
              <p className="text-blue-600 text-base font-medium mt-1 mb-0.5">
                Altura promedio: {celeb.altura_promedio} cm
              </p>
            )}
            {celeb.altura_oficial && (
              <p className="text-gray-600 text-sm mb-1">
                Estatura oficial: {celeb.altura_oficial} cm
              </p>
            )}
          </div>
        </aside>

        {/* Columna Derecha: DESCRIPCIÓN, VOTACIÓN, COMENTARIOS */}
        <section className="flex-1 flex flex-col gap-6">
          {/* Descripción */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-lg text-blue-800 mb-2">Descripción</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {celeb.descripcion || 'No hay descripción disponible.'}
            </p>
          </div>
          {/* Votación */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl shadow-sm p-5">
            <VotacionEstatura celebridadId={celeb.id} userId={user?.id} />
          </div>
          {/* Comentarios */}
          <div className="bg-white rounded-xl shadow p-5">
            <ComentariosCelebridad celebridadId={celeb.id} userId={user?.id} />
          </div>
        </section>
      </div>
    </main>
  )
}
// Este código es una página de detalles de una celebridad en una aplicación Next.js.
// Muestra información como foto, nombre, altura promedio y oficial, descripción, votación de estatura y comentarios.
// Utiliza Supabase para obtener los datos de la celebridad y maneja errores con `notFound` si no se encuentra la celebridad.
// La estructura incluye una columna izquierda para la foto e información básica y una columna derecha para la descripción, votación y comentarios.