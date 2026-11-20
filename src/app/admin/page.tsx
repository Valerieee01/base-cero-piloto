"use client";

import { StaffHeader } from "@/components/StaffHeader";
import { formatoPesos } from "@/lib/curso";
import { fechaCorta, useStore, type EventoEmbudo } from "@/lib/store";

// Inscritos de ejemplo para mostrar cómo se vería el panel con datos.
const EJEMPLO = [
  { nombre: "Camilo R.", origen: "PAGO", medio: "PSE", precio: 24900, codigo: "" },
  { nombre: "Valentina G.", origen: "PAGO", medio: "Nequi", precio: 17430, codigo: "SOLIDARIO30" },
  { nombre: "Laura P.", origen: "PAGO", medio: "Tarjeta", precio: 24900, codigo: "" },
  { nombre: "Andrés T.", origen: "CUPO_SOCIAL", medio: "—", precio: 0, codigo: "" },
];

const PASOS: { clave: EventoEmbudo; label: string }[] = [
  { clave: "visita", label: "Visitó la landing" },
  { clave: "muestra", label: "Abrió la clase de muestra" },
  { clave: "registro", label: "Se registró" },
  { clave: "checkout", label: "Inició el checkout" },
  { clave: "pago", label: "“Pagó”" },
  { clave: "clase1", label: "Completó la clase 1" },
  { clave: "semana1", label: "Completó la semana 1" },
];

