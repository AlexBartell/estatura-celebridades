// app/api/votar/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = createClient()
  const { celebridadId, userId, valor } = await req.json()

  // 1. Insertar el voto
  const { error: insertError } = await supabase.from('votos').insert({
    celebridad_id: celebridadId,
    usuario_id: userId,
    valor: valor,
  })
  if (insertError) {
    return NextResponse.json({ ok: false, error: 'No se pudo guardar el voto.' }, { status: 400 })
  }

  // 2. Calcular el promedio NUEVO de la celebridad
  const { data: votos } = await supabase
    .from('votos')
    .select('valor')
    .eq('celebridad_id', celebridadId)

  if (!votos || votos.length === 0) {
    return NextResponse.json({ ok: false, error: 'No hay votos.' }, { status: 400 })
  }
  const suma = votos.reduce((acc, voto) => acc + parseFloat(voto.valor), 0)
  const promedio = Number((suma / votos.length).toFixed(2))

  // 3. Guardar el promedio en la tabla celebridades
  const { error: updateError } = await supabase
    .from('celebridades')
    .update({ altura_promedio: promedio })
    .eq('id', celebridadId)
  if (updateError) {
    return NextResponse.json({ ok: false, error: 'No se pudo actualizar el promedio.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, promedio })
}
