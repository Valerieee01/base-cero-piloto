"use client";

import { useState } from "react";
import { StaffHeader } from "@/components/StaffHeader";
import { getClase } from "@/lib/curso";
import { haceCuanto, horasDesde, useStore, type Duda } from "@/lib/store";

export default function BandejaDocente() {
  const { estado, listo } = useStore();
  const [filtro, setFiltro] = useState<"pendientes" | "respondidas">("pendientes");
  const pendientes = estado.dudas
    .filter((d) => !d.respuesta)
    .sort((a, b) => a.creadaEn.localeCompare(b.creadaEn)); // más antiguas primero
  const respondidas = estado.dudas.filter((d) => d.respuesta).sort((a, b) => (b.respondidaEn ?? "").localeCompare(a.respondidaEn ?? ""));
  const lista = filtro === "pendientes" ? pendientes : respondidas;

  return (
    <div className="min-h-screen bg-papel">
      <StaffHeader rol="Docente" />
      <main className="mx-auto max-w-[1000px] px-4 pt-10 pb-24 sm:px-6">
        <h1 className="m-0 text-[clamp(30px,4vw,44px)] font-bold tracking-[-0.03em]">Bandeja de dudas</h1>
        <p className="mt-2.5 text-[17px] font-light text-suave">
          Ordenadas por antigüedad. La promesa al estudiante es responder en máximo 24 horas.
        </p>
        <div role="tablist" aria-label="Filtro" className="mt-7 inline-flex gap-1 rounded-full bg-white p-1 ring-1 ring-linea">
          {(["pendientes", "respondidas"] as const).map((f) => (
            <button
              key={f}
              role="tab"
              type="button"
              aria-selected={filtro === f}
              onClick={() => setFiltro(f)}
              className={`min-h-11 cursor-pointer rounded-full border-0 px-5 py-2 text-[15px] ${
                filtro === f ? "bg-tinta font-medium text-white" : "bg-transparent text-medio"
              }`}
            >
              {f === "pendientes" ? `Pendientes (${pendientes.length})` : `Respondidas (${respondidas.length})`}
            </button>
          ))}
        </div>

        {listo && lista.length === 0 && (
          <p className="mt-8 rounded-[20px] border-[1.5px] border-dashed border-lila-borde bg-white p-7 text-[17px] text-medio">
            {filtro === "pendientes" ? "No hay dudas pendientes. ¡Bandeja al día!" : "Aún no hay dudas respondidas."}
          </p>
        )}
        <ul className="mt-6 flex list-none flex-col gap-4 p-0">
          {listo && lista.map((d) => (
            <TarjetaDocente key={d.id} d={d} />
          ))}
        </ul>
      </main>
    </div>
  );
}

function TarjetaDocente({ d }: { d: Duda }) {
  const { responderDuda } = useStore();
  const [texto, setTexto] = useState("");
  const clase = getClase(d.claseId);
  const horas = horasDesde(d.creadaEn);
  const urgente = !d.respuesta && horas > 18;

  return (
    <li className={`rounded-[20px] border-[1.5px] bg-white p-5 sm:p-6 ${urgente ? "border-estrella" : "border-linea"}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
        <span className="font-medium text-tinta">
          {d.autor}
          {d.ejemplo && <span className="ml-2 rounded-full bg-lila px-2 py-0.5 text-[12px] text-violeta-texto">ejemplo</span>}
        </span>
        <span className={urgente ? "font-medium text-[#8A5A00]" : "text-suave"}>
          {haceCuanto(d.creadaEn)}
          {urgente ? " · por vencer" : ""}
        </span>
      </div>
      <p className="mt-1 text-sm text-violeta-texto">
        Clase {clase?.numero}: {clase?.titulo} · Semana {clase?.semana}
      </p>
      <p className="mt-2.5 text-lg font-medium">{d.pregunta}</p>
      {d.codigoAdjunto.trim() ? (
        <>
          <p className="mt-3 mb-1 text-[13px] text-suave">Código del estudiante</p>
          <pre className="overflow-x-auto rounded-xl bg-tinta-profunda px-4 py-3 font-mono text-[14px] leading-relaxed text-codigo">
            {d.codigoAdjunto}
          </pre>
        </>
      ) : (
        <p className="mt-2 text-sm text-suave">Sin código adjunto.</p>
      )}
      {clase && (
        <details className="mt-2 text-sm text-medio">
          <summary className="cursor-pointer py-1 text-violeta-texto">Ver enunciado del ejercicio</summary>
          <p className="mt-1">{clase.ejercicio.enunciado}</p>
        </details>
      )}
      {d.respuesta ? (
        <div className="mt-4 rounded-xl bg-papel px-4 py-3.5">
          <p className="m-0 text-sm font-medium text-violeta-texto">Tu respuesta</p>
          <p className="mt-1 text-[15px] leading-relaxed text-medio">{d.respuesta}</p>
        </div>
      ) : (
        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (texto.trim()) responderDuda(d.id, texto.trim());
          }}
        >
          <label htmlFor={`r-${d.id}`} className="text-[15px] text-medio">
            Respuesta
          </label>
          <textarea
            id={`r-${d.id}`}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={3}
            required
            placeholder="Explica con palabras sencillas y, si puedes, muestra el código corregido."
            className="mt-1.5 w-full resize-y rounded-xl border-[1.5px] border-lila-borde px-4 py-3 text-[15px] text-tinta"
          />
          <button
            type="submit"
            className="mt-2.5 min-h-12 cursor-pointer rounded-full border-0 bg-violeta px-6 py-3 text-[15px] font-medium text-white hover:bg-violeta-texto"
          >
            Enviar respuesta
          </button>
        </form>
      )}
    </li>
  );
}
