"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { CLASES, SEMANAS, clasesDeSemana, getEvaluacion, type Clase } from "@/lib/curso";
import { useStore } from "@/lib/store";
import { Ejercicio } from "./Ejercicio";
import { VideoMock } from "./VideoMock";
import { Descargar, Documento } from "./Icons";

export function ClaseVista({ clase, modo }: { clase: Clase; modo: "muestra" | "estudiante" }) {
  const store = useStore();
  const { estado, marcarVista, registrarIntento, progreso } = store;
  const codigoActual = useRef(clase.ejercicio.codigoInicial);
  const [avisoDescarga, setAvisoDescarga] = useState(false);
  const semana = SEMANAS.find((s) => s.numero === clase.semana)!;
  const delaSemana = clasesDeSemana(clase.semana);
  const esEstudiante = modo === "estudiante";
  const vista = esEstudiante && estado.vistas.includes(clase.id);
  const aprobado = esEstudiante && estado.aprobados.includes(clase.ejercicio.id);
  const indice = CLASES.findIndex((c) => c.id === clase.id);
  const siguiente = CLASES[indice + 1];

  const onVista = useCallback(() => {
    if (esEstudiante) marcarVista(clase.id);
  }, [esEstudiante, marcarVista, clase.id]);

  const onCodigo = useCallback((c: string) => {
    codigoActual.current = c;
  }, []);

  const ultimaDeSemana = clase.orden === 3;
  const mensajeExito = esEstudiante
    ? ultimaDeSemana
      ? progreso.evaluacionAbierta(clase.semana)
        ?`Ya puedes presentar la evaluación de la semana ${clase.semana}.`
        : "Cuando veas las 3 clases de la semana se abre la evaluación."
      : siguiente
        ? `Sigue con la clase ${siguiente.numero}: ${siguiente.titulo}.`
        : undefined
    : "Así se practica en cada clase de Base Cero. Inscríbete para seguir con las 12 clases.";

  return (
    <main className="mx-auto flex max-w-[1280px] flex-wrap items-start gap-8 px-4 pt-9 pb-24 sm:px-6">
      <div className="flex min-w-0 flex-[999_1_640px] flex-col gap-8">
        <div>
          <p className="m-0 text-[15px] font-medium text-violeta-texto">
            {modo === "muestra" ? "Clase de muestra · " : ""}Clase {clase.numero} de 12 · {clase.duracionMin} min
          </p>
          <h1 className="mt-1.5 text-[clamp(28px,3.6vw,42px)] leading-[1.1] font-bold tracking-[-0.03em]">
            {clase.titulo}: {clase.subtitulo.charAt(0).toLowerCase() + clase.subtitulo.slice(1)}
          </h1>
          {clase.contenidoDeMuestra && (
            <p className="mt-3 inline-block rounded-lg bg-aviso px-3 py-1.5 text-sm text-aviso-texto">
              Contenido de muestra: esta clase se completa en la siguiente fase del piloto.
            </p>
          )}
        </div>

        <VideoMock key={clase.id} codigo={clase.codigoVideo} duracionMin={clase.duracionMin} vista={vista} onVista={onVista} />

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setAvisoDescarga(true)}
            className="flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-linea bg-white px-5 py-3 text-[15px] text-tinta hover:border-lila-borde"
          >
            <Descargar /> Descargar video (38 MB)
          </button>
          <Link
            href={`/guia/${clase.id}`}
            target="_blank"
            className="flex items-center gap-2 rounded-full border-[1.5px] border-linea bg-white px-5 py-3 text-[15px] text-tinta no-underline hover:border-lila-borde"
          >
            <Documento /> Guía de la clase (PDF)
          </Link>
          {esEstudiante && !vista && (
            <button
              type="button"
              onClick={onVista}
              className="cursor-pointer rounded-full border-0 bg-transparent px-3 py-3 text-[15px] text-suave underline hover:text-tinta"
            >
              Marcar como vista
            </button>
          )}
        </div>
        {avisoDescarga && (
          <p role="status" className="-mt-4 rounded-xl bg-aviso px-4 py-3 text-[15px] text-aviso-texto">
            En la versión final podrás descargar el video para verlo sin conexión. En el piloto todavía no hay videos reales.
          </p>
        )}

        <section aria-labelledby="apuntes-h" className="rounded-[20px] border-[1.5px] border-linea bg-white p-5 sm:p-7">
          <h2 id="apuntes-h" className="m-0 text-xl font-bold">
            Apuntes de la clase
          </h2>
          <ul className="mt-3 mb-0 flex list-none flex-col gap-2.5 p-0">
            {clase.apuntes.map((a) => (
              <li key={a} className="flex gap-3 text-base leading-relaxed text-medio">
                <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-violeta" />
                {a}
              </li>
            ))}
          </ul>
        </section>

        <Ejercicio
          key={clase.ejercicio.id}
          ejercicio={clase.ejercicio}
          codigoGuardado={esEstudiante ? estado.codigos[clase.ejercicio.id] : undefined}
          yaAprobado={aprobado}
          mensajeExito={mensajeExito}
          onCodigo={onCodigo}
          onResultado={(ok, codigo) => {
            if (esEstudiante) registrarIntento(clase.ejercicio.id, ok, codigo);
          }}
        />

        {esEstudiante && (
          <div className="flex flex-wrap justify-between gap-3">
            {indice > 0 ? (
              <Link href={`/app/clase/${CLASES[indice - 1].id}`} className="rounded-full border-[1.5px] border-tinta px-5 py-3 text-tinta no-underline">
                ← Clase anterior
              </Link>
            ) : (
              <span />
            )}
            {ultimaDeSemana ? (
              <Link
                href={`/app/evaluacion/${clase.semana}`}
                className="rounded-full bg-tinta px-5 py-3 font-medium text-white no-underline"
              >
                Ir a la evaluación de la semana →
              </Link>
            ) : (
              siguiente && (
                <Link href={`/app/clase/${siguiente.id}`} className="rounded-full bg-tinta px-5 py-3 font-medium text-white no-underline">
                  Siguiente clase →
                </Link>
              )
            )}
          </div>
        )}
      </div>

      <aside className="flex min-w-0 flex-[1_1_320px] flex-col gap-6">
        <section aria-labelledby="sem-h" className="rounded-[20px] border-[1.5px] border-linea bg-white p-6">
          <h2 id="sem-h" className="m-0 text-lg font-bold">
            Semana {semana.numero}: {semana.titulo}
          </h2>
          <ol className="mt-4 mb-0 flex list-none flex-col gap-1 p-0 text-[15px]">
            {delaSemana.map((c) => {
              const actual = c.id === clase.id;
              const v = esEstudiante && estado.vistas.includes(c.id);
              const ap = esEstudiante && estado.aprobados.includes(c.ejercicio.id);
              const etiqueta = actual ? "Ahora" : ap ? "Aprobada" : v ? "Vista" : "";
              const contenido = (
                <>
                  <span>
                    {c.numero}. {c.titulo}
                  </span>
                  <span className="flex-none">{etiqueta}</span>
                </>
              );
              const cls = `flex justify-between gap-2.5 rounded-[10px] px-3 py-2.5 no-underline ${
                actual ? "bg-lila font-medium text-tinta" : "text-medio hover:bg-papel"
              }`;
              return (
                <li key={c.id}>
                  {esEstudiante ? (
                    <Link href={`/app/clase/${c.id}`} aria-current={actual ? "page" : undefined} className={cls}>
                      {contenido}
                    </Link>
                  ) : (
                    <span className={`${cls} ${actual ? "" : "text-tenue"}`}>{contenido}</span>
                  )}
                </li>
              );
            })}
            <li>
              {esEstudiante ? (
                <Link href={`/app/evaluacion/${clase.semana}`} className="flex justify-between gap-2.5 rounded-[10px] px-3 py-2.5 text-tenue no-underline hover:bg-papel">
                  <span>{getEvaluacion(clase.semana)?.semana === 4 ? "Entrega final" : "Evaluación"}</span>
                  <span>
                    {progreso.semanaCompleta(clase.semana) ? "Aprobada" : progreso.evaluacionAbierta(clase.semana) ? "Abierta" : "Bloqueada"}
                  </span>
                </Link>
              ) : (
                <span className="flex justify-between gap-2.5 px-3 py-2.5 text-tenue">
                  <span>Evaluación</span>
                  <span>Con inscripción</span>
                </span>
              )}
            </li>
          </ol>
        </section>

        {esEstudiante ? (
          <PanelDuda claseId={clase.id} codigoActual={codigoActual} />
        ) : (
          <section className="rounded-[20px] bg-tinta p-6 text-white shadow-solido">
            <h2 className="m-0 text-lg font-bold">¿Te gustó la clase?</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-claro">
              El curso Básico tiene 12 clases como esta, 4 evaluaciones, dudas respondidas por el profe en máximo 24 horas y
              certificado.
            </p>
            <p className="mt-4 text-[32px] font-bold tracking-tight">
              $24.900 <span className="text-[15px] font-normal text-claro">COP · 4 semanas</span>
            </p>
            <Link
              href="/registro"
              className="mt-4 block rounded-full bg-estrella px-5 py-3.5 text-center font-medium text-tinta-profunda no-underline"
            >
              Crear mi cuenta e inscribirme
            </Link>
            <Link href="/#niveles" className="mt-3 block text-center text-[15px] text-claro">
              Ver qué incluye cada nivel
            </Link>
          </section>
        )}
      </aside>
    </main>
  );
}

