"use client";

// Ejecuta SQL en el navegador con sql.js (SQLite compilado a WebAssembly).
// Los archivos están en /public/vendor para no depender de un CDN.

import { BD_SEMILLA } from "./curso";

interface SqlJsDatabase {
  exec(sql: string): { columns: string[]; values: unknown[][] }[];
  close(): void;
}
interface SqlJsStatic {
  Database: new () => SqlJsDatabase;
}

declare global {
  interface Window {
    initSqlJs?: (cfg: { locateFile: (f: string) => string }) => Promise<SqlJsStatic>;
  }
}

let motor: Promise<SqlJsStatic> | null = null;

function cargarMotor(): Promise<SqlJsStatic> {
  if (motor) return motor;
  motor = new Promise((resolve, reject) => {
    const iniciar = () =>
      window.initSqlJs!({ locateFile: (f) => `/vendor/${f}` })
        .then(resolve)
        .catch(reject);
    if (window.initSqlJs) return iniciar();
    const s = document.createElement("script");
    s.src = "/vendor/sql-wasm.js";
    s.onload = iniciar;
    s.onerror = () => {
      motor = null;
      reject(new Error("No se pudo cargar el motor SQL."));
    };
    document.head.appendChild(s);
  });
  return motor;
}

export function precargarSql() {
  cargarMotor().catch(() => {});
}

export interface Tabla {
  columnas: string[];
  filas: unknown[][];
}

export interface ResultadoSql {
  ok: boolean;
  tabla?: Tabla;
  error?: string;
}

async function consultar(sql: string): Promise<Tabla> {
  const SQL = await cargarMotor();
  const db = new SQL.Database();
  try {
    db.exec(BD_SEMILLA);
    const res = db.exec(sql);
    const ultimo = res[res.length - 1];
    return { columnas: ultimo?.columns ?? [], filas: ultimo?.values ?? [] };
  } finally {
    db.close();
  }
}

export async function ejecutarSql(sql: string): Promise<ResultadoSql> {
  try {
    const limpio = sql.replace(/--.*$/gm, "").trim();
    if (!limpio) return { ok: false, error: "Todavía no escribiste ninguna consulta." };
    return { ok: true, tabla: await consultar(sql) };
  } catch (e) {
    return { ok: false, error: explicarErrorSql(String((e as Error).message ?? e)) };
  }
}

/** Compara el resultado del estudiante con el de la consulta solución. */
export async function compararSql(tabla: Tabla, solucion: string): Promise<string | null> {
  const esperado = await consultar(solucion);
  if (tabla.columnas.length !== esperado.columnas.length)
    return `Tu consulta trae ${tabla.columnas.length} campo(s) y se esperaban ${esperado.columnas.length}. Revisa qué columnas pones después de SELECT.`;
  if (tabla.filas.length !== esperado.filas.length)
    return `Tu consulta trae ${tabla.filas.length} registro(s) y se esperaban ${esperado.filas.length}. Revisa el filtro WHERE.`;
  const ordenImporta = /order\s+by/i.test(solucion);
  const norm = (f: unknown[][]) => {
    const r = f.map((x) => JSON.stringify(x));
    return ordenImporta ? r : r.sort();
  };
  const a = norm(tabla.filas);
  const b = norm(esperado.filas);
  if (a.some((x, i) => x !== b[i]))
    return ordenImporta
      ? "Los datos son casi correctos, pero no están en el orden pedido. Revisa ORDER BY."
      : "Trae la cantidad correcta de registros, pero no son los esperados. Revisa la condición y los campos.";
  return null;
}

function explicarErrorSql(msg: string): string {
  if (/no such table/i.test(msg))
    return `La tabla no existe: ${msg.split(":").pop()?.trim()}. La tabla de este ejercicio se llama estudiantes.`;
  if (/no such column/i.test(msg))
    return `El campo ${msg.split(":").pop()?.trim()} no existe. Los campos son: id, nombre, ciudad, edad y nivel. Si es un texto, ponlo entre comillas simples.`;
  if (/syntax error/i.test(msg)) return `Hay un error de escritura en la consulta (${msg}). Revisa comas, comillas y el orden SELECT … FROM … WHERE.`;
  if (/incomplete input/i.test(msg)) return "La consulta está incompleta. ¿Te falta el FROM o cerrar una comilla?";
  return msg;
}
