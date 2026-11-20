"use client";

import Link from "next/link";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Ejercicio } from "@/components/Ejercicio";
import { RequiereCuenta } from "@/components/RequiereCuenta";
import { Candado, Estrella } from "@/components/Icons";
import { clasesDeSemana, getEvaluacion } from "@/lib/curso";
import { useStore } from "@/lib/store";

const MINIMO = 0.6;

export function EvaluacionVista({ semana }: { semana: number }) {
  return (
    <RequiereCuenta>
      <AppHeader migas={[{ href: "/app", label: "Mi aprendizaje" }, { label: `Evaluación semana ${semana}` }]} />
      <Contenido semana={semana} />
    </RequiereCuenta>
  );
}

function Contenido({ semana }: { semana: number }) {
  const ev = getEvaluacion(semana)!;
  const { estado, progreso, registrarIntento, aprobarEvaluacion } = useStore();
  const [respuestas, setRespuestas] = useState<(number | null)[]>(ev.preguntas.map(() => null));
  const [revisado, setRevisado] = useState(false);
  const aprobada = progreso.semanaCompleta(semana);
  const abierta = progreso.evaluacionAbierta(semana);
  const ejOk = estado.aprobados.includes(ev.ejercicio.id);
  const correctas = respuestas.filter((r, i) => r === ev.preguntas[i].correcta).length;
  const quizOk = correctas / ev.preguntas.length >= MINIMO;
  const faltan = clasesDeSemana(semana).filter((c) => !estado.vistas.includes(c.id));

  if (!abierta && !aprobada) {
    return (
      <main className="mx-auto max-w-[760px] px-4 py-16 sm:px-6">
        <div className="rounded-[20px] border-[1.5px] border-linea bg-white p-8">
          <Candado size={32} color="#7A2FCC" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight">{ev.titulo}</h1>
          <p className="mt-3 text-[17px] leading-relaxed text-medio">
            La evaluación se abre cuando veas las 3 clases de la semana. Te falta:
          </p>
          <ul className="mt-3 flex list-none flex-col gap-2 p-0">
            {faltan.map((c) => (
              <li key={c.id}>
                <Link href={`/app/clase/${c.id}`} className="text-violeta-texto">
                  Clase {c.numero}: {c.titulo}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[880px] px-4 pt-10 pb-24 sm:px-6">
      <p className="m-0 text-[15px] font-medium text-violeta-texto">Semana {semana} · Evaluación</p>
      <h1 className="mt-1.5 text-[clamp(28px,3.6vw,40px)] leading-[1.1] font-bold tracking-[-0.03em]">{ev.titulo}</h1>
      <p className="mt-3 text-[17px] text-medio">
        Para aprobar necesitas al menos {Math.ceil(ev.preguntas.length * MINIMO)} de {ev.preguntas.length} respuestas correctas y el
        ejercicio práctico.
      </p>

      {aprobada && (
        <div role="status" className="mt-6 flex items-start gap-3 rounded-[20px] bg-tinta p-6 text-white shadow-solido">
          <Estrella size={32} />
          <div>
            <p className="m-0 text-xl font-semibold">Aprobaste la evaluación de la semana {semana}</p>
            <p className="mt-1.5 text-[15px] text-claro">
              {progreso.certificadoHabilitado ? (
                <>
                  Completaste las 4 evaluaciones.{" "}
                  <Link href="/app/certificado" className="text-estrella">
                    Descarga tu certificado
                  </Link>
                  .
                </>
              ) : (
                <>
                  Llevas {progreso.evaluaciones} de 4.{" "}
                  <Link href="/app" className="text-estrella">
                    Volver a mi ruta
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      )}

      <section aria-labelledby="quiz-h" className="mt-8 rounded-[20px] border-[1.5px] border-linea bg-white p-5 sm:p-7">
        <h2 id="quiz-h" className="m-0 text-2xl font-bold tracking-tight">
          1. Preguntas
        </h2>
        <ol className="mt-5 mb-0 flex list-none flex-col gap-6 p-0">
          {ev.preguntas.map((p, i) => (
            <li key={p.pregunta}>
              <fieldset className="m-0 border-0 p-0">
                <legend className="text-[17px] font-medium">
                  {i + 1}. {p.pregunta}
                </legend>
                <div className="mt-3 flex flex-col gap-2">
                  {p.opciones.map((o, j) => {
                    const marcada = respuestas[i] === j;
                    const bien = revisado && marcada && j === p.correcta;
                    const mal = revisado && marcada && j !== p.correcta;
                    return (
                      <label
                        key={o}
                        className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-[1.5px] px-4 py-2.5 text-base ${
                          bien ? "border-exito bg-[#EAF6EE]" : mal ? "border-error bg-[#FDF1EF]" : marcada ? "border-violeta bg-lila" : "border-linea"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`p${i}`}
                          checked={marcada}
                          onChange={() => {
                            setRevisado(false);
                            setRespuestas((r) => r.map((x, k) => (k === i ? j : x)));
                          }}
                          className="h-5 w-5 accent-violeta"
                        />
                        {o}
                        {bien && <span className="ml-auto text-sm text-exito">Correcta</span>}
                        {mal && <span className="ml-auto text-sm text-error-texto">Revisa esta</span>}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            disabled={respuestas.some((r) => r === null)}
            onClick={() => {
              setRevisado(true);
              if (quizOk && ejOk) aprobarEvaluacion(semana);
            }}
            className="min-h-12 cursor-pointer rounded-full border-0 bg-violeta px-6 py-3 text-base font-medium text-white hover:bg-violeta-texto disabled:cursor-not-allowed disabled:opacity-50"
          >
            Revisar respuestas
          </button>
          <div aria-live="polite" className="text-[15px]">
            {revisado && (
              <span className={quizOk ? "text-exito" : "text-error-texto"}>
                {correctas} de {ev.preguntas.length} correctas. {quizOk ? (ejOk ? "¡Aprobaste!" : "Ahora resuelve el ejercicio.") : "Inténtalo de nuevo."}
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="mt-8">
        <Ejercicio
          ejercicio={ev.ejercicio}
          titulo="2. Ejercicio práctico"
          codigoGuardado={estado.codigos[ev.ejercicio.id]}
          yaAprobado={ejOk}
          mensajeExito={quizOk && revisado ? "Con esto apruebas la evaluación de la semana." : "Si ya respondiste las preguntas, revísalas para cerrar la evaluación."}
          onResultado={(ok, codigo) => {
            registrarIntento(ev.ejercicio.id, ok, codigo);
            if (ok && revisado && quizOk) aprobarEvaluacion(semana);
          }}
        />
      </div>
    </main>
  );
}
