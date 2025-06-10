// components/BuscadorCelebridades.tsx
'use client'

import { useState } from 'react'

export default function BuscadorCelebridades({ onBuscar }: { onBuscar: (valor: string) => void }) {
  const [query, setQuery] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value
    setQuery(valor)
    onBuscar(valor)
  }

  return (
    <input
      type="text"
      placeholder="Buscar celebridad..."
      className="w-full max-w-md border border-gray-300 rounded px-4 py-2"
      value={query}
      onChange={handleChange}
    />
  )
}
