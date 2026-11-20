"use client";

import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { RequiereCuenta } from "@/components/RequiereCuenta";
import { Check, Estrella, Llama, Pendiente, Siguiente, Vista } from "@/components/Icons";
import { EVALUACIONES, SEMANAS, clasesDeSemana, getClase } from "@/lib/curso";
import { fechaFinCurso, useStore } from "@/lib/store";

export default function Dashboard() {
  return (
    <RequiereCuenta>
      <AppHeader />
      <Contenido />
    </RequiereCuenta>
  );
}

function Anillo({ porcentaje }: { porcentaje: number }) {
  const c = 2 * Math.PI * 36;
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" role="img" aria-label={`Avance del curso: ${porcentaje} por ciento`} className="flex-none">
      <circle cx="44" cy="44" r="36" fill="none" stroke="#EFE6FA" strokeWidth="10" />
      <circle
        cx="44"
        cy="44"
        r="36"
        fill="none"
        stroke="#8B3FD9"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${(porcentaje / 100) * c} ${c}`}
        transform="rotate(-90 44 44)"
        style={{ transition: "stroke-dasharray .6s" }}
      />
      <text x="44" y="50" textAnchor="middle" fontSize="19" fontWeight="700" fill="#2A1350" fontFamily="inherit">
        {porcentaje} %
      </text>
    </svg>
  );
}

function Contenido() {
  const { estado, progreso } = useStore();
  const nombre = estado.usuario?.nombre ?? "";
  const sig = progreso.siguiente;
  const semana = progreso.semanaActual;
  const vistasSemana = clasesDeSemana(semana).filter((c) => estado.vistas.includes(c.id)).length;
  const misDudas = estado.dudas.filter((d) => d.autorEmail === estado.usuario?.email).slice(0, 2);
  const evalPendiente = !sig && !progreso.certificadoHabilitado ? EVALUACIONES.find((e) => !estado.evaluaciones.includes(e.semana)) : undefined;

  return (
    <main className="mx-auto max-w-[1180px] px-4 pt-10 pb-24 sm:px-6 sm:pt-12">
      <h1 className="m-0 text-[clamp(30px,4vw,44px)] font-bold tracking-[-0.03em]">Hola, {nombre}</h1>
      <p className="mt-2.5 text-[17px] font-light text-suave">
        {progreso.certificadoHabilitado
          ? "Terminaste el curso Básico. Tu certificado está listo."
          : `Vas en la semana ${semana} del curso Básico. Esta semana llevas ${vistasSemana} de 3 clases.`}
      </p>
      {progreso.racha > 0 && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[15px] text-medio ring-1 ring-linea">
          <Llama />
          {progreso.racha === 1 ? "Estudiaste hoy. Vuelve mañana para mantener tu racha." : `${progreso.racha} días seguidos estudiando.`}
        </p>
      )}

      <div className="mt-9 flex flex-wrap items-stretch gap-6">
        {progreso.certificadoHabilitado ? (
          <Link
            href="/app/certificado"
            className="flex min-w-0 flex-[999_1_560px] flex-wrap items-center gap-7 rounded-[20px] bg-tinta p-6 text-white no-underline shadow-solido sm:p-8"
          >
            <div className="min-w-0 flex-[1_1_280px]">
              <p className="m-0 flex items-center gap-2 text-[15px] font-medium text-estrella">
                <Estrella size={20} /> Lo lograste
              </p>
              <h2 className="mt-2.5 text-[30px] leading-[1.15] font-bold tracking-tight">Aprobaste las 4 evaluaciones</h2>
              <p className="mt-2.5 text-base font-light text-claro">Descarga tu certificado del curso Básico.</p>
            </div>
            <span className="rounded-full bg-estrella px-6 py-4 text-base font-medium text-tinta-profunda">Ver mi certificado</span>
          </Link>
        ) : (
          <Link
            href={sig ? `/app/clase/${sig.id}` : `/app/evaluacion/${evalPendiente?.semana ?? semana}`}
            className="flex min-w-0 flex-[999_1_560px] flex-wrap items-center gap-7 rounded-[20px] bg-tinta p-6 text-white no-underline shadow-solido sm:p-8"
          >
            <div className="min-w-0 flex-[1_1_280px]">
              <p className="m-0 text-[15px] font-medium text-estrella">
                {estado.vistas.length ? "Sigue donde quedaste" : "Empieza tu curso"}
              </p>
              <h2 className="mt-2.5 text-[30px] leading-[1.15] font-bold tracking-tight">
                {sig ? `Clase ${sig.numero}: ${sig.titulo}` : `Evaluación de la semana ${evalPendiente?.semana}`}
              </h2>
              <p className="mt-2.5 text-base font-light text-claro">
                {sig
                  ? estado.vistas.includes(sig.id)
                    ? "Ya viste el video; te falta aprobar el ejercicio"
                    : `${sig.duracionMin} minutos y un ejercicio para practicar`
                  : "Un quiz corto y un ejercicio para cerrar la semana"}
              </p>
            </div>
            <span className="rounded-full bg-estrella px-6 py-4 text-base font-medium text-tinta-profunda">
              {estado.vistas.length ? "Continuar" : "Empezar"}
            </span>
          </Link>
        )}

        <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-4 rounded-[20px] border-[1.5px] border-linea bg-white p-7">
          <div className="flex items-center gap-5">
            <Anillo porcentaje={progreso.porcentaje} />
            <div>
              <p className="m-0 text-lg font-semibold">Curso Básico</p>
              <p className="mt-1 text-[15px] text-suave">{progreso.vistas} de 12 clases vistas</p>
            </div>
          </div>
          <div className="flex justify-between gap-3 border-t border-linea pt-4 text-[15px]">
            <span className="text-medio">Evaluaciones aprobadas</span>
            <span className="font-semibold">{progreso.evaluaciones} de 4</span>
          </div>
          <div className="flex justify-between gap-3 text-[15px]">
            <span className="text-medio">Ejercicios aprobados</span>
            <span className="font-semibold">{estado.aprobados.filter((a) => !a.startsWith("eval")).length} de 12</span>
          </div>
          <div className="flex justify-between gap-3 text-[15px]">
            <span className="text-medio">Termina tu curso</span>
            <span className="font-semibold">{fechaFinCurso(estado.inscripcion?.creadaEn)}</span>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap items-start gap-8">
        <section aria-labelledby="ruta" className="min-w-0 flex-[999_1_560px]">
          <h2 id="ruta" className="m-0 text-2xl font-bold tracking-tight">
            Tu ruta
          </h2>
          <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-suave">
            <span className="inline-flex items-center gap-1.5"><Check size={16} /> Ejercicio aprobado</span>
            <span className="inline-flex items-center gap-1.5"><Vista size={16} /> Vista</span>
            <span className="inline-flex items-center gap-1.5"><Pendiente size={16} /> Pendiente</span>
          </p>
          <ol className="mt-5 flex list-none flex-col gap-3.5 p-0">
            {SEMANAS.map((s) => {
              const completa = progreso.semanaCompleta(s.numero);
              const abierta = progreso.evaluacionAbierta(s.numero);
              const actual = s.numero === semana && !completa;
              const ev = EVALUACIONES.find((e) => e.semana === s.numero)!;
              return (
                <li key={s.numero} className="rounded-2xl border-[1.5px] border-linea bg-white px-5 py-5 sm:px-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="m-0 text-lg font-semibold">
                      Semana {s.numero}: {s.titulo}
                    </h3>
                    <span
                      className={`text-sm font-medium ${completa ? "text-violeta-texto" : actual ? "text-[#8A5A00]" : "text-tenue"}`}
                    >
                      {completa ? "Completada" : actual ? "En curso" : "Pendiente"}
                    </span>
                  </div>
                  <ul className="mt-3.5 mb-0 flex list-none flex-col gap-1 p-0">
                    {clasesDeSemana(s.numero).map((c) => {
                      const v = estado.vistas.includes(c.id);
                      const ap = estado.aprobados.includes(c.ejercicio.id);
                      const esSig = sig?.id === c.id;
                      return (
                        <li key={c.id}>
                          <Link
                            href={`/app/clase/${c.id}`}
                            className={`-mx-2 flex items-center gap-3 rounded-lg px-2 py-1.5 text-[15px] no-underline hover:bg-papel ${
                              v || esSig ? "text-tinta" : "text-tenue"
                            }`}
                          >
                            {ap && v ? <Check /> : esSig ? <Siguiente /> : v ? <Vista /> : <Pendiente />}
                            <span className="flex-auto">{c.titulo}</span>
                            <span className="text-sm text-tenue">
                              {ap && v ? "Aprobada" : v ? "Falta el ejercicio" : `${c.duracionMin} min`}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                    <li>
                      <Link
                        href={`/app/evaluacion/${s.numero}`}
                        className={`-mx-2 flex items-center gap-3 rounded-lg px-2 py-1.5 text-[15px] no-underline hover:bg-papel ${
                          completa || abierta ? "text-tinta" : "text-tenue"
                        }`}
                      >
                        {completa ? <Check /> : abierta ? <Siguiente /> : <Pendiente />}
                        <span className="flex-auto">{s.numero === 4 ? "Entrega final" : "Evaluación de la semana"}</span>
                        <span className="text-sm text-tenue">
                          {completa ? "Aprobada" : abierta ? "Abierta" : "Se abre al ver las 3 clases"}
                        </span>
                      </Link>
                    </li>
                  </ul>
                  <span className="sr-only">{ev.titulo}</span>
                </li>
              );
            })}
          </ol>
        </section>

        <aside className="flex min-w-0 flex-[1_1_300px] flex-col gap-6">
          <section aria-labelledby="dudas-h" className="rounded-[20px] border-[1.5px] border-linea bg-white p-6">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="dudas-h" className="m-0 text-xl font-bold">
                Tus dudas
              </h2>
              <Link href="/app/dudas" className="text-[15px] text-violeta-texto">
                Ver todas
              </Link>
            </div>
            {misDudas.length === 0 && (
              <p className="mt-4 text-[15px] leading-relaxed text-suave">
                Aún no has enviado dudas. Desde cada clase puedes escribirle al profe con tu código adjunto.
              </p>
            )}
            {misDudas.map((d) => (
              <div
                key={d.id}
                className={`mt-3 rounded-xl px-4 py-3.5 ${d.respuesta ? "bg-papel" : "border-[1.5px] border-dashed border-lila-borde"}`}
              >
                <p className="m-0 text-[15px] font-medium">{d.pregunta}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-medio">
                  {d.respuesta
                    ? `Respondida por ${d.respondidaPor}: ${d.respuesta}`
                    : `Enviada en ${getClase(d.claseId)?.titulo ?? "una clase"}. Respuesta en máximo 24 horas.`}
                </p>
              </div>
            ))}
          </section>
          <section aria-labelledby="cert-h" className="rounded-[20px] border-[1.5px] border-linea bg-white p-6">
            <div className="flex items-start gap-3.5">
              <Estrella size={28} relleno={progreso.certificadoHabilitado} />
              <div>
                <h2 id="cert-h" className="m-0 text-xl font-bold">
                  Certificado
                </h2>
                <p className="mt-1.5 text-[15px] leading-relaxed text-medio">
                  {progreso.certificadoHabilitado ? (
                    <Link href="/app/certificado" className="text-violeta-texto">
                      Ya puedes descargarlo.
                    </Link>
                  ) : (
                    `Se habilita cuando apruebes las 4 evaluaciones semanales. Llevas ${progreso.evaluaciones}.`
                  )}
                </p>
              </div>
            </div>
          </section>
          <p className="text-sm text-suave">
            ¿Te trabaste? Consulta en vivo martes y jueves, 6:00 p. m.
          </p>
        </aside>
      </div>
    </main>
  );
}
