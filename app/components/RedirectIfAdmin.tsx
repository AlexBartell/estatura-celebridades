'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RedirectIfAdmin({ email }: { email?: string }) {
  const router = useRouter()

  useEffect(() => {
    if (email === 'alex.dunno@gmail.com') {
      router.push('/admin')
    }
  }, [email, router])

  return null
}
