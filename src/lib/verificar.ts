"use client";

import type { Ejercicio } from "./curso";
import { ejecutarPython, explicarErrorPython } from "./python";
import { compararSql, ejecutarSql, type Tabla } from "./sql";

export interface Verificacion {
  aprobado: boolean;
  mensaje: string;
  salida?: string;
  tabla?: Tabla;
}

const normalizar = (s: string) =>
  s
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n")
    .trim();

function sinComentarios(codigo: string, tipo: Ejercicio["tipo"]) {
  return tipo === "PYTHON" ? codigo.replace(/#.*$/gm, "") : codigo.replace(/--.*$/gm, "");
}

export async function verificar(ej: Ejercicio, codigo: string): Promise<Verificacion> {
  if (ej.tipo === "SQL") {
    const r = await ejecutarSql(codigo);
    if (!r.ok || !r.tabla) return { aprobado: false, mensaje: r.error ?? "No se pudo ejecutar la consulta." };
    const fallo = await compararSql(r.tabla, ej.solucionSql!);
    return fallo
      ? { aprobado: false, mensaje: fallo, tabla: r.tabla }
      : { aprobado: true, mensaje: "Correcto: tu consulta trae exactamente los datos pedidos.", tabla: r.tabla };
  }

  const limpio = sinComentarios(codigo, "PYTHON");
  if (!limpio.trim()) return { aprobado: false, mensaje: "Todavía no escribiste código. Escribe tu solución y vuelve a ejecutar." };

  const r = await ejecutarPython(codigo);
  if (!r.ok) {
    return {
      aprobado: false,
      salida: r.salida,
      mensaje: r.timeout ? r.error! : explicarErrorPython(r.error ?? ""),
    };
  }
  for (const regla of ej.debeUsar ?? []) {
    if (!new RegExp(regla.patron).test(limpio)) return { aprobado: false, salida: r.salida, mensaje: regla.mensaje };
  }
  const esperada = normalizar(ej.pruebas?.[0]?.salidaEsperada ?? "");
  const obtenida = normalizar(r.salida);
  if (obtenida === esperada) return { aprobado: true, salida: r.salida, mensaje: "Correcto: tu programa hace lo que se pedía." };
  if (!obtenida)
    return { aprobado: false, salida: r.salida, mensaje: "Tu programa corrió, pero no mostró nada en pantalla. Falta un print." };
  if (obtenida.toLowerCase() === esperada.toLowerCase())
    return {
      aprobado: false,
      salida: r.salida,
      mensaje: "¡Casi! Revisa las mayúsculas y minúsculas: Python las distingue.",
    };
  return {
    aprobado: false,
    salida: r.salida,
    mensaje: `Tu programa mostró algo distinto a lo esperado. Se esperaba:\n${esperada}`,
  };
}
