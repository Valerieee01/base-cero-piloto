"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./Icons";
import { useStore } from "@/lib/store";

export function AppHeader({ migas }: { migas?: { href?: string; label: string }[] }) {
  const { estado, salir } = useStore();
  const ruta = usePathname();
  const router = useRouter();
  const inicial = (estado.usuario?.nombre ?? "?").slice(0, 1).toUpperCase();
  const pendientes = estado.dudas.filter((d) => d.autorEmail === estado.usuario?.email && !d.respuesta).length;

  const enlaces = [
    { href: "/app", label: "Mi aprendizaje" },
    { href: "/app/dudas", label: pendientes ? `Mis dudas (${pendientes})` : "Mis dudas" },
    { href: "/app/certificado", label: "Certificado" },
  ];

  return (
    <header className="no-print border-b border-linea bg-white">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <Link href="/" className="flex items-center gap-2.5 text-tinta no-underline" aria-label="Base Cero, inicio">
            <Logo size={30} />
            <span className={`text-[19px] font-bold ${migas ? "hidden sm:inline" : ""}`}>Base Cero</span>
          </Link>
          {migas?.map((m, i) => (
            <span key={i} className="flex items-center gap-3 text-[15px]">
              <span aria-hidden="true" className="text-lila-borde">
                /
              </span>
              {m.href ? (
                <Link href={m.href} className="text-medio no-underline hover:text-tinta">
                  {m.label}
                </Link>
              ) : (
                <span className="font-medium text-tinta">{m.label}</span>
              )}
            </span>
          ))}
        </div>
        <nav aria-label="Plataforma" className="flex flex-wrap items-center gap-1 text-[15px]">
          {enlaces.map((e) => {
            const activo = ruta === e.href;
            return (
              <Link
                key={e.href}
                href={e.href}
                aria-current={activo ? "page" : undefined}
                className={`rounded-full px-3.5 py-2.5 no-underline sm:px-4 ${
                  activo ? "bg-lila font-medium text-tinta" : "text-medio hover:text-tinta"
                }`}
              >
                {e.label}
              </Link>
            );
          })}
          <span
            aria-label={`Cuenta de ${estado.usuario?.nombre ?? "invitado"}`}
            className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-tinta font-semibold text-white"
          >
            {inicial}
          </span>
          <button
            type="button"
            onClick={() => {
              salir();
              router.push("/");
            }}
            className="cursor-pointer rounded-full border-0 bg-transparent px-3 py-2.5 text-sm text-suave hover:text-tinta"
          >
            Salir
          </button>
        </nav>
      </div>
    </header>
  );
}
