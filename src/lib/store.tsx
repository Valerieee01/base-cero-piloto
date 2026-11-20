"use client";

// Estado del piloto guardado en el navegador (localStorage).
// Reemplaza a la BD del modelo de datos (§6) para que la demo funcione en Vercel sin backend.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CLASES, EVALUACIONES, SEMANAS, TOTAL_CLASES, clasesDeSemana, type Clase } from "./curso";

export type Rol = "ESTUDIANTE" | "DOCENTE" | "ADMIN";

export interface Usuario {
  nombre: string;
  email: string;
  rol: Rol;
  aceptoDatos: boolean;
  aceptoDatosEn: string;
  creadoEn: string;
}

export interface Inscripcion {
  cursoId: "basico";
  estado: "ACTIVA" | "FINALIZADA";
  origen: "PAGO" | "CUPO_SOCIAL";
  medio: string;
  precioPagado: number;
  codigoDescuento?: string;
  creadaEn: string;
}

export interface Duda {
  id: string;
  autor: string;
  autorEmail: string;
  claseId: string;
  pregunta: string;
  codigoAdjunto: string;
  respuesta?: string;
  respondidaPor?: string;
  creadaEn: string;
  respondidaEn?: string;
  ejemplo?: boolean;
}

export interface Postulacion {
  id: string;
  nombre: string;
  email: string;
  tipo: "CUPO" | "DESCUENTO";
  institucion: string;
  motivo: string;
  estado: "PENDIENTE" | "APROBADA" | "RECHAZADA";
  creadaEn: string;
  ejemplo?: boolean;
}

export interface Intento {
  ejercicioId: string;
  aprobado: boolean;
  creadoEn: string;
}

export type EventoEmbudo = "visita" | "muestra" | "registro" | "checkout" | "pago" | "clase1" | "semana1";

export interface Estado {
  version: number;
  usuario?: Usuario;
  inscripcion?: Inscripcion;
  vistas: string[];
  aprobados: string[];
  evaluaciones: number[];
  intentos: Intento[];
  codigos: Record<string, string>;
  dudas: Duda[];
  postulaciones: Postulacion[];
  certificado?: { codigo: string; emitidoEn: string };
  actividad: string[];
  embudo: Record<EventoEmbudo, number>;
}

const CLAVE = "base-cero-piloto";
const VERSION = 1;

const hace = (horas: number) => new Date(Date.now() - horas * 3600_000).toISOString();

function estadoInicial(): Estado {
  return {
    version: VERSION,
    vistas: [],
    aprobados: [],
    evaluaciones: [],
    intentos: [],
    codigos: {},
    dudas: [
      {
        id: "d-ej-1",
        autor: "Camilo R.",
        autorEmail: "camilo@ejemplo.co",
        claseId: "s2-c1",
        pregunta: '¿Por qué mi if no entra cuando escribo "Si"?',
        codigoAdjunto: 'respuesta = "Si"\nif respuesta == "si":\n    print("Entró")',
        creadaEn: hace(30),
        respuesta: 'Python distingue mayúsculas: "Si" y "si" son textos distintos. Compara con "Si" o usa respuesta.lower() == "si".',
        respondidaPor: "Profe Juan",
        respondidaEn: hace(26),
        ejemplo: true,
      },
      {
        id: "d-ej-2",
        autor: "Valentina G.",
        autorEmail: "valentina@ejemplo.co",
        claseId: "s2-c3",
        pregunta: "Mi ciclo no se detiene nunca y el navegador se pone lento. ¿Qué hice mal?",
        codigoAdjunto: "numero = 1\nwhile numero <= 5:\n    print(numero)",
        creadaEn: hace(5),
        ejemplo: true,
      },
      {
        id: "d-ej-3",
        autor: "Laura P.",
        autorEmail: "laura@ejemplo.co",
        claseId: "s3-c3",
        pregunta: "¿Por qué Bucaramanga va con comillas simples y no dobles?",
        codigoAdjunto: 'SELECT nombre FROM estudiantes WHERE ciudad = "Bucaramanga";',
        creadaEn: hace(2),
        ejemplo: true,
      },
    ],
    postulaciones: [
      {
        id: "p-ej-1",
        nombre: "Juliana M.",
        email: "juliana@ejemplo.co",
        tipo: "DESCUENTO",
        institucion: "Universidad Industrial de Santander",
        motivo: "Estudiante de primer semestre de Licenciatura.",
        estado: "PENDIENTE",
        creadaEn: hace(20),
        ejemplo: true,
      },
      {
        id: "p-ej-2",
        nombre: "Andrés T.",
        email: "andres@ejemplo.co",
        tipo: "CUPO",
        institucion: "Colegio Santander (público)",
        motivo: "Busco empleo y quiero aprender a programar.",
        estado: "APROBADA",
        creadaEn: hace(70),
        ejemplo: true,
      },
    ],
    actividad: [],
    embudo: { visita: 0, muestra: 0, registro: 0, checkout: 0, pago: 0, clase1: 0, semana1: 0 },
  };
}

