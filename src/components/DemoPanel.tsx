"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

/** Panel flotante para presentar el piloto: saltar entre roles y adelantar el avance. */
export function DemoPanel() {
  const [abierto, setAbierto] = useState(false);
  const { demoCuentaLista, demoCompletarSemana, demoCompletarTodo, reiniciar, progreso, estado } = useStore();
  const router = useRouter();

  const ir = [
    { href: "/", label: "Landing (visitante)" },
    { href: "/clase-gratis", label: "Clase de muestra" },
    { href: "/app", label: "Estudiante: mi aprendizaje" },
    { href: "/docente", label: "Docente: bandeja de dudas" },
    { href: "/admin", label: "Admin: inscritos y ventas" },
  ];

  const accion = (fn: () => void, destino?: string) => () => {
    fn();
    if (destino) router.push(destino);
  };

  return (
    <div className="no-print fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3">
      {abierto && (
        <div
          id="panel-demo"
          className="w-[min(320px,calc(100vw-32px))] rounded-2xl border-[1.5px] border-tinta bg-white p-4 text-tinta shadow-[6px_6px_0_#8B3FD9]"
        >
          <p className="m-0 text-[13px] font-semibold tracking-wide text-violeta-texto uppercase">Modo demo</p>
          <p className="mt-1 text-[13px] leading-snug text-suave">
            Los datos se guardan solo en este navegador. Nada se cobra.
          </p>
          <p className="mt-3 mb-1 text-[13px] font-medium text-medio">Ir a</p>
          <ul className="m-0 flex list-none flex-col p-0">
            {ir.map((e) => (
              <li key={e.href}>
                <Link
                  href={e.href}
                  onClick={() => setAbierto(false)}
                  className="block rounded-lg px-2 py-2 text-[14px] text-tinta no-underline hover:bg-lila"
                >
                  {e.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 mb-1 text-[13px] font-medium text-medio">Atajos</p>
          <div className="flex flex-col gap-1.5">
            {!estado.inscripcion && (
              <BotonDemo onClick={accion(demoCuentaLista, "/app")}>Entrar como estudiante inscrita</BotonDemo>
            )}
            <BotonDemo onClick={accion(() => { demoCuentaLista(); demoCompletarSemana(); }, "/app")}>
              Completar semana {progreso.semanaActual}
            </BotonDemo>
            <BotonDemo onClick={accion(() => { demoCuentaLista(); demoCompletarTodo(); }, "/app/certificado")}>
              Completar el curso (ver certificado)
            </BotonDemo>
            <BotonDemo
              peligro
              onClick={() => {
                if (confirm("¿Borrar todos los datos de la demo en este navegador?")) {
                  reiniciar();
                  router.push("/");
                }
              }}
            >
              Reiniciar demo
            </BotonDemo>
          </div>
        </div>
      )}
      <button
        type="button"
        aria-expanded={abierto}
        aria-controls="panel-demo"
        onClick={() => setAbierto(!abierto)}
        className="min-h-11 cursor-pointer rounded-full border-0 bg-estrella px-4 py-2.5 text-[14px] font-semibold text-tinta-profunda shadow-[3px_3px_0_#2A1350]"
      >
        {abierto ? "Cerrar" : "Modo demo"}
      </button>
    </div>
  );
}

function BotonDemo({ children, onClick, peligro }: { children: React.ReactNode; onClick: () => void; peligro?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-lg border-[1.5px] bg-white px-3 py-2 text-left text-[14px] ${
        peligro ? "border-[#F0C9C4] text-error-texto hover:bg-[#FDF1EF]" : "border-linea text-tinta hover:bg-lila"
      }`}
    >
      {children}
    </button>
  );
}
