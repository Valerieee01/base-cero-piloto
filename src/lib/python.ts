"use client";

// Ejecuta Python en el navegador con Pyodide dentro de un Web Worker.
// El worker permite cortar programas con ciclos infinitos (timeout).

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.27.2/full/";
const TIEMPO_MAX_MS = 5000;

const CODIGO_WORKER = `
importScripts("${PYODIDE_URL}pyodide.js");
let py = null;
loadPyodide({ indexURL: "${PYODIDE_URL}" }).then((p) => { py = p; self.postMessage({ tipo: "listo" }); })
  .catch((e) => self.postMessage({ tipo: "error-carga", error: String(e) }));
self.onmessage = async (ev) => {
  const { id, codigo } = ev.data;
  const salida = [];
  py.setStdout({ batched: (s) => salida.push(s) });
  py.setStderr({ batched: (s) => salida.push(s) });
  const globales = py.globals.get("dict")();
  try {
    await py.runPythonAsync(codigo, { globals: globales });
    self.postMessage({ tipo: "resultado", id, ok: true, salida: salida.join("\\n") });
  } catch (err) {
    self.postMessage({ tipo: "resultado", id, ok: false, salida: salida.join("\\n"), error: String(err && err.message || err) });
  } finally {
    globales.destroy();
  }
};
`;

export interface ResultadoPython {
  ok: boolean;
  salida: string;
  error?: string;
  timeout?: boolean;
}


let listo: Promise<Worker> | null = null;

function obtenerWorker(): Promise<Worker> {
  if (listo) return listo;
  listo = new Promise((resolve, reject) => {
    const blob = new Blob([CODIGO_WORKER], { type: "application/javascript" });
    const w = new Worker(URL.createObjectURL(blob));
    const alListo = (ev: MessageEvent) => {
      if (ev.data?.tipo === "listo") {
        w.removeEventListener("message", alListo);

        resolve(w);
      } else if (ev.data?.tipo === "error-carga") {
        listo = null;
        reject(new Error("No se pudo cargar Python. Revisa tu conexión a internet."));
      }
    };
    w.addEventListener("message", alListo);
  });
  return listo;
}

/** Carga Python en segundo plano (llamar al montar el editor). */
export function precargarPython() {
  obtenerWorker().catch(() => {});
}

let contador = 0;

export async function ejecutarPython(codigo: string): Promise<ResultadoPython> {
  const w = await obtenerWorker();
  const id = ++contador;
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      w.removeEventListener("message", alMensaje);
      w.terminate();

      listo = null;
      precargarPython();
      resolve({
        ok: false,
        salida: "",
        timeout: true,
        error:
          "Tu programa tardó demasiado y lo detuvimos. Casi siempre es un ciclo que nunca termina: revisa que la variable de la condición cambie en cada vuelta.",
      });
    }, TIEMPO_MAX_MS);
    function alMensaje(ev: MessageEvent) {
      if (ev.data?.tipo === "resultado" && ev.data.id === id) {
        clearTimeout(timer);
        w.removeEventListener("message", alMensaje);
        resolve({ ok: ev.data.ok, salida: ev.data.salida ?? "", error: ev.data.error });
      }
    }
    w.addEventListener("message", alMensaje);
    w.postMessage({ id, codigo });
  });
}

/** Traduce el error de Python a un mensaje amable para principiantes. */
export function explicarErrorPython(error: string): string {
  const lineas = error.trim().split("\n").filter(Boolean);
  const ultima = lineas[lineas.length - 1] ?? error;
  const lineaNum = [...error.matchAll(/line (\d+)/g)].pop()?.[1];
  const donde = lineaNum ? ` (línea ${lineaNum})` : "";
  if (ultima.startsWith("NameError")) {
    const nombre = ultima.match(/name '(.+?)'/)?.[1];
    return `Usas el nombre ${nombre ?? ""} pero Python no lo conoce${donde}. ¿Lo escribiste igual donde lo creaste? Si es texto, ponlo entre comillas.`;
  }
  if (ultima.startsWith("IndentationError"))
    return `Problema de sangría${donde}. Lo que va dentro de un if, else, while o for debe llevar 4 espacios al inicio.`;
  if (ultima.startsWith("SyntaxError"))
    return `Python no entiende cómo está escrita una línea${donde}. Revisa paréntesis, comillas y los dos puntos : al final de if, else, while y for.`;
  if (ultima.startsWith("TypeError"))
    return `Estás mezclando tipos de datos${donde}, por ejemplo sumando texto con un número. Usa str(...) o int(...) para convertir.`;
  if (ultima.startsWith("ZeroDivisionError")) return `Estás dividiendo entre cero${donde}.`;
  return ultima;
}