function hoy() {
  return new Date().toISOString().slice(0, 10);
}

function id() {
  return Math.random().toString(36).slice(2, 10);
}

// ─────────── Cálculos derivados ───────────

export interface Progreso {
  vistas: number;
  evaluaciones: number;
  porcentaje: number;
  semanaActual: number;
  siguiente?: Clase;
  evaluacionAbierta: (semana: number) => boolean;
  semanaCompleta: (semana: number) => boolean;
  certificadoHabilitado: boolean;
  racha: number;
}

export function calcularProgreso(e: Estado): Progreso {
  const vistas = e.vistas.length;
  const evaluaciones = e.evaluaciones.length;
  const porcentaje = Math.round(((vistas + evaluaciones) / (TOTAL_CLASES + EVALUACIONES.length)) * 100);
  const evaluacionAbierta = (s: number) => clasesDeSemana(s).every((c) => e.vistas.includes(c.id));
  const semanaCompleta = (s: number) => e.evaluaciones.includes(s);
  const semanaActual = SEMANAS.find((s) => !semanaCompleta(s.numero))?.numero ?? 4;
  const siguiente = CLASES.find((c) => !e.vistas.includes(c.id) || !e.aprobados.includes(c.ejercicio.id));
  const certificadoHabilitado = EVALUACIONES.every((ev) => e.evaluaciones.includes(ev.semana));

  // Racha: días seguidos con actividad, contando hacia atrás desde hoy.
  const dias = new Set(e.actividad);
  let racha = 0;
  const d = new Date();
  while (dias.has(d.toISOString().slice(0, 10))) {
    racha++;
    d.setDate(d.getDate() - 1);
  }
  return {
    vistas,
    evaluaciones,
    porcentaje,
    semanaActual,
    siguiente,
    evaluacionAbierta,
    semanaCompleta,
    certificadoHabilitado,
    racha,
  };
}

// ─────────── Contexto ───────────

interface Acciones {
  registrar: (u: { nombre: string; email: string; aceptoDatos: boolean }) => void;
  salir: () => void;
  inscribir: (i: Omit<Inscripcion, "cursoId" | "estado" | "creadaEn">) => void;
  marcarVista: (claseId: string) => void;
  registrarIntento: (ejercicioId: string, aprobado: boolean, codigo: string) => void;
  aprobarEvaluacion: (semana: number) => void;
  enviarDuda: (claseId: string, pregunta: string, codigo: string) => void;
  responderDuda: (dudaId: string, respuesta: string) => void;
  postular: (p: Omit<Postulacion, "id" | "estado" | "creadaEn">) => void;
  decidirPostulacion: (pid: string, estado: "APROBADA" | "RECHAZADA") => void;
  emitirCertificado: () => void;
  evento: (e: EventoEmbudo) => void;
  // Atajos de la demo
  demoCuentaLista: () => void;
  demoCompletarSemana: () => void;
  demoCompletarTodo: () => void;
  reiniciar: () => void;
}