function PanelDuda({ claseId, codigoActual }: { claseId: string; codigoActual: React.RefObject<string> }) {
  const { enviarDuda } = useStore();
  const [texto, setTexto] = useState("");
  const [enviada, setEnviada] = useState(false);
  const [adjuntar, setAdjuntar] = useState(true);

  return (
    <section id="duda" aria-labelledby="duda-h" className="rounded-[20px] bg-tinta p-6 text-white">
      <h2 id="duda-h" className="m-0 text-lg font-bold">
        ¿Te trabaste?
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-claro">
        Escríbele al profe. Te respondemos en máximo 24 horas y le llega tu código del ejercicio.
      </p>
      {!enviada ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!texto.trim()) return;
            enviarDuda(claseId, texto.trim(), adjuntar ? codigoActual.current ?? "" : "");
            setEnviada(true);
            setTexto("");
          }}
        >
          <label htmlFor="duda-txt" className="mt-4 block text-sm text-claro">
            Tu duda
          </label>
          <textarea
            id="duda-txt"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={4}
            required
            placeholder="Ej.: ¿por qué mi ciclo no se detiene?"
            className="mt-1.5 w-full resize-y rounded-xl border-0 bg-white px-3.5 py-3 text-[15px] text-tinta"
          />
          <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-claro">
            <input type="checkbox" checked={adjuntar} onChange={(e) => setAdjuntar(e.target.checked)} className="h-4 w-4 accent-estrella" />
            Adjuntar mi código del ejercicio
          </label>
          <button
            type="submit"
            className="mt-3 min-h-[46px] cursor-pointer rounded-full border-0 bg-estrella px-5 py-3 text-[15px] font-medium text-tinta-profunda"
          >
            Enviar duda
          </button>
        </form>
      ) : (
        <div role="status" className="mt-4 rounded-xl bg-[#3A2160] px-4 py-3.5 text-[15px] leading-relaxed">
          Duda enviada. La verás respondida en{" "}
          <Link href="/app/dudas" className="text-estrella">
            Mis dudas
          </Link>
          .{" "}
          <button type="button" onClick={() => setEnviada(false)} className="cursor-pointer border-0 bg-transparent p-0 text-claro underline">
            Enviar otra
          </button>
        </div>
      )}
      <p className="mt-4 text-sm text-claro-2">Consulta en vivo: martes y jueves, 6:00 p. m.</p>
    </section>
  );
}
