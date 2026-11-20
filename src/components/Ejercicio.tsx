"use client";

import { useEffect, useId, useState } from "react";
import type { Ejercicio as TEjercicio } from "@/lib/curso";
import { precargarPython } from "@/lib/python";
import { precargarSql, type Tabla } from "@/lib/sql";
import { verificar, type Verificacion } from "@/lib/verificar";
import { Estrella } from "./Icons";

interface Props {
  ejercicio: TEjercicio;
  titulo?: string;
  codigoGuardado?: string;
  yaAprobado?: boolean;
  mensajeExito?: string;
  onResultado?: (aprobado: boolean, codigo: string) => void;
  onCodigo?: (codigo: string) => void;
}

export function TablaResultado({ tabla }: { tabla: Tabla }) {
  if (!tabla.columnas.length) return <p className="m-0 text-[15px] text-claro">La consulta no devolvió datos.</p>;
  return (
    <div className="max-w-full overflow-x-auto rounded-xl bg-white">
      <table className="w-full border-collapse text-left font-mono text-[14px] text-tinta">
        <thead>
          <tr className="bg-lila">
            {tabla.columnas.map((c) => (
              <th key={c} className="border-b border-linea px-3 py-2 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tabla.filas.map((f, i) => (
            <tr key={i} className="border-b border-linea last:border-0">
              {f.map((v, j) => (
                <td key={j} className="px-3 py-2 whitespace-nowrap">
                  {String(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Ejercicio({ ejercicio, titulo = "Ahora tú", codigoGuardado, yaAprobado, mensajeExito, onResultado, onCodigo }: Props) {
  const [codigo, setCodigo] = useState(codigoGuardado ?? ejercicio.codigoInicial);
  const [pista, setPista] = useState(false);
  const [corriendo, setCorriendo] = useState(false);
  const [res, setRes] = useState<Verificacion | null>(null);
  const idCodigo = useId();
  const esSql = ejercicio.tipo === "SQL";

  useEffect(() => {
    if (esSql) precargarSql();
    else precargarPython();
  }, [esSql]);

  useEffect(() => {
    onCodigo?.(codigo);
  }, [codigo, onCodigo]);

  async function ejecutar() {
    setCorriendo(true);
    setRes(null);
    try {
      const r = await verificar(ejercicio, codigo);
      setRes(r);
      onResultado?.(r.aprobado, codigo);
    } catch (e) {
      setRes({ aprobado: false, mensaje: (e as Error).message || "No se pudo ejecutar. Revisa tu conexión e inténtalo de nuevo." });
    } finally {
      setCorriendo(false);
    }
  }

  function alTeclear(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Tab inserta 4 espacios (sangría de Python) en lugar de salir del editor.
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      const t = e.currentTarget;
      const ini = t.selectionStart;
      const fin = t.selectionEnd;
      const nuevo = codigo.slice(0, ini) + "    " + codigo.slice(fin);
      setCodigo(nuevo);
      requestAnimationFrame(() => {
        t.selectionStart = t.selectionEnd = ini + 4;
      });
    }
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      ejecutar();
    }
  }

  return (
    <section id="ejercicio" aria-labelledby={`${idCodigo}-h`} className="rounded-[20px] border-[1.5px] border-tinta bg-white p-5 sm:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id={`${idCodigo}-h`} className="m-0 text-2xl font-bold tracking-tight">
          {titulo}
        </h2>
        <span className="text-sm text-suave">
          {esSql ? "SQL" : "Python"} · se revisa solo, en tu navegador
        </span>
      </div>
      <p className="mt-3 max-w-[40em] text-[17px] leading-relaxed text-tinta">{ejercicio.enunciado}</p>
      {esSql && (
        <p className="mt-2 text-[14px] leading-relaxed text-suave">
          Tabla <code className="rounded-md bg-lila px-1.5 py-0.5 font-mono">estudiantes</code> con los campos id, nombre,
          ciudad, edad y nivel.
        </p>
      )}
      {yaAprobado && !res && (
        <p className="mt-3 flex items-center gap-2 text-[15px] text-violeta-texto">
          <Estrella size={18} /> Ya aprobaste este ejercicio. Puedes volver a intentarlo cuando quieras.
        </p>
      )}
      <label htmlFor={idCodigo} className="mt-5 block text-[15px] text-medio">
        Tu código
      </label>
      <textarea
        id={idCodigo}
        value={codigo}
        onChange={(e) => {
          setCodigo(e.target.value);
          setRes(null);
        }}
        onKeyDown={alTeclear}
        rows={Math.max(6, codigo.split("\n").length + 1)}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        className="mt-2 w-full resize-y rounded-[14px] border-0 bg-tinta-profunda px-5 py-4 font-mono text-[16px] leading-[1.7] text-codigo"
      />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={ejecutar}
          disabled={corriendo}
          className="min-h-12 cursor-pointer rounded-full border-0 bg-violeta px-6 py-3 text-base font-medium text-white hover:bg-violeta-texto disabled:cursor-wait disabled:opacity-70"
        >
          {corriendo ? (esSql ? "Consultando…" : "Ejecutando…") : "Ejecutar y revisar"}
        </button>
        <button
          type="button"
          onClick={() => setPista(!pista)}
          aria-expanded={pista}
          className="min-h-12 cursor-pointer rounded-full border-[1.5px] border-linea bg-transparent px-5 py-3 text-base text-tinta hover:border-lila-borde"
        >
          {pista ? "Ocultar pista" : "Ver pista"}
        </button>
        <button
          type="button"
          onClick={() => {
            setCodigo(ejercicio.codigoInicial);
            setRes(null);
          }}
          className="min-h-12 cursor-pointer rounded-full border-0 bg-transparent px-3 py-3 text-[15px] text-suave hover:text-tinta"
        >
          Reiniciar código
        </button>
      </div>
      {corriendo && !esSql && (
        <p className="mt-3 text-sm text-suave">La primera vez Python tarda unos segundos en cargar.</p>
      )}
      {pista && (
        <p className="mt-4 rounded-xl bg-aviso px-4 py-3.5 text-[15px] leading-relaxed text-aviso-texto">{ejercicio.pista}</p>
      )}
      <div aria-live="polite">
        {res && (
          <div className="mt-5 flex flex-col gap-4">
            {(res.salida !== undefined || res.tabla) && (
              <div className="rounded-xl bg-noche p-4">
                <p className="m-0 mb-2 text-[13px] text-claro-2">{esSql ? "Resultado de tu consulta" : "Lo que mostró tu programa"}</p>
                {res.tabla ? (
                  <TablaResultado tabla={res.tabla} />
                ) : (
                  <pre className="m-0 font-mono text-[16px] leading-relaxed whitespace-pre-wrap text-white">
                    {res.salida || "(nada)"}
                  </pre>
                )}
              </div>
            )}
            {res.aprobado ? (
              <div className="flex items-start gap-3">
                <Estrella size={28} />
                <div>
                  <p className="m-0 text-lg font-semibold">{res.mensaje}</p>
                  {mensajeExito && <p className="mt-1.5 text-[15px] leading-relaxed text-medio">{mensajeExito}</p>}
                </div>
              </div>
            ) : (
              <p className="m-0 rounded-xl border-[1.5px] border-error px-4 py-3.5 text-[15px] leading-relaxed whitespace-pre-line text-error-texto">
                {res.mensaje}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
