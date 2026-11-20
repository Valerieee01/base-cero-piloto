import { notFound } from "next/navigation";
import { CLASES, SEMANAS, getClase } from "@/lib/curso";
import { Logo } from "@/components/Icons";
import { BotonImprimir } from "@/components/BotonImprimir";

export function generateStaticParams() {
  return CLASES.map((c) => ({ id: c.id }));
}

export default async function Guia({ params }: PageProps<"/guia/[id]">) {
  const { id } = await params;
  const clase = getClase(id);
  if (!clase) notFound();
  const semana = SEMANAS.find((s) => s.numero === clase.semana)!;

  return (
    <main className="mx-auto max-w-[760px] bg-white px-6 py-12 text-tinta sm:px-10 print:py-8">
      <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-aviso px-4 py-3 text-[15px] text-aviso-texto">
        <span>Guía descargable. Usa “Guardar como PDF” al imprimir.</span>
        <BotonImprimir />
      </div>
      <div className="flex items-center gap-2.5">
        <Logo size={28} />
        <span className="font-bold">Base Cero · Curso Básico</span>
      </div>
      <p className="mt-8 text-[15px] font-medium text-violeta-texto">
        Semana {semana.numero}: {semana.titulo} · Clase {clase.numero}
      </p>
      <h1 className="mt-1 text-4xl font-bold tracking-tight">{clase.titulo}</h1>
      <p className="mt-2 text-lg text-suave">{clase.subtitulo}</p>

      <h2 className="mt-10 text-xl font-bold">Lo más importante</h2>
      <ul className="mt-3 flex flex-col gap-2 pl-5 text-base leading-relaxed text-medio">
        {clase.apuntes.map((a) => (
          <li key={a} className="list-disc">
            {a}
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-xl font-bold">Ejemplo de la clase</h2>
      <pre className="mt-3 rounded-xl bg-tinta-profunda p-5 font-mono text-[15px] leading-relaxed text-codigo print:border print:border-linea print:bg-white print:text-tinta">
        {clase.codigoVideo.join("\n")}
      </pre>

      <h2 className="mt-10 text-xl font-bold">Para practicar</h2>
      <p className="mt-3 text-base leading-relaxed text-medio">{clase.ejercicio.enunciado}</p>
      <p className="mt-2 text-[15px] text-suave">Pista: {clase.ejercicio.pista}</p>
    </main>
  );
}
