// app/components/CookieBanner.tsx
'use client'
import { useState, useEffect } from "react"

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookiesAccepted')) setVisible(true)
  }, [])

  const aceptarCookies = () => {
    localStorage.setItem('cookiesAccepted', 'yes')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between z-50">
      <span>
        Este sitio utiliza cookies para mejorar la experiencia del usuario. Al continuar navegando, aceptás su uso.
      </span>
      <button
        onClick={aceptarCookies}
        className="mt-2 sm:mt-0 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
      >
        Aceptar
      </button>
    </div>
  )
}
