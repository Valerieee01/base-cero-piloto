import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ClaseVista } from "@/components/ClaseVista";
import { Evento } from "@/components/Evento";
import { claseDeMuestra } from "@/lib/curso";

export const metadata = { title: "Clase gratis — Base Cero" };

export default function ClaseGratis() {
  return (
    <div className="min-h-screen bg-papel">
      <Evento nombre="muestra" />
      <div className="border-b border-linea bg-white">
        <SiteHeader />
      </div>
      <div className="border-b border-linea bg-aviso">
        <p className="mx-auto max-w-[1280px] px-4 py-3 text-[15px] text-aviso-texto sm:px-6">
          Esta clase es gratis y no pide registro. Mira el video, lee los apuntes y resuelve el ejercicio.
        </p>
      </div>
      <ClaseVista clase={claseDeMuestra()} modo="muestra" />
      <SiteFooter />
    </div>
  );
}