export default function Admin() {
  const { estado, listo, decidirPostulacion } = useStore();
  const propia = estado.inscripcion && estado.usuario
    ? [{
        nombre: estado.usuario.nombre,
        origen: estado.inscripcion.origen,
        medio: estado.inscripcion.medio.toUpperCase(),
        precio: estado.inscripcion.precioPagado,
        codigo: estado.inscripcion.codigoDescuento ?? "",
        tuya: true,
      }]
    : [];
  const filas = [...propia, ...EJEMPLO.map((e) => ({ ...e, tuya: false }))];
  const ventas = filas.reduce((s, f) => s + f.precio, 0);
  const cupos = filas.filter((f) => f.origen === "CUPO_SOCIAL").length;
  const descuentos = filas.filter((f) => f.codigo).length;
  const max = Math.max(1, ...PASOS.map((p) => estado.embudo[p.clave]));

  return (
    <div className="min-h-screen bg-papel">
      <StaffHeader rol="Admin" />
      <main className="mx-auto max-w-[1180px] px-4 pt-10 pb-24 sm:px-6">
        <h1 className="m-0 text-[clamp(30px,4vw,44px)] font-bold tracking-[-0.03em]">Panel del gerente</h1>
        <p className="mt-2.5 text-[17px] font-light text-suave">
          Inscritos, ventas simuladas y cupos sociales. Las filas marcadas “ejemplo” son datos de demostración.
        </p>

        <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          {[
            ["Inscritos", String(filas.length), "meta del mes 1: 20"],
            ["Ventas simuladas", formatoPesos(ventas), "COP, sin comisión de pasarela"],
            ["Cupos sociales", `${cupos} de 2`, "este mes"],
            ["Con descuento solidario", String(descuentos), "código SOLIDARIO30"],
          ].map(([t, v, d]) => (
            <div key={t} className="rounded-[20px] border-[1.5px] border-linea bg-white p-5">
              <p className="m-0 text-sm text-suave">{t}</p>
              <p className="mt-1 text-[32px] font-bold tracking-tight">{v}</p>
              <p className="m-0 text-[13px] text-suave">{d}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-start gap-8">
          <section aria-labelledby="ins-h" className="min-w-0 flex-[999_1_560px]">
            <h2 id="ins-h" className="m-0 text-2xl font-bold">
              Inscripciones
            </h2>
            <div className="mt-4 overflow-x-auto rounded-[20px] border-[1.5px] border-linea bg-white">
              <table className="w-full min-w-[520px] border-collapse text-left text-[15px]">
                <thead>
                  <tr className="bg-lila text-sm text-medio">
                    <th className="px-4 py-3 font-medium">Estudiante</th>
                    <th className="px-4 py-3 font-medium">Origen</th>
                    <th className="px-4 py-3 font-medium">Medio</th>
                    <th className="px-4 py-3 font-medium">Código</th>
                    <th className="px-4 py-3 text-right font-medium">Pagó</th>
                  </tr>
                </thead>
                <tbody>
                  {filas.map((f) => (
                    <tr key={f.nombre} className="border-t border-linea">
                      <td className="px-4 py-3">
                        {f.nombre}{" "}
                        <span className={`ml-1 rounded-full px-2 py-0.5 text-[12px] ${f.tuya ? "bg-estrella/30 text-aviso-texto" : "bg-lila text-violeta-texto"}`}>
                          {f.tuya ? "tu cuenta" : "ejemplo"}
                        </span>
                      </td>
                      <td className="px-4 py-3">{f.origen === "PAGO" ? "Pago" : "Cupo social"}</td>
                      <td className="px-4 py-3">{f.medio}</td>
                      <td className="px-4 py-3 font-mono text-sm">{f.codigo || "—"}</td>
                      <td className="px-4 py-3 text-right">{formatoPesos(f.precio)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="mt-10 text-2xl font-bold">Postulaciones sociales</h2>
            <ul className="mt-4 flex list-none flex-col gap-3 p-0">
              {listo && estado.postulaciones.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border-[1.5px] border-linea bg-white p-4 sm:p-5">
                  <div className="min-w-0 flex-[1_1_260px]">
                    <p className="m-0 font-medium">
                      {p.nombre}
                      {p.ejemplo && <span className="ml-2 rounded-full bg-lila px-2 py-0.5 text-[12px] text-violeta-texto">ejemplo</span>}
                    </p>
                    <p className="mt-1 text-sm text-suave">
                      {p.tipo === "CUPO" ? "Cupo gratis" : "Descuento 30 %"} · {p.institucion} · {fechaCorta(p.creadaEn)}
                    </p>
                    {p.motivo && <p className="mt-1.5 text-sm text-medio">{p.motivo}</p>}
                  </div>
                  {p.estado === "PENDIENTE" ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => decidirPostulacion(p.id, "APROBADA")}
                        className="min-h-11 cursor-pointer rounded-full border-0 bg-violeta px-4 py-2 text-sm font-medium text-white"
                      >
                        Aprobar
                      </button>
                      <button
                        type="button"
                        onClick={() => decidirPostulacion(p.id, "RECHAZADA")}
                        className="min-h-11 cursor-pointer rounded-full border-[1.5px] border-linea bg-white px-4 py-2 text-sm text-tinta"
                      >
                        Rechazar
                      </button>
                    </div>
                  ) : (
                    <span className={`text-sm font-medium ${p.estado === "APROBADA" ? "text-exito" : "text-error-texto"}`}>
                      {p.estado === "APROBADA" ? "Aprobada" : "Rechazada"}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="emb-h" className="min-w-0 flex-[1_1_320px] rounded-[20px] border-[1.5px] border-linea bg-white p-6">
            <h2 id="emb-h" className="m-0 text-xl font-bold">
              Embudo del piloto
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-suave">
              Conteo de este navegador. En producción se mediría con una herramienta de analítica.
            </p>
            <ol className="mt-5 mb-0 flex list-none flex-col gap-3.5 p-0">
              {PASOS.map((p) => {
                const n = estado.embudo[p.clave];
                return (
                  <li key={p.clave}>
                    <div className="flex justify-between gap-3 text-[15px]">
                      <span>{p.label}</span>
                      <span className="font-semibold">{n}</span>
                    </div>
                    <div className="mt-1.5 h-2.5 rounded-full bg-lila">
                      <div className="h-2.5 rounded-full bg-violeta" style={{ width: `${(n / max) * 100}%` }} />
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
      </main>
    </div>
  );
}
