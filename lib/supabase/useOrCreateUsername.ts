import { createClient } from "@/lib/supabase/client";

// Genera un username random
function generarUsername() {
  return "usuario_" + Math.random().toString(36).substring(2, 8);
}

export async function getOrCreateUsername(userId: string, email: string) {
  const supabase = createClient()
  const { data: user, error } = await supabase
    .from('usuarios')
    .select('username')
    .eq('id', userId)
    .single()

  if (user && user.username) return user.username
  // Si no hay, devolvé null para redirigir
  return null
}
