// app/privacidad/page.tsx
export default function PoliticaPrivacidad() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Política de Privacidad</h1>
      <p>
        En <strong>Estatura Celebridades</strong> valoramos la privacidad de nuestros usuarios.
        Al utilizar este sitio, aceptás la recopilación y el uso de información según esta política.
      </p>
      <h2 className="mt-4 font-semibold">Información que recopilamos</h2>
      <ul className="list-disc pl-6">
        <li>
          <strong>Datos de sesión</strong>: Para iniciar sesión con Google, almacenamos tu email y un identificador de usuario.
        </li>
        <li>
          <strong>Cookies</strong>: Utilizamos cookies para autenticar usuarios y mejorar la experiencia de navegación.
        </li>
      </ul>

      <h2 className="mt-4 font-semibold">Google AdSense y Cookies de Terceros</h2>
      <p>
        Este sitio utiliza Google AdSense para mostrar anuncios. Google, como proveedor asociado, utiliza cookies para publicar anuncios relevantes basados en tus visitas anteriores a este y otros sitios web.
        <br />
        Podés obtener más información sobre el uso de cookies de Google en: <a className="underline text-blue-600" href="https://policies.google.com/technologies/ads" target="_blank">https://policies.google.com/technologies/ads</a>
      </p>
      <p className="mt-2">
        Si lo deseás, podés desactivar la personalización de anuncios accediendo a: <a className="underline text-blue-600" href="https://adssettings.google.com/" target="_blank">https://adssettings.google.com/</a>
      </p>

      <h2 className="mt-4 font-semibold">Uso de la Información</h2>
      <ul className="list-disc pl-6">
        <li>
          Utilizamos la información para autenticar usuarios, mostrar anuncios y mejorar el contenido del sitio.
        </li>
        <li>
          No compartimos tu información personal con terceros, salvo lo necesario para mostrar anuncios o cumplir obligaciones legales.
        </li>
      </ul>

      <h2 className="mt-4 font-semibold">Contacto</h2>
      <p>
        Si tenés preguntas sobre nuestra política de privacidad, escribinos a <a className="underline text-blue-600" href="mailto:tu-email@ejemplo.com">tu-email@ejemplo.com</a>.
      </p>
    </main>
  )
}
