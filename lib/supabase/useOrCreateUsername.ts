import { createClient } from "@/lib/supabase/client";

// Genera un username random
//function generarUsername() {
//  return "usuario_" + Math.random().toString(36).substring(2, 8);
//}

export async function getOrCreateUsername(userId: string) {
  const supabase = createClient()
  const { data: user} = await supabase
    .from('usuarios')
    .select('username')
    .eq('id', userId)
    .single()
    console.log('getOrCreateUsername', userId, user)  

  if (user && user.username) return user.username
  // Si no hay, devolvé null para redirigir
  return null
}