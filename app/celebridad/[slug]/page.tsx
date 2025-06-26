import { createClient } from '@/lib/supabase/server'
import VotacionEstatura from '@/app/components/VotacionEstructura'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ComentariosCelebridad from '@/app/components/ComentariosCelebridad'
import Link from 'next/link'
// Simple función para obtener bandera emoji por país
function getFlagEmoji(country: string) {
  if (!country) return ''
  // Si es menos de 2 caracteres, no arma bandera
  if (country.length < 2) return ''
  const codePoints = country
    .toUpperCase()
    .replace(/ /g, '')
    .slice(0, 2) // Solo toma dos letras (ISO2)
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  try {
    return String.fromCodePoint(...codePoints)
  } catch {
    return ''
  }
}


export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: { slug: string } }) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Ahora seleccionamos también categoria y pais
  const { data: celeb, error } = await supabase
    .from('celebridades')
    .select('id, nombre, slug, foto_url, altura_promedio, altura_oficial, descripcion, categoria, pais')
    .eq('slug', params.slug)
    .single()
  const { data: recomendados } = await supabase
    .from('celebridades')
    .select('id, nombre, slug, foto_url, categoria, pais')
    .neq('id', celeb.id)
    .or([
      celeb.categoria ? `categoria.eq.${celeb.categoria}` : null,
      celeb.pais ? `pais.eq.${celeb.pais}` : null,
    ].filter(Boolean).join(','))
    .limit(6)
  if (error || !celeb) return notFound()

  // Genera frase SEO
  const title = `¿Cuánto mide ${celeb.nombre}? Altura, país y más`
  const desc = `Descubre la altura real de ${celeb.nombre}${celeb.categoria ? ` (${celeb.categoria})` : ''}${celeb.pais ? ` de ${celeb.pais}` : ''}. La altura de ${celeb.nombre} es de ${celeb.altura_promedio ? `${celeb.altura_promedio} cm` : 'N/A'} según la comunidad. ${celeb.descripcion ? celeb.descripcion.slice(0, 120) : ''}`

  // Bandera país, si se puede
const paisIsoMap: Record<string, string> = {
  argentina: 'AR',
  uruguay: 'UY',
  mexico: 'MX',
  españa: 'ES',
  chile: 'CL',
  brasil: 'BR',
  venezuela: 'VE',
  colombia: 'CO',
  estadosunidos: 'US',
  puertorico: 'PR',
  peru: 'PE',
  ecuador: 'EC',
  bolivia: 'BO',
  paraguay: 'PY',
  cuba: 'CU',
  dominicana: 'DO',
  republicadominicana: 'DO',
  honduras: 'HN',
  nicaragua: 'NI',
  guatemala: 'GT',
  elsalvador: 'SV',
  panama: 'PA',
  costarica: 'CR',
  jamaica: 'JM',
  trinidadytobago: 'TT',
  belice: 'BZ',
  bahamas: 'BS',
  barbados: 'BB',
  saintlucia: 'LC',
  antillasneerlandesas: 'CW',
  canada: 'CA',
  italia: 'IT',
  francia: 'FR',
  alemania: 'DE',
  inglaterra: 'GB',
  reinounido: 'GB',
  portugal: 'PT',
  australia: 'AU',
  rusia: 'RU',
  china: 'CN',
  japon: 'JP',
  corea: 'KR',
  coreadelsur: 'KR',
  coreadelnorte: 'KP',
  india: 'IN',
  marruecos: 'MA',
  egipto: 'EG',
  sudafrica: 'ZA',
  nigeria: 'NG',
  suecia: 'SE',
  noruega: 'NO',
  finlandia: 'FI',
  dinamarca: 'DK',
  holanda: 'NL',
  paisesbajos: 'NL',
  polonia: 'PL',
  suiza: 'CH',
  austria: 'AT',
  grecia: 'GR',
  turquia: 'TR',
  irlanda: 'IE',
  escocia: 'GB', // No hay bandera emoji específica
  gales: 'GB',   // No hay bandera emoji específica
  croacia: 'HR',
  serbia: 'RS',
  eslovenia: 'SI',
  hungria: 'HU',
  chequia: 'CZ',
  eslovaquia: 'SK',
  islandia: 'IS',
  filipinas: 'PH',
  israel: 'IL'
  // ...puedes agregar más si algún día lo necesitas
}

