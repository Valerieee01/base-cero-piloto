"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo, Menu } from "./Icons";
import { useStore } from "@/lib/store";

export function SiteHeader() {
  const { estado, listo } = useStore();
  const [abierto, setAbierto] = useState(false);
  const logueado = listo && !!estado.usuario;

  const enlaces = [
    { href: "/#como", label: "Cómo funciona" },
    { href: "/#niveles", label: "Niveles y precios" },
    { href: "/compromiso-social", label: "Cupos y descuentos" },
  ];

  return (
    <header className="relative z-20">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-tinta no-underline">
          <Logo />
          <span className="text-[21px] font-bold tracking-tight">Base Cero</span>
        </Link>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-linea bg-white text-tinta md:hidden"
          aria-expanded={abierto}
          aria-controls="menu-principal"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setAbierto(!abierto)}
        >
          <Menu />
        </button>
        <nav
          id="menu-principal"
          aria-label="Principal"
          className={`${abierto ? "flex" : "hidden"} w-full flex-col gap-1 text-[15px] md:flex md:w-auto md:flex-row md:items-center md:gap-7`}
        >
          {enlaces.map((e) => (
            <Link key={e.href} href={e.href} className="py-2.5 text-tinta no-underline hover:text-violeta-texto" onClick={() => setAbierto(false)}>
              {e.label}
            </Link>
          ))}
          <Link href={logueado ? "/app" : "/ingresar"} className="py-2.5 text-tinta no-underline hover:text-violeta-texto">
            {logueado ? "Mi aprendizaje" : "Ingresar"}
          </Link>
          <Link
            href="/clase-gratis"
            className="mt-2 rounded-full bg-tinta px-5 py-3 text-center font-medium text-white no-underline hover:bg-tinta-profunda md:mt-0"
          >
            Probar clase gratis
          </Link>
        </nav>
      </div>
    </header>
  );
}
