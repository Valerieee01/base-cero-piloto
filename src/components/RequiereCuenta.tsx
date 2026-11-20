"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Logo } from "./Icons";

/** Protege las pantallas de la plataforma: pide cuenta (y opcionalmente inscripción). */
export function RequiereCuenta({ children, inscripcion = true }: { children: React.ReactNode; inscripcion?: boolean }) {
  const { estado, listo, demoCuentaLista } = useStore();

  if (!listo) {
    return (
      <div className="flex min-h-screen items-center justify-center" aria-busy="true">
        <p className="text-suave">Cargando…</p>
      </div>
    );
  }

  if (!estado.usuario || (inscripcion && !estado.inscripcion)) {
    const sinCuenta = !estado.usuario;
    return (
      <main className="mx-auto flex min-h-screen max-w-[560px] flex-col justify-center px-4 py-16">
        <Link href="/" className="flex items-center gap-2.5 text-tinta no-underline">
          <Logo />
          <span className="text-xl font-bold">Base Cero</span>
        </Link>
        <h1 className="mt-8 text-3xl font-bold tracking-tight">
          {sinCuenta ? "Para entrar a la plataforma necesitas una cuenta" : "Aún no estás inscrito en el curso Básico"}
        </h1>
        <p className="mt-3 text-[17px] leading-relaxed text-medio">
          {sinCuenta
            ? "Crea tu cuenta en un minuto. Si solo quieres mirar, toma la clase de muestra sin registrarte."
            : "Inscríbete para ver las 12 clases, resolver los ejercicios y enviar tus dudas."}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={sinCuenta ? "/registro" : "/app/checkout"}
            className="rounded-full bg-violeta px-6 py-3.5 font-medium text-white no-underline hover:bg-violeta-texto"
          >
            {sinCuenta ? "Crear mi cuenta" : "Inscribirme al Básico"}
          </Link>
          {sinCuenta && (
            <Link href="/clase-gratis" className="rounded-full border-[1.5px] border-tinta px-6 py-3.5 font-medium text-tinta no-underline">
              Tomar la clase gratis
            </Link>
          )}
        </div>
        <button
          type="button"
          onClick={demoCuentaLista}
          className="mt-8 cursor-pointer self-start rounded-lg border-[1.5px] border-dashed border-lila-borde bg-transparent px-4 py-2.5 text-[15px] text-medio hover:text-tinta"
        >
          Demo: entrar con una cuenta de prueba ya inscrita
        </button>
      </main>
    );
  }

  return <>{children}</>;
}
