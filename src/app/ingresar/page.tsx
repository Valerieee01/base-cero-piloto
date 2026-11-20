"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell, campoAuth } from "@/components/AuthShell";
import { useStore } from "@/lib/store";

export default function Ingresar() {
  const { estado, demoCuentaLista } = useStore();
  const router = useRouter();
  const [error, setError] = useState(false);

  return (
    <AuthShell titulo="Ingresa a Base Cero" subtitulo="Sigue donde quedaste.">
      <form
        className="mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          const email = String(new FormData(e.currentTarget).get("email")).trim().toLowerCase();
          if (estado.usuario && estado.usuario.email.toLowerCase() === email) {
            router.push(estado.inscripcion ? "/app" : "/app/checkout");
          } else {
            setError(true);
          }
        }}
      >
        <label className="block text-[15px] text-medio">
          Correo
          <input name="email" type="email" required autoComplete="email" className={campoAuth} />
        </label>
        <label className="mt-4 block text-[15px] text-medio">
          Contraseña
          <input name="clave" type="password" required autoComplete="current-password" className={campoAuth} />
        </label>
        {error && (
          <p role="alert" className="mt-3 text-[15px] leading-relaxed text-error-texto">
            No encontramos esa cuenta. En el piloto las cuentas se guardan solo en el navegador donde las creaste.
          </p>
        )}
        <button
          type="submit"
          className="mt-6 min-h-[52px] w-full cursor-pointer rounded-full border-0 bg-violeta px-6 py-3.5 text-[17px] font-medium text-white hover:bg-violeta-texto"
        >
          Ingresar
        </button>
      </form>
      <button
        type="button"
        onClick={() => {
          demoCuentaLista();
          router.push("/app");
        }}
        className="mt-4 min-h-12 w-full cursor-pointer rounded-full border-[1.5px] border-dashed border-lila-borde bg-transparent px-6 py-3 text-[15px] text-medio hover:text-tinta"
      >
        Demo: entrar con una cuenta de prueba
      </button>
      <p className="mt-5 text-center text-[15px] text-suave">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="text-violeta-texto">
          Créala aquí
        </Link>
      </p>
    </AuthShell>
  );
}
