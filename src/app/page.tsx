import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HeroCodigo } from "@/components/landing/HeroCodigo";
import { Faq } from "@/components/landing/Faq";
import { Evento } from "@/components/Evento";
import { NIVELES, SEMANAS, clasesDeSemana, formatoPesos } from "@/lib/curso";

const DIFICULTADES = [
  {
    titulo: "Explicaciones difíciles de entender",
    valor: 28.8,
    texto: "Explicamos con palabras de todos los días y ejemplos pequeños. Cada término nuevo se define la primera vez que aparece.",
  },
  {
    titulo: "Falta de tiempo",
    valor: 25,
    texto: "Clases grabadas de 20 a 25 minutos. Las ves cuando puedas, las repites las veces que quieras y las descargas para verlas sin internet.",
  },
  {
    titulo: "Falta de práctica",
    valor: 21.2,
    texto: "Cada clase termina con un ejercicio que se revisa solo, en el navegador. Si no te sale, ves una pista o le preguntas al profe.",
  },
];

const h2 = "m-0 text-[clamp(30px,3.6vw,44px)] leading-[1.1] font-bold tracking-[-0.025em]";

export default function Landing() {
  return (
    <div className="min-h-screen bg-papel text-tinta">
      <Evento nombre="visita" />
      <SiteHeader />

      {/* Hero */}
      <section id="inicio" className="cuaderno border-b border-linea">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-14 px-4 pt-12 pb-20 sm:px-6 sm:pt-[72px] sm:pb-24">
          <div className="min-w-0 flex-1 basis-[440px]">
            <h1 className="m-0 text-[clamp(40px,6vw,76px)] leading-[1.02] font-bold tracking-[-0.035em]">
              Empieza desde cero. Aprende sin límites.
            </h1>
            <p className="mt-7 max-w-[34em] text-[19px] leading-relaxed font-light text-medio">
              Cursos cortos de programación y bases de datos para quienes nunca han escrito una línea de código. Clases grabadas de
              20 minutos, ejercicios para practicar y alguien que te responde cuando te trabas.
            </p>
            <div className="mt-9 flex flex-wrap gap-3.5">
              <Link
                href="/clase-gratis"
                className="rounded-full bg-violeta px-7 py-4 text-[17px] font-medium text-white no-underline hover:bg-violeta-texto"
              >
                Tomar la clase gratis
              </Link>
              <Link
                href="/#niveles"
                className="rounded-full border-[1.5px] border-tinta bg-white px-7 py-4 text-[17px] font-medium text-tinta no-underline"
              >
                Ver niveles y precios
              </Link>
            </div>
            <p className="mt-5 text-[15px] text-suave">No necesitas saberlo todo para comenzar. La clase de muestra no pide registro.</p>
          </div>
          <HeroCodigo />
        </div>
      </section>

      {/* Problema + prueba social */}
      <section className="mx-auto max-w-[1180px] px-4 py-20 sm:px-6 sm:py-24">
        <h2 className={`${h2} max-w-[18em]`}>Preguntamos a estudiantes qué les frena al aprender a programar.</h2>
        <p className="mt-4 max-w-[40em] text-[17px] font-light text-suave">
          Las tres respuestas más comunes en nuestra encuesta, y lo que hacemos con cada una.
        </p>
        <div className="mt-12 flex flex-col gap-9">
          {DIFICULTADES.map((d) => (
            <div key={d.titulo} className="flex flex-wrap items-center gap-x-12 gap-y-5">
              <div className="min-w-0 flex-1 basis-[380px]">
                <div className="flex justify-between gap-3 text-[17px] font-medium">
                  <span>{d.titulo}</span>
                  <span>{d.valor.toString().replace(".", ",")} %</span>
                </div>
                <div className="mt-2.5 h-3.5 rounded-full bg-linea" role="img" aria-label={`${d.valor} por ciento`}>
                  <div className="h-3.5 rounded-full bg-violeta" style={{ width: `${d.valor}%` }} />
                </div>
              </div>
              <p className="m-0 flex-1 basis-[380px] text-base leading-relaxed text-medio">{d.texto}</p>
            </div>
          ))}
        </div>
        <p className="mt-9 text-sm text-suave">
          Fuente: encuesta de mercado Base Cero, 2026. Porcentaje de personas que eligieron cada dificultad.
        </p>
      </section>

      {/* Cómo funciona */}
      <section id="como" className="border-y border-linea bg-white">
        <div className="mx-auto max-w-[1180px] px-4 py-20 sm:px-6 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className={`${h2} max-w-[14em]`}>Cuatro semanas, tres clases por semana.</h2>
            <p className="m-0 max-w-[26em] text-[17px] font-light text-suave">
              Así se ve el curso Básico. Cada semana cierra con una evaluación corta; al aprobar las cuatro descargas tu certificado.
            </p>
          </div>
          <ol className="mt-14 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5 p-0">
            {SEMANAS.map((s) => {
              const ultima = s.numero === 4;
              return (
                <li
                  key={s.numero}
                  className={`rounded-2xl border-[1.5px] border-tinta p-6 ${ultima ? "bg-tinta text-white" : "bg-papel"}`}
                >
                  <p className={`m-0 text-[15px] font-medium ${ultima ? "text-estrella" : "text-violeta-texto"}`}>Semana {s.numero}</p>
                  <h3 className="mt-2 mb-4 text-[21px] font-semibold">{s.titulo}</h3>
                  {ultima ? (
                    <p className="m-0 text-[15px] leading-[1.8] text-claro">
                      Juntas código y datos en un programa pequeño que tú mismo construyes.
                    </p>
                  ) : (
                    <ul className="m-0 list-none p-0 text-[15px] leading-[1.8] text-medio">
                      {clasesDeSemana(s.numero).map((c) => (
                        <li key={c.id}>{c.titulo}</li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Niveles y precios (P2) */}
      <section id="niveles" className="mx-auto max-w-[1180px] px-4 py-20 sm:px-6 sm:py-24">
        <h2 className={h2}>Niveles y precios</h2>
        <p className="mt-4 max-w-[40em] text-[17px] font-light text-suave">
          Empiezas por el Básico. Los siguientes niveles se abren uno cada mes.
        </p>
        <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(290px,100%),1fr))] items-stretch gap-6">
          {NIVELES.map((n) => (
            <div
              key={n.id}
              className={`flex flex-col gap-5 rounded-[20px] bg-white p-7 sm:p-8 ${
                n.disponible ? "border-2 border-violeta" : "border-[1.5px] border-linea"
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="m-0 text-[26px] font-bold">{n.nombre}</h3>
                  {!n.disponible && (
                    <span className="rounded-full bg-lila px-3 py-1 text-[13px] font-medium text-violeta-texto">Próximamente</span>
                  )}
                </div>
                <p className="mt-1.5 text-[15px] text-suave">{n.para}</p>
              </div>
              <p className="m-0">
                <span className="text-[44px] font-bold tracking-[-0.03em]">{formatoPesos(n.precio)}</span>
                <span className="text-[15px] text-suave"> COP por el curso</span>
              </p>
              <p className="m-0 text-[15px] leading-relaxed text-medio">{n.descripcion}</p>
              <ul className="m-0 list-disc pl-5 text-[15px] leading-[1.9]">
                {n.incluye.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              {n.disponible ? (
                <Link
                  href="/app/checkout"
                  className="mt-auto rounded-full bg-violeta px-6 py-4 text-center text-base font-medium text-white no-underline hover:bg-violeta-texto"
                >
                  Inscribirme al Básico
                </Link>
              ) : (
                <p className="mt-auto mb-0 rounded-full bg-papel px-6 py-4 text-center text-base text-suave">{n.abre}</p>
              )}
            </div>
          ))}
        </div>
        <p className="mt-7 text-sm text-suave">
          Pago único por curso con PSE, tarjeta o Nequi. Antes de pagar ves la duración, el contenido y la{" "}
          <Link href="/legal/devoluciones" className="text-violeta-texto">
            política de devoluciones
          </Link>
          .
        </p>
      </section>

      {/* Compromiso social */}
      <section id="social" className="bg-tinta text-white">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-start gap-12 px-4 py-20 sm:px-6 sm:py-24">
          <div className="min-w-0 flex-1 basis-[360px]">
            <h2 className={h2}>Aprender a programar no debería depender de cuánto tienes.</h2>
            <p className="mt-5 text-[17px] leading-relaxed font-light text-claro">
              Si estudias en una institución pública o estás buscando empleo, hay un lugar para ti en Base Cero.
            </p>
            <Link
              href="/compromiso-social#postular"
              className="mt-8 inline-block rounded-full bg-estrella px-7 py-4 text-[17px] font-medium text-tinta-profunda no-underline"
            >
              Postularme a un cupo
            </Link>
          </div>
          <div className="flex min-w-0 flex-1 basis-[460px] flex-col">
            {[
              ["2", "Cupos gratis cada mes", "Del curso Básico, por convocatoria en Instagram y Facebook."],
              ["30 %", "Descuento solidario", "En el Básico, para estudiantes de colegios y universidades públicas con constancia de estudio."],
              ["2 h", "Talleres gratis", "Introducción a la programación en colegios públicos y bibliotecas de Bucaramanga, cada tres meses."],
            ].map(([n, t, d], i) => (
              <div key={t} className={`flex flex-wrap items-baseline gap-6 py-6 ${i < 2 ? "border-b border-[#4A2F73]" : ""}`}>
                <p className="m-0 w-[120px] flex-none text-[40px] font-bold text-estrella">{n}</p>
                <div className="flex-1 basis-[240px]">
                  <h3 className="m-0 text-[19px] font-semibold">{t}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-claro">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-[860px] px-4 py-20 sm:px-6 sm:py-24">
        <h2 className={h2}>Preguntas frecuentes</h2>
        <Faq />
      </section>

      <SiteFooter />
    </div>
  );
}
