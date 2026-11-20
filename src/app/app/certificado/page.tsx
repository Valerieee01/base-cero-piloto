"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AppHeader } from "@/components/AppHeader";
import { BotonImprimir } from "@/components/BotonImprimir";
import { RequiereCuenta } from "@/components/RequiereCuenta";
import { Candado, Check, Logo, Pendiente } from "@/components/Icons";
import { EVALUACIONES } from "@/lib/curso";
import { fechaLarga, useStore } from "@/lib/store";

export default function Certificado() {
  return (
    <RequiereCuenta>
      <AppHeader />
      <Contenido />
    </RequiereCuenta>
  );
}

function Contenido() {
  const { estado, progreso, emitirCertificado } = useStore();
  const habilitado = progreso.certificadoHabilitado;

  useEffect(() => {
    if (habilitado && !estado.certificado) emitirCertificado();
  }, [habilitado, estado.certificado, emitirCertificado]);

  if (!habilitado) {
    return (
      <main className="mx-auto max-w-[760px] px-4 py-14 sm:px-6">
        <div className="rounded-[20px] border-[1.5px] border-linea bg-white p-7 sm:p-8">
          <Candado size={32} color="#7A2FCC" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight">Tu certificado aún no está listo</h1>
          <p className="mt-3 text-[17px] leading-relaxed text-medio">
            Se habilita cuando apruebes las 4 evaluaciones semanales. Llevas {progreso.evaluaciones}.
          </p>
          <ul className="mt-5 flex list-none flex-col gap-2.5 p-0">
            {EVALUACIONES.map((e) => {
              const ok = estado.evaluaciones.includes(e.semana);
              return (
                <li key={e.semana} className="flex items-center gap-3 text-base">
                  {ok ? <Check /> : <Pendiente />}
                  <Link href={`/app/evaluacion/${e.semana}`} className={ok ? "text-tinta" : "text-violeta-texto"}>
                    {e.titulo}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    );
  }

  const fecha = fechaLarga(estado.certificado?.emitidoEn);

  return (
    <main className="mx-auto max-w-[1000px] px-4 pt-10 pb-24 sm:px-6 print:max-w-none print:p-0">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="m-0 text-[clamp(28px,4vw,40px)] font-bold tracking-tight">Tu certificado</h1>
        <BotonImprimir texto="Descargar en PDF" className="min-h-12 cursor-pointer rounded-full border-0 bg-violeta px-6 py-3 text-base font-medium text-white hover:bg-violeta-texto" />
      </div>

      <article
        aria-label="Certificado del curso Básico"
        className="cuaderno relative overflow-hidden rounded-[20px] border-[1.5px] border-tinta bg-white shadow-solido-lg print:rounded-none print:border-0 print:shadow-none"
      >
        <div className="m-4 rounded-2xl border-2 border-violeta bg-white/95 px-6 py-10 text-center sm:m-6 sm:px-14 sm:py-14">
          <div className="flex items-center justify-center gap-3">
            <Logo size={40} />
            <span className="text-2xl font-bold">Base Cero</span>
          </div>
          <p className="mt-8 text-[15px] font-medium tracking-[0.2em] text-violeta-texto uppercase">Certificado de aprobación</p>
          <p className="mt-6 text-lg text-medio">Se certifica que</p>
          <p className="mt-2 text-[clamp(32px,5vw,52px)] leading-tight font-bold tracking-tight">{estado.usuario?.nombre}</p>
          <p className="mx-auto mt-4 max-w-[34em] text-lg leading-relaxed text-medio">
            aprobó el <strong className="text-tinta">curso Básico de programación y bases de datos</strong>: 4 semanas, 12 clases y 4
            evaluaciones sobre variables, tipos de datos, operadores, condicionales, ciclos, tablas, registros, campos y consultas
            SQL.
          </p>
          <svg width="56" height="56" viewBox="0 0 24 24" aria-hidden="true" className="mx-auto mt-8">
            <path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" fill="#F2B33D" />
          </svg>
          <div className="mt-8 flex flex-wrap justify-center gap-x-16 gap-y-6 text-[15px] text-medio">
            <div>
              <p className="m-0 font-semibold text-tinta">{fecha}</p>
              <p className="m-0">Fecha de emisión</p>
            </div>
            <div>
              <p className="m-0 font-mono font-semibold text-tinta">{estado.certificado?.codigo}</p>
              <p className="m-0">Código de verificación</p>
            </div>
            <div>
              <p className="m-0 font-semibold text-tinta">Bucaramanga, Colombia</p>
              <p className="m-0">Academia virtual Base Cero</p>
            </div>
          </div>
          <p className="mt-8 text-[13px] text-suave">Certificado de demostración emitido por el piloto. No tiene validez académica.</p>
        </div>
      </article>
    </main>
  );
}
