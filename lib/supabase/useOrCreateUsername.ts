// /lib/supabase/useOrCreateUsername.ts
import { createClient } from "@/lib/supabase/client";

// Genera un username random, ej: usuario_x8fj3
function generarUsername(email: string) {
  const base = "usuario_" + Math.random().toString(36).substring(2, 8);
  return base;
}

export async function getOrCreateUsername(userId: string, email: string) {
  const supabase = createClient();
  const { data: user, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", userId)
    .single();

  if (user) return user.username;

  // Si no existe, sugerí un username
  return generarUsername(email);
}
