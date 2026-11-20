"use client";

import { AppHeader } from "@/components/AppHeader";
import { ClaseVista } from "@/components/ClaseVista";
import { RequiereCuenta } from "@/components/RequiereCuenta";
import { getClase } from "@/lib/curso";

export function ClaseEstudiante({ id }: { id: string }) {
  const clase = getClase(id)!;
  return (
    <RequiereCuenta>
      <AppHeader migas={[{ href: "/app", label: "Mi aprendizaje" }, { label: `Básico, semana ${clase.semana}` }]} />
      <ClaseVista clase={clase} modo="estudiante" />
    </RequiereCuenta>
  );
}
