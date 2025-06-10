'use server'
import { createClient } from '@/lib/supabase/server'

export async function actualizarAlturaOficial(id: string, altura: number) {
  const supabase = createClient()

  const { error } = await supabase
    .from('celebridades')
    .update({ altura_oficial: altura })
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }
}