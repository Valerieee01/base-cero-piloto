import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FormPostulacion } from "./FormPostulacion";

export const metadata = { title: "Cupos y descuentos — Base Cero" };

export default function CompromisoSocial() {
  return (
    <div className="min-h-screen bg-papel">
      <SiteHeader />
      <section className="bg-tinta text-white">
        <div className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 sm:py-20">
          <p className="m-0 text-[15px] font-medium text-estrella">Compromiso social</p>
          <h1 className="mt-3 max-w-[18em] text-[clamp(34px,4.6vw,56px)] leading-[1.05] font-bold tracking-[-0.03em]">
            Aprender a programar no debería depender de cuánto tienes.
          </h1>
          <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
            {[
              ["2 cupos gratis al mes", "Curso Básico completo, sin costo. Se asignan por convocatoria en Instagram y Facebook."],
              ["30 % de descuento solidario", "Para estudiantes de colegios y universidades públicas, con constancia de estudio."],
              ["Talleres gratis de 2 horas", "Introducción a la programación en colegios públicos y bibliotecas de Bucaramanga, cada tres meses."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-[#4A2F73] p-6">
                <h2 className="m-0 text-xl font-semibold text-estrella">{t}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-claro">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="postular" className="mx-auto flex max-w-[1180px] flex-wrap items-start gap-12 px-4 py-16 sm:px-6 sm:py-20">
        <div className="min-w-0 flex-[1_1_320px]">
          <h2 className="m-0 text-3xl font-bold tracking-tight">Postúlate</h2>
          <p className="mt-3 text-[17px] leading-relaxed text-medio">
            Cuéntanos quién eres. El equipo revisa cada postulación a mano y te responde por correo.
          </p>
          <ol className="mt-6 flex list-none flex-col gap-4 p-0 text-[15px] leading-relaxed text-medio">
            <li>
              <strong className="text-tinta">1.</strong> Llenas el formulario.
            </li>
            <li>
              <strong className="text-tinta">2.</strong> Te pedimos por correo un soporte: constancia de estudio o carta.
            </li>
            <li>
              <strong className="text-tinta">3.</strong> Si te aprobamos, te enviamos el cupo o el código de descuento.
            </li>
          </ol>
        </div>
        <div className="min-w-0 flex-[999_1_520px]">
          <FormPostulacion />
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
