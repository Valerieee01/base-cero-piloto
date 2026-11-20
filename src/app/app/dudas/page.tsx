"use client";

import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { RequiereCuenta } from "@/components/RequiereCuenta";
import { getClase } from "@/lib/curso";
import { fechaCorta, useStore } from "@/lib/store";

export default function MisDudas() {
  return (
    <RequiereCuenta>
      <AppHeader />
      <Contenido />
    </RequiereCuenta>
  );
}

function Contenido() {
  const { estado } = useStore();
  const mias = estado.dudas.filter((d) => d.autorEmail === estado.usuario?.email);
  const ejemplo = estado.dudas.find((d) => d.ejemplo && d.respuesta);

  return (
    <main className="mx-auto max-w-[880px] px-4 pt-10 pb-24 sm:px-6">
      <h1 className="m-0 text-[clamp(30px,4vw,44px)] font-bold tracking-[-0.03em]">Mis dudas</h1>
      <p className="mt-2.5 flex flex-wrap items-center gap-2 text-[17px] font-light text-suave">
        Te respondemos en máximo 24 horas. Para preguntar, usa el botón “¿Te trabaste?” en cualquier clase.
      </p>

      {mias.length === 0 && (
        <div className="mt-8 rounded-[20px] border-[1.5px] border-dashed border-lila-borde bg-white p-7">
          <p className="m-0 text-lg font-medium">Todavía no has enviado dudas.</p>
          <p className="mt-2 text-[15px] leading-relaxed text-medio">
            Cuando envíes una desde una clase, aparecerá aquí con el código que adjuntaste y, después, la respuesta del profe.
          </p>
          <Link href="/app" className="mt-4 inline-block text-violeta-texto">
            Ir a mis clases
          </Link>
        </div>
      )}

      <ul className="mt-8 flex list-none flex-col gap-4 p-0">
        {mias.map((d) => (
          <TarjetaDuda key={d.id} d={d} />
        ))}
      </ul>

      {ejemplo && mias.length === 0 && (
        <>
          <h2 className="mt-12 text-xl font-bold">Así se ve una duda respondida</h2>
          <ul className="mt-4 list-none p-0">
            <TarjetaDuda d={ejemplo} />
          </ul>
        </>
      )}
    </main>
  );
}

function TarjetaDuda({ d }: { d: ReturnType<typeof useStore>["estado"]["dudas"][number] }) {
  const clase = getClase(d.claseId);
  return (
    <li className="rounded-[20px] border-[1.5px] border-linea bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-suave">
        <Link href={`/app/clase/${d.claseId}`} className="text-violeta-texto">
          Clase {clase?.numero}: {clase?.titulo}
        </Link>
        <span>{fechaCorta(d.creadaEn)}</span>
      </div>
      <p className="mt-2 text-lg font-medium">{d.pregunta}</p>
      {d.codigoAdjunto.trim() && (
        <pre className="mt-3 overflow-x-auto rounded-xl bg-tinta-profunda px-4 py-3 font-mono text-[14px] leading-relaxed text-codigo">
          {d.codigoAdjunto}
        </pre>
      )}
      {d.respuesta ? (
        <div className="mt-4 rounded-xl bg-papel px-4 py-3.5">
          <p className="m-0 text-sm font-medium text-violeta-texto">
            {d.respondidaPor} · {d.respondidaEn && fechaCorta(d.respondidaEn)}
          </p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-medio">{d.respuesta}</p>
        </div>
      ) : (
        <p className="mt-4 rounded-xl border-[1.5px] border-dashed border-lila-borde px-4 py-3 text-[15px] text-suave">
          Esperando respuesta del profe (máximo 24 horas).
        </p>
      )}
    </li>
  );
}