// Y luego tu mapping:
const paisBandera = celeb.pais ? getFlagEmoji(
  celeb.pais.length === 2
    ? celeb.pais
    : (paisIsoMap[celeb.pais.toLowerCase().replace(/ /g, '')] || '')
) : ''

  return (
    <>
      {/* SEO tags */}
      <head>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        {celeb.foto_url && <meta property="og:image" content={celeb.foto_url} />}
      </head>
      <main className="min-h-[80vh] flex justify-center bg-gradient-to-b from-white to-blue-50 px-2 py-8">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
          {/* Columna Izquierda: FOTO + INFO */}
          <aside className="md:w-1/3 flex flex-col items-center">
            <div className="bg-white rounded-2xl shadow-xl p-7 flex flex-col items-center w-full">
              {celeb.foto_url && (
                <Image
                  src={celeb.foto_url}
                  alt={`Foto de ${celeb.nombre}`}
                  width={180}
                  height={180}
                  className="rounded-full border-4 border-blue-100 shadow mb-4 object-cover"
                  style={{ background: "#f5f8ff" }}
                  priority
                />
              )}
              <h1 className="text-xl md:text-2xl font-extrabold text-blue-800 mb-1 text-center drop-shadow">
                ¿Cuánto mide {celeb.nombre}?
              </h1>
              <span className="text-blue-700 text-base font-semibold mb-2 block">
                La altura de {celeb.nombre} es {celeb.altura_promedio ? (
                  <b>{celeb.altura_promedio} cm</b>
                ) : (
                  <span className="text-gray-500">desconocida</span>
                )}
              </span>
              {/* Categoría */}
              {celeb.categoria && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mb-1">
                  {celeb.categoria.charAt(0).toUpperCase() + celeb.categoria.slice(1)}
                </span>
              )}
              {/* País con bandera */}
              {celeb.pais && (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full mb-2">
                  {paisBandera} {celeb.pais}
                </span>
              )}
              {/* Altura oficial */}
              {celeb.altura_oficial && (
                <p className="text-gray-600 text-sm mt-1">
                  Estatura oficial: <b>{celeb.altura_oficial} cm</b>
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
            {recomendados && recomendados.length > 0 && (
  <section className="bg-white rounded-xl shadow p-5">
    <h3 className="text-base md:text-lg font-bold text-blue-800 mb-3">
      {celeb.categoria && celeb.pais
        ? `Más ${celeb.categoria}s de ${celeb.pais.charAt(0).toUpperCase() + celeb.pais.slice(1)}`
        : celeb.categoria
        ? `Más ${celeb.categoria}s`
        : celeb.pais
        ? `Más famosos de ${celeb.pais.charAt(0).toUpperCase() + celeb.pais.slice(1)}`
        : 'Otras celebridades'
      }
    </h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {recomendados.map((r) => (
        <Link
          key={r.id}
          href={`/celebridad/${r.slug}`}
          className="block bg-blue-50 rounded-xl shadow hover:shadow-xl transition p-3 text-center border hover:border-blue-400"
        >
          {r.foto_url && (
            <Image
              src={r.foto_url}
              alt={r.nombre}
              width={80}
              height={80}
              className="rounded-full object-cover mx-auto mb-2 border"
            />
          )}
          <div className="font-semibold text-sm text-blue-900">{r.nombre}</div>
          {r.categoria && (
            <div className="text-xs text-gray-500">{r.categoria.charAt(0).toUpperCase() + r.categoria.slice(1)}</div>
          )}
        </Link>
      ))}
    </div>
  </section>
)}
          </section>
        </div>
      </main>
    </>
  )
}

