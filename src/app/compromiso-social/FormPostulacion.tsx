"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Estrella } from "@/components/Icons";

const campo = "mt-1.5 w-full min-h-12 rounded-xl border-[1.5px] border-lila-borde bg-white px-4 py-3 text-base text-tinta";

export function FormPostulacion() {
  const { postular } = useStore();
  const [enviado, setEnviado] = useState(false);
  const [tipo, setTipo] = useState<"CUPO" | "DESCUENTO">("DESCUENTO");
  const [error, setError] = useState("");

  if (enviado) {
    return (
      <div role="status" className="rounded-[20px] border-[1.5px] border-tinta bg-white p-8">
        <Estrella size={36} />
        <h3 className="mt-3 text-2xl font-bold">Recibimos tu postulación</h3>
        <p className="mt-2 text-base leading-relaxed text-medio">
          Te escribiremos al correo para pedirte el soporte. Mientras tanto, puedes tomar la clase gratis.
        </p>
        <Link href="/clase-gratis" className="mt-5 inline-block rounded-full bg-violeta px-6 py-3.5 font-medium text-white no-underline">
          Tomar la clase gratis
        </Link>
      </div>
    );
  }

  return (
    <form
      className="rounded-[20px] border-[1.5px] border-linea bg-white p-6 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        if (!f.get("datos")) {
          setError("Para postularte debes autorizar el tratamiento de tus datos.");
          return;
        }
        postular({
          nombre: String(f.get("nombre")),
          email: String(f.get("email")),
          institucion: String(f.get("institucion")),
          motivo: String(f.get("motivo")),
          tipo,
        });
        setEnviado(true);
      }}
    >
      <fieldset className="m-0 border-0 p-0">
        <legend className="text-lg font-semibold">¿A qué te postulas?</legend>
        <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
          {(
            [
              ["DESCUENTO", "Descuento solidario 30 %", "Estudiantes de colegio o universidad pública"],
              ["CUPO", "Cupo gratis", "Busco empleo o no puedo pagar"],
            ] as const
          ).map(([v, t, d]) => (
            <button
              key={v}
              type="button"
              aria-pressed={tipo === v}
              onClick={() => setTipo(v)}
              className={`min-h-16 cursor-pointer rounded-[14px] p-4 text-left text-base font-medium text-tinta ${
                tipo === v ? "border-2 border-violeta bg-lila" : "border-[1.5px] border-linea bg-white"
              }`}
            >
              {t}
              <span className="mt-1 block text-[13px] font-normal text-suave">{d}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        <label className="text-[15px] text-medio">
          Nombre completo
          <input name="nombre" required autoComplete="name" className={campo} />
        </label>
        <label className="text-[15px] text-medio">
          Correo
          <input name="email" type="email" required autoComplete="email" className={campo} />
        </label>
      </div>
      <label className="mt-4 block text-[15px] text-medio">
        Institución donde estudias (o “ninguna”)
        <input name="institucion" required className={campo} />
      </label>
      <label className="mt-4 block text-[15px] text-medio">
        Cuéntanos por qué quieres aprender a programar
        <textarea name="motivo" rows={3} className={`${campo} resize-y`} />
      </label>
      <label className="mt-5 flex cursor-pointer items-start gap-3 text-[15px] leading-relaxed">
        <input type="checkbox" name="datos" className="m-0 mt-0.5 h-[22px] w-[22px] flex-none accent-violeta" />
        <span>
          Autorizo el tratamiento de mis datos personales según la{" "}
          <Link href="/legal/datos" className="text-violeta-texto">
            política de datos
          </Link>{" "}
          (Ley 1581 de 2012).
        </span>
      </label>
      {error && (
        <p role="alert" className="mt-3 text-[15px] text-error-texto">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="mt-6 min-h-[52px] cursor-pointer rounded-full border-0 bg-violeta px-7 py-3.5 text-base font-medium text-white hover:bg-violeta-texto"
      >
        Enviar postulación
      </button>
    </form>
  );
}
