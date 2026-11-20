"use client";

import { useEffect } from "react";
import { useStore, type EventoEmbudo } from "@/lib/store";

/** Registra un paso del embudo del piloto (§7) una vez por sesión del navegador. */
export function Evento({ nombre }: { nombre: EventoEmbudo }) {
  const { evento, listo } = useStore();
  useEffect(() => {
    if (!listo) return;
    const clave = `bc-evento-${nombre}`;
    try {
      if (sessionStorage.getItem(clave)) return;
      sessionStorage.setItem(clave, "1");
    } catch {
      /* ignorar */
    }
    evento(nombre);
  }, [listo, nombre, evento]);
  return null;
}
