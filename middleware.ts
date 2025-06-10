import { type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Creamos cliente Supabase con cookies extraídas del request
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          // ✅ Lee cookies desde el request
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          // ✅ Setea cookies en la respuesta (necesario si Supabase las actualiza)
          response.cookies.set(name, value, options)
        },
        remove(name, options) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 👇 Esta llamada es clave para inyectar las cookies válidas
  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: ['/', '/admin/:path*', '/iniciar-sesion', '/auth/callback', '/celebridad/:path*'],
}