interface Ctx extends Acciones {
  estado: Estado;
  listo: boolean;
  progreso: Progreso;
}

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [estado, setEstado] = useState<Estado>(estadoInicial);
  const [listo, setListo] = useState(false);
  const cargado = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CLAVE);
      if (raw) {
        const e = JSON.parse(raw) as Estado;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratar desde localStorage
        if (e.version === VERSION) setEstado({ ...estadoInicial(), ...e });
      }
    } catch {
      /* sin almacenamiento: la demo funciona igual en memoria */
    }
    cargado.current = true;
    setListo(true);
  }, []);

  useEffect(() => {
    if (!cargado.current) return;
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch {
      /* ignorar */
    }
  }, [estado]);

  const actualizar = useCallback((fn: (e: Estado) => Estado) => setEstado((prev) => fn(prev)), []);

  const conActividad = (e: Estado): Estado =>
    e.actividad.includes(hoy()) ? e : { ...e, actividad: [...e.actividad, hoy()] };

  const sumar = (e: Estado, ev: EventoEmbudo): Estado => ({ ...e, embudo: { ...e.embudo, [ev]: e.embudo[ev] + 1 } });

  const acciones: Acciones = useMemo(
    () => ({
      registrar: ({ nombre, email, aceptoDatos }) =>
        actualizar((e) =>
          sumar(
            {
              ...e,
              usuario: {
                nombre,
                email,
                rol: "ESTUDIANTE",
                aceptoDatos,
                aceptoDatosEn: new Date().toISOString(),
                creadoEn: new Date().toISOString(),
              },
            },
            "registro",
          ),
        ),
      salir: () => actualizar((e) => ({ ...e, usuario: undefined })),
      inscribir: (i) =>
        actualizar((e) =>
          sumar(
            {
              ...e,
              inscripcion: { ...i, cursoId: "basico", estado: "ACTIVA", creadaEn: new Date().toISOString() },
            },
            "pago",
          ),
        ),
      marcarVista: (claseId) =>
        actualizar((e) => {
          if (e.vistas.includes(claseId)) return e;
          let n = conActividad({ ...e, vistas: [...e.vistas, claseId] });
          if (claseId === "s1-c1") n = sumar(n, "clase1");
          return n;
        }),
      registrarIntento: (ejercicioId, aprobado, codigo) =>
        actualizar((e) =>
          conActividad({
            ...e,
            intentos: [...e.intentos, { ejercicioId, aprobado, creadoEn: new Date().toISOString() }].slice(-200),
            codigos: { ...e.codigos, [ejercicioId]: codigo },
            aprobados: aprobado && !e.aprobados.includes(ejercicioId) ? [...e.aprobados, ejercicioId] : e.aprobados,
          }),
        ),
      aprobarEvaluacion: (semana) =>
        actualizar((e) => {
          if (e.evaluaciones.includes(semana)) return e;
          let n = conActividad({ ...e, evaluaciones: [...e.evaluaciones, semana].sort() });
          if (semana === 1) n = sumar(n, "semana1");
          return n;
        }),
      enviarDuda: (claseId, pregunta, codigo) =>
        actualizar((e) => ({
          ...e,
          dudas: [
            {
              id: id(),
              autor: e.usuario?.nombre ?? "Visitante",
              autorEmail: e.usuario?.email ?? "",
              claseId,
              pregunta,
              codigoAdjunto: codigo,
              creadaEn: new Date().toISOString(),
            },
            ...e.dudas,
          ],
        })),
      responderDuda: (dudaId, respuesta) =>
        actualizar((e) => ({
          ...e,
          dudas: e.dudas.map((d) =>
            d.id === dudaId
              ? { ...d, respuesta, respondidaPor: "Profe Juan", respondidaEn: new Date().toISOString() }
              : d,
          ),
        })),
      postular: (p) =>
        actualizar((e) => ({
          ...e,
          postulaciones: [{ ...p, id: id(), estado: "PENDIENTE", creadaEn: new Date().toISOString() }, ...e.postulaciones],
        })),
      decidirPostulacion: (pid, est) =>
        actualizar((e) => ({
          ...e,
          postulaciones: e.postulaciones.map((p) => (p.id === pid ? { ...p, estado: est } : p)),
        })),
      emitirCertificado: () =>
        actualizar((e) =>
          e.certificado
            ? e
            : {
                ...e,
                certificado: {
                  codigo: "BC-2026-" + Math.random().toString(36).slice(2, 7).toUpperCase(),
                  emitidoEn: new Date().toISOString(),
                },
              },
        ),
      evento: (ev) => actualizar((e) => sumar(e, ev)),
      demoCuentaLista: () =>
        actualizar((e) => ({
          ...e,
          usuario: e.usuario ?? {
            nombre: "Andrea",
            email: "andrea@ejemplo.co",
            rol: "ESTUDIANTE",
            aceptoDatos: true,
            aceptoDatosEn: new Date().toISOString(),
            creadoEn: new Date().toISOString(),
          },
          inscripcion: e.inscripcion ?? {
            cursoId: "basico",
            estado: "ACTIVA",
            origen: "PAGO",
            medio: "pse",
            precioPagado: 24900,
            creadaEn: new Date().toISOString(),
          },
        })),
      demoCompletarSemana: () =>
        actualizar((e) => {
          const p = calcularProgreso(e);
          const s = p.semanaActual;
          const clases = clasesDeSemana(s);
          const ev = EVALUACIONES.find((x) => x.semana === s)!;
          return conActividad({
            ...e,
            vistas: Array.from(new Set([...e.vistas, ...clases.map((c) => c.id)])),
            aprobados: Array.from(new Set([...e.aprobados, ...clases.map((c) => c.ejercicio.id), ev.ejercicio.id])),
            evaluaciones: Array.from(new Set([...e.evaluaciones, s])).sort(),
          });
        }),
      demoCompletarTodo: () =>
        actualizar((e) =>
          conActividad({
            ...e,
            vistas: CLASES.map((c) => c.id),
            aprobados: [...CLASES.map((c) => c.ejercicio.id), ...EVALUACIONES.map((x) => x.ejercicio.id)],
            evaluaciones: EVALUACIONES.map((x) => x.semana),
          }),
        ),
      reiniciar: () => {
        try {
          localStorage.removeItem(CLAVE);
        } catch {
          /* ignorar */
        }
        setEstado(estadoInicial());
      },
    }),
    [actualizar],
  );

  const progreso = useMemo(() => calcularProgreso(estado), [estado]);

  const valor = useMemo<Ctx>(() => ({ estado, listo, progreso, ...acciones }), [estado, listo, progreso, acciones]);

  return <StoreCtx.Provider value={valor}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore debe usarse dentro de StoreProvider");
  return c;
}

export function fechaCorta(iso: string) {
  const d = new Date(iso);
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${d.getDate()} ${meses[d.getMonth()]}, ${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

export function horasDesde(iso: string) {
  return (Date.now() - new Date(iso).getTime()) / 3600_000;
}

/** Fecha de fin del curso (4 semanas desde la inscripción) en texto: "18 de diciembre". */
export function fechaFinCurso(inicioIso?: string) {
  const fin = inicioIso ? new Date(inicioIso) : new Date();
  fin.setDate(fin.getDate() + 28);
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  return `${fin.getDate()} de ${meses[fin.getMonth()]}`;
}

export function fechaLarga(iso?: string) {
  return (iso ? new Date(iso) : new Date()).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
}

export function haceCuanto(iso: string) {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return "hace un momento";
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.round(h / 24)} d`;
}
