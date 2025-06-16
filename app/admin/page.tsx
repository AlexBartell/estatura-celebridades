// app/admin/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import FormAgregarCelebridad from '@/app/components/FormAgregarCelebridad'
import FormActualizarAltura from '@/app/components/FormActualizarAltura'
import BuscadorCelebridades, { Celebridad } from '@/app/components/BuscadorCelebridades'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [celebridades, setCelebridades] = useState<Celebridad[]>([])
  const [userEmail, setUserEmail] = useState('')
  const router = useRouter()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const supabase  = createClient()
    const adminEmails = ['alex.dunno@gmail.com']

    const fetchUserAndData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user || !user.email || !adminEmails.includes(user.email)) {
        router.push('/')
        return
      }

      setUserEmail(user.email)

      const { data, error } = await supabase
        .from('celebridades')
        .select('id, nombre, slug, foto_url, altura_promedio, altura_oficial')
        .order('fecha_creacion', { ascending: false })
        .limit(10)

      if (!error && data) {
        setCelebridades(data)
      }
    }

    fetchUserAndData()
  }, [router])

  const handleBuscar = (resultados: Celebridad[]) => {
    setCelebridades(resultados)
  }

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Panel de administrador</h1>
      <p className="mb-4">Sesión activa: {userEmail}</p>

      <FormAgregarCelebridad />

      <hr className="my-6" />

      <h2 className="text-xl font-semibold">Actualizar estatura oficial</h2>

      <BuscadorCelebridades onBuscar={handleBuscar} />

      {!celebridades?.length && (
        <p className="text-gray-500 text-sm">No hay celebridades agregadas aún.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {celebridades?.map((celeb) => (
          <div key={celeb.id} className="border p-4 rounded hover:shadow-lg transition">
            {celeb.foto_url && (
              <Image
                src={celeb.foto_url}
                alt={celeb.nombre}
                width={300}
                height={300}
                className="w-full h-60 object-cover rounded mb-2"
              />
            )}
            <h3 className="text-lg font-semibold">{celeb.nombre}</h3>
            <p className="text-sm text-gray-600 mb-2">
              Estatura oficial actual: {celeb.altura_oficial ?? 'No asignada'}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Altura promedio por usuarios: {celeb.altura_promedio ?? 'No hay votos'} cm
            </p>
            <FormActualizarAltura id={celeb.id} alturaActual={celeb.altura_oficial ?? null} />

          </div>
        ))}
      </div>
    </main>
  )
}
