"use client";

import { useState } from "react";
import { Estrella } from "../Icons";

export function HeroCodigo() {
  const [nombre, setNombre] = useState("");
  const [ejecutado, setEjecutado] = useState(false);
  const limpio = nombre.trim();

  return (
    <div className="min-w-0 flex-1 basis-[440px] rounded-[20px] bg-tinta-profunda p-5 text-codigo shadow-solido-lg sm:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="m-0 text-xl font-semibold text-white">Tu primera línea de código</h2>
        <span className="text-sm text-[#B9A6D6]">Python</span>
      </div>
      <label htmlFor="nombre-input" className="mt-2.5 block text-[15px] font-light text-claro-2">
        Escribe tu nombre entre las comillas y presiona Ejecutar.
      </label>
      <div className="mt-5 overflow-x-auto rounded-xl bg-noche px-4 py-5 font-mono text-[15px] leading-loose sm:text-[17px]">
        <div className="flex flex-wrap items-center">
          <span className="inline-block w-7 text-[#6E5A8C]">1</span>
          <span>nombre = </span>
          <span className="text-estrella">&quot;</span>
          <input
            id="nombre-input"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              setEjecutado(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && setEjecutado(true)}
            placeholder="tu nombre"
            autoComplete="off"
            className="w-[9em] border-0 border-b-2 border-dashed border-estrella bg-transparent px-0.5 font-mono text-estrella placeholder:text-estrella/50 focus:outline-none"
          />
          <span className="text-estrella">&quot;</span>
        </div>
        <div className="whitespace-nowrap">
          <span className="inline-block w-7 text-[#6E5A8C]">2</span>
          <span className="text-codigo-key">print</span>(<span className="text-estrella">&quot;Hola, &quot;</span> + nombre)
        </div>
      </div>
      <button
        type="button"
        onClick={() => setEjecutado(true)}
        className="mt-4 min-h-12 cursor-pointer rounded-full border-0 bg-estrella px-6 py-3 text-base font-medium text-tinta-profunda hover:brightness-105"
      >
        Ejecutar
      </button>
      <div aria-live="polite" className="mt-5 min-h-[120px] border-t border-[#3D2463] pt-4">
        {!ejecutado && <p className="m-0 text-[15px] text-[#9C88BD]">Aquí aparecerá lo que tu programa muestre en pantalla.</p>}
        {ejecutado && !limpio && (
          <>
            <p className="m-0 font-mono text-[17px] text-white">Hola, </p>
            <p className="mt-2.5 text-[15px] text-claro-2">
              Funcionó, pero el saludo quedó sin nombre. Escribe algo entre las comillas y vuelve a ejecutar.
            </p>
          </>
        )}
        {ejecutado && limpio && (
          <>
            <p className="m-0 font-mono text-[17px] break-words text-white">Hola, {limpio}</p>
            <div className="mt-3.5 flex items-start gap-3">
              <Estrella />
              <p className="m-0 text-[15px] leading-relaxed text-codigo">
                Acabas de escribir un programa. Guardaste un dato en una <strong className="font-semibold text-white">variable</strong> y
                lo mostraste en pantalla. Así empieza la clase 2 del curso Básico.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
