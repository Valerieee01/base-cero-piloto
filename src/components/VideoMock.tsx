"use client";

import { useEffect, useState } from "react";
import { Play, Estrella } from "./Icons";

/**
 * Reproductor de muestra. En el piloto no hay videos reales: al reproducir se
 * simula la clase durante unos segundos y se marca como vista.
 * Producción: YouTube no listado o Cloudflare Stream (§5).
 */
export function VideoMock({
  codigo,
  duracionMin,
  vista,
  onVista,
}: {
  codigo: string[];
  duracionMin: number;
  vista: boolean;
  onVista: () => void;
}) {
  const [estado, setEstado] = useState<"quieto" | "reproduciendo" | "fin">(vista ? "fin" : "quieto");
  const DURACION_DEMO = 4000;

  useEffect(() => {
    if (estado !== "reproduciendo") return;
    const t = setTimeout(() => {
      setEstado("fin");
      onVista();
    }, DURACION_DEMO);
    return () => clearTimeout(t);
  }, [estado, onVista]);

  return (
    <div className="cuaderno-oscuro relative flex aspect-video items-center justify-center overflow-hidden rounded-[20px] bg-tinta-profunda">
      <div className="absolute top-4 left-4 font-mono text-[13px] leading-[1.8] text-claro sm:top-8 sm:left-8 sm:text-lg">
        {codigo.map((l, i) => (
          <div key={i} className="whitespace-pre">
            {resaltar(l)}
          </div>
        ))}
      </div>

      {estado === "quieto" && (
        <button
          type="button"
          aria-label="Reproducir la clase"
          onClick={() => setEstado("reproduciendo")}
          className="relative flex h-[72px] w-[72px] cursor-pointer items-center justify-center rounded-full border-0 bg-estrella hover:scale-105 sm:h-[88px] sm:w-[88px]"
        >
          <Play />
        </button>
      )}
      {estado === "reproduciendo" && (
        <div className="absolute inset-x-0 bottom-0 bg-noche/70 px-5 py-4">
          <p className="m-0 text-[14px] text-claro" role="status">
            Reproduciendo la clase (demostración: el video real se agrega en la siguiente fase)…
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-estrella" style={{ animation: `llenar ${DURACION_DEMO}ms linear forwards` }} />
          </div>
        </div>
      )}
      {estado === "fin" && (
        <div className="relative flex flex-col items-center gap-3 rounded-2xl bg-noche/80 px-6 py-5 text-center">
          <Estrella size={30} />
          <p className="m-0 font-medium text-white">Clase vista</p>
          <button
            type="button"
            onClick={() => setEstado("reproduciendo")}
            className="cursor-pointer rounded-full border border-claro/40 bg-transparent px-4 py-2 text-sm text-claro hover:text-white"
          >
            Ver de nuevo
          </button>
        </div>
      )}
      <p className="absolute right-6 bottom-5 m-0 text-[15px] text-claro">{duracionMin}:00</p>
    </div>
  );
}

const CLAVES = /\b(print|while|for|in|range|if|elif|else|int|str|SELECT|FROM|WHERE|ORDER BY|COUNT)\b/g;

function resaltar(linea: string) {
  const partes: React.ReactNode[] = [];
  let ultimo = 0;
  for (const m of linea.matchAll(CLAVES)) {
    partes.push(linea.slice(ultimo, m.index));
    partes.push(
      <span key={m.index} className="text-codigo-key">
        {m[0]}
      </span>,
    );
    ultimo = m.index! + m[0].length;
  }
  partes.push(linea.slice(ultimo));
  return partes;
}
