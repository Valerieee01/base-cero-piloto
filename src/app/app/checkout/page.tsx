"use client";

import Link from "next/link";
import { useState } from "react";
import { Evento } from "@/components/Evento";
import { Candado, Estrella, Logo } from "@/components/Icons";
import { RequiereCuenta } from "@/components/RequiereCuenta";
import { CODIGOS_VALIDOS, DESCUENTO_SOLIDARIO, PRECIO_BASICO, formatoPesos } from "@/lib/curso";
import { useStore } from "@/lib/store";

const MEDIOS = [
  { id: "pse", label: "PSE", detalle: "Desde tu banco" },
  { id: "tarjeta", label: "Tarjeta", detalle: "Débito o crédito" },
  { id: "nequi", label: "Nequi", detalle: "Desde la app" },
];

export default function Checkout() {
  return (
    <RequiereCuenta inscripcion={false}>
      <Evento nombre="checkout" />
      <Contenido />
    </RequiereCuenta>
  );
}

function Contenido() {
  const { estado, inscribir } = useStore();
  const [medio, setMedio] = useState("pse");
  const [codigo, setCodigo] = useState("");
  const [estadoCodigo, setEstadoCodigo] = useState<null | "ok" | "mal">(null);
  const [terminos, setTerminos] = useState(false);
  const [intento, setIntento] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [pagado, setPagado] = useState(false);

  const codigoOk = estadoCodigo === "ok";
  const descuento = codigoOk ? Math.round(PRECIO_BASICO * DESCUENTO_SOLIDARIO) : 0;
  const total = PRECIO_BASICO - descuento;
  const yaInscrito = !!estado.inscripcion && !pagado;

  function pagar() {
    setIntento(true);
    if (!terminos) return;
    setProcesando(true);
    setTimeout(() => {
      inscribir({
        origen: "PAGO",
        medio,
        precioPagado: total,
        codigoDescuento: codigoOk ? codigo.trim().toUpperCase() : undefined,
      });
      setProcesando(false);
      setPagado(true);
      window.scrollTo({ top: 0 });
    }, 1600);
  }

  return (
    <div className="min-h-screen bg-papel">
      <header className="border-b border-linea bg-white">
        <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 text-tinta no-underline">
            <Logo size={30} />
            <span className="text-[19px] font-bold">Base Cero</span>
          </Link>
          <span className="flex items-center gap-2 text-sm text-suave">
            <Candado />
            Pago procesado por la pasarela; no guardamos datos de tu tarjeta
          </span>
        </div>
      </header>

      {pagado ? (
        <main className="mx-auto max-w-[640px] px-4 py-24 text-center">
          <Estrella size={64} className="mx-auto" />
          <h1 className="mt-5 text-[40px] leading-tight font-bold tracking-[-0.03em]">Tu curso Básico está activo</h1>
          <p className="mt-3.5 text-[17px] leading-relaxed text-medio">
            Pagaste {formatoPesos(total)} con {MEDIOS.find((m) => m.id === medio)?.label}. Te enviamos el comprobante al correo{" "}
            {estado.usuario?.email}. La primera clase dura 20 minutos: puedes verla ya.
          </p>
          <Link
            href="/app"
            className="mt-8 inline-block rounded-full bg-violeta px-7 py-4 text-[17px] font-medium text-white no-underline hover:bg-violeta-texto"
          >
            Ir a mi aprendizaje
          </Link>
        </main>
      ) : yaInscrito ? (
        <main className="mx-auto max-w-[640px] px-4 py-24 text-center">
          <h1 className="text-3xl font-bold">Ya estás inscrito en el curso Básico</h1>
          <Link href="/app" className="mt-6 inline-block rounded-full bg-violeta px-7 py-4 font-medium text-white no-underline">
            Ir a mi aprendizaje
          </Link>
        </main>
      ) : (
        <main className="mx-auto max-w-[1080px] px-4 pt-10 pb-24 sm:px-6">
          <p className="mb-6 rounded-xl bg-aviso px-4 py-3 text-[15px] text-aviso-texto">
            Pago de prueba: en el piloto no se cobra dinero real.
          </p>
          <h1 className="m-0 text-[clamp(30px,3.6vw,42px)] font-bold tracking-[-0.03em]">Inscripción al curso Básico</h1>

          <div className="mt-8 flex flex-wrap items-start gap-8">
            <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-6">
              <fieldset className="m-0 rounded-[20px] border-[1.5px] border-linea bg-white p-6">
                <legend className="px-2 text-lg font-semibold">Medio de pago</legend>
                <div className="mt-2 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
                  {MEDIOS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      aria-pressed={medio === m.id}
                      onClick={() => setMedio(m.id)}
                      className={`min-h-16 cursor-pointer rounded-[14px] p-4 text-left text-base font-medium text-tinta ${
                        medio === m.id ? "border-2 border-violeta bg-lila" : "border-[1.5px] border-linea bg-white"
                      }`}
                    >
                      {m.label}
                      <span className="mt-1 block text-[13px] font-normal text-suave">{m.detalle}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="rounded-[20px] border-[1.5px] border-linea bg-white p-6">
                <label htmlFor="codigo" className="block text-lg font-semibold">
                  Código de descuento
                </label>
                <p className="mt-1.5 text-sm leading-relaxed text-suave">
                  Si te aprobamos el descuento solidario, te enviamos el código por correo. Para probar el piloto usa{" "}
                  <strong className="font-semibold text-tinta">SOLIDARIO30</strong>.
                </p>
                <div className="mt-3.5 flex flex-wrap gap-2.5">
                  <input
                    id="codigo"
                    value={codigo}
                    onChange={(e) => {
                      setCodigo(e.target.value);
                      setEstadoCodigo(null);
                    }}
                    autoComplete="off"
                    className="min-h-12 flex-[1_1_200px] rounded-xl border-[1.5px] border-lila-borde px-4 py-3 text-base text-tinta uppercase"
                  />
                  <button
                    type="button"
                    onClick={() => setEstadoCodigo(CODIGOS_VALIDOS.includes(codigo.trim().toUpperCase()) ? "ok" : "mal")}
                    className="min-h-12 cursor-pointer rounded-full border-[1.5px] border-tinta bg-white px-5 py-3 text-base font-medium text-tinta"
                  >
                    Aplicar
                  </button>
                </div>
                <div aria-live="polite">
                  {codigoOk && <p className="mt-3 text-[15px] text-exito">Descuento solidario aplicado: 30 % menos.</p>}
                  {estadoCodigo === "mal" && (
                    <p className="mt-3 text-[15px] text-error-texto">
                      Ese código no existe o ya se usó. Revisa que esté escrito igual que en el correo.
                    </p>
                  )}
                </div>
              </div>

              <section aria-labelledby="dev-h" className="rounded-[20px] border-[1.5px] border-linea bg-white p-6">
                <h2 id="dev-h" className="m-0 text-lg font-semibold">
                  Antes de pagar
                </h2>
                <ul className="mt-3 mb-0 flex list-disc flex-col gap-1.5 pl-5 text-[15px] leading-relaxed text-medio">
                  <li>Curso de 4 semanas: 12 clases grabadas de 20 a 25 minutos, 4 evaluaciones y certificado.</li>
                  <li>
                    Devolución: puedes pedirla en los primeros 5 días si has visto menos de 3 clases.{" "}
                    <Link href="/legal/devoluciones" target="_blank" className="text-violeta-texto">
                      Ver política completa
                    </Link>
                  </li>
                  <li>
                    Autorizaste el tratamiento de tus datos al crear tu cuenta
                    {estado.usuario?.aceptoDatosEn ? ` (${new Date(estado.usuario.aceptoDatosEn).toLocaleDateString("es-CO")})` : ""}.
                  </li>
                </ul>
                <label className="mt-4 flex cursor-pointer items-start gap-3 text-[15px] leading-relaxed">
                  <input
                    type="checkbox"
                    checked={terminos}
                    onChange={(e) => setTerminos(e.target.checked)}
                    className="m-0 mt-0.5 h-[22px] w-[22px] flex-none accent-violeta"
                  />
                  <span>
                    Acepto los{" "}
                    <Link href="/legal/terminos" target="_blank" className="text-violeta-texto">
                      términos y condiciones
                    </Link>{" "}
                    y la{" "}
                    <Link href="/legal/devoluciones" target="_blank" className="text-violeta-texto">
                      política de devoluciones
                    </Link>
                    .
                  </span>
                </label>
              </section>
            </div>

            <aside className="min-w-0 flex-[1_1_320px] rounded-[20px] bg-tinta p-7 text-white shadow-solido">
              <h2 className="m-0 text-xl font-bold">Resumen</h2>
              <dl className="mt-5 flex flex-col gap-3 text-[15px]">
                {[
                  ["Curso", "Básico"],
                  ["Duración", "4 semanas"],
                  ["Incluye", "12 clases, ejercicios, dudas y certificado"],
                  ["Empieza", "Hoy, al pagar"],
                ].map(([t, d]) => (
                  <div key={t} className="flex justify-between gap-3">
                    <dt className="text-claro">{t}</dt>
                    <dd className="m-0 max-w-[60%] text-right">{d}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 flex flex-col gap-2 border-t border-[#4A2F73] pt-4 text-[15px]">
                <div className="flex justify-between">
                  <span className="text-claro">Precio</span>
                  <span>{formatoPesos(PRECIO_BASICO)}</span>
                </div>
                {codigoOk && (
                  <div className="flex justify-between">
                    <span className="text-claro">Descuento solidario</span>
                    <span>−{formatoPesos(descuento)}</span>
                  </div>
                )}
                <div className="mt-1.5 flex items-baseline justify-between">
                  <span className="text-[17px] font-semibold">Total</span>
                  <span className="text-[32px] font-bold tracking-tight">{formatoPesos(total)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={pagar}
                disabled={procesando}
                className="mt-6 min-h-[54px] w-full cursor-pointer rounded-full border-0 bg-estrella px-6 py-4 text-[17px] font-semibold text-tinta-profunda disabled:cursor-wait disabled:opacity-80"
              >
                {procesando ? "Procesando pago…" : `Pagar ${formatoPesos(total)}`}
              </button>
              {intento && !terminos && (
                <p role="alert" className="mt-3 text-sm text-[#FFD58A]">
                  Para continuar, acepta los términos y la política de devoluciones.
                </p>
              )}
              <p className="mt-3.5 text-center text-[13px] text-claro-2">Precios en pesos colombianos, impuestos incluidos.</p>
            </aside>
          </div>
        </main>
      )}
    </div>
  );
}
