// app/elige-nombre/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EligeNombrePage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Intenta guardar el username
    const { error } = await supabase.from("usuarios").insert({
      id: user.id,
      email: user.email,
      username,
    });
    if (error) {
      setError("Ese nombre ya está en uso, probá otro");
      return;
    }
    // Redirigí al dashboard o donde quieras
    router.push("/");
  };

  // También podés sugerir uno random:
  const sugerir = () => {
    setUsername("usuario_" + Math.random().toString(36).substring(2, 8));
  };

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Elegí tu nombre de usuario</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Tu nombre público"
          className="border rounded px-4 py-2 w-full"
          required
        />
        <button type="button" onClick={sugerir} className="mr-2 px-3 py-1 border rounded">Sugerir uno</button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </main>
  );
}
