"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell, campoAuth } from "@/components/AuthShell";
import { useStore } from "@/lib/store";

export default function Registro() {
  const { registrar } = useStore();
  const router = useRouter();
  const [datos, setDatos] = useState(false);
  const [terminos, setTerminos] = useState(false);
  const [intento, setIntento] = useState(false);
  const [aviso, setAviso] = useState("");

  return (
    <AuthShell titulo="Crea tu cuenta" subtitulo="Un minuto y empiezas. Luego eliges cómo pagar el curso Básico.">
      <button
        type="button"
        onClick={() => setAviso("En el piloto el ingreso con Google está simulado. Usa el formulario de abajo.")}
        className="mt-6 flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-full border-[1.5px] border-linea bg-white px-5 py-3 text-base font-medium text-tinta hover:border-lila-borde"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z" fill="#4285F4" />
          <path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" fill="#34A853" />
          <path d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2L6.4 14z" fill="#FBBC05" />
          <path d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10c.8-2.4 3-4.1 5.6-4.1z" fill="#EA4335" />
        </svg>
        Continuar con Google
      </button>
      {aviso && (
        <p role="status" className="mt-3 rounded-xl bg-aviso px-4 py-2.5 text-sm text-aviso-texto">
          {aviso}
        </p>
      )}
      <div className="my-6 flex items-center gap-3 text-sm text-suave">
        <span className="h-px flex-1 bg-linea" /> o con tu correo <span className="h-px flex-1 bg-linea" />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIntento(true);
          if (!datos || !terminos) return;
          const f = new FormData(e.currentTarget);
          registrar({ nombre: String(f.get("nombre")).trim(), email: String(f.get("email")).trim(), aceptoDatos: true });
          router.push("/app/checkout");
        }}
      >
        <label className="block text-[15px] text-medio">
          Tu nombre
          <input name="nombre" required autoComplete="given-name" className={campoAuth} />
        </label>
        <label className="mt-4 block text-[15px] text-medio">
          Correo
          <input name="email" type="email" required autoComplete="email" className={campoAuth} />
        </label>
        <label className="mt-4 block text-[15px] text-medio">
          Contraseña
          <input name="clave" type="password" required minLength={6} autoComplete="new-password" className={campoAuth} />
        </label>
        <div className="mt-5 flex flex-col gap-3.5 text-[15px] leading-relaxed">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={datos}
              onChange={(e) => setDatos(e.target.checked)}
              className="m-0 mt-0.5 h-[22px] w-[22px] flex-none accent-violeta"
            />
            <span>
              Autorizo el tratamiento de mis datos personales según la{" "}
              <Link href="/legal/datos" target="_blank" className="text-violeta-texto">
                política de datos
              </Link>{" "}
              (Ley 1581 de 2012).
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={terminos}
              onChange={(e) => setTerminos(e.target.checked)}
              className="m-0 mt-0.5 h-[22px] w-[22px] flex-none accent-violeta"
            />
            <span>
              Acepto los{" "}
              <Link href="/legal/terminos" target="_blank" className="text-violeta-texto">
                términos y condiciones
              </Link>
              .
            </span>
          </label>
        </div>
        {intento && (!datos || !terminos) && (
          <p role="alert" className="mt-3 text-[15px] text-error-texto">
            Para crear tu cuenta debes autorizar el tratamiento de tus datos y aceptar los términos.
          </p>
        )}
        <button
          type="submit"
          className="mt-6 min-h-[52px] w-full cursor-pointer rounded-full border-0 bg-violeta px-6 py-3.5 text-[17px] font-medium text-white hover:bg-violeta-texto"
        >
          Crear mi cuenta
        </button>
      </form>
      <p className="mt-5 text-center text-[15px] text-suave">
        ¿Ya tienes cuenta?{" "}
        <Link href="/ingresar" className="text-violeta-texto">
          Ingresa
        </Link>
      </p>
    </AuthShell>
  );
}
