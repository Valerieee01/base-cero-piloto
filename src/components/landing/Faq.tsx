"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "¿Necesito saber algo antes de empezar?",
    a: "No. El curso Básico arranca explicando qué es programar. Solo necesitas ganas y unos 20 minutos, tres veces por semana.",
  },
  {
    q: "¿Qué necesito para tomar las clases?",
    a: "Un computador o un celular con internet. Los videos se pueden descargar para verlos sin conexión, y los ejercicios corren en el navegador: no tienes que instalar nada.",
  },
  {
    q: "¿Qué pasa si no entiendo algo?",
    a: "Desde cada clase puedes enviarle tu duda al profe, con tu código adjunto. Respondemos en máximo 24 horas y tenemos horarios fijos de consulta en vivo: martes y jueves, 6:00 p. m.",
  },
  {
    q: "¿Cuánto tiempo tengo para terminar el curso?",
    a: "El curso está pensado para 4 semanas. [Por definir con el equipo: si el acceso vence al terminar o es de por vida.]",
  },
  {
    q: "¿Puedo pedir la devolución de mi dinero?",
    a: "Sí, si la pides dentro de los primeros 5 días después de pagar y has visto menos de 3 clases. Consulta la política de devoluciones completa (propuesta del piloto).",
  },
];

export function Faq() {
  const [abierta, setAbierta] = useState(0);
  return (
    <div className="mt-9 flex flex-col">
      {FAQS.map((f, i) => {
        const open = abierta === i;
        return (
          <div key={f.q} className="border-b-[1.5px] border-linea">
            <button
              type="button"
              onClick={() => setAbierta(open ? -1 : i)}
              aria-expanded={open}
              className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent py-5 text-left text-lg font-medium text-tinta"
            >
              <span>{f.q}</span>
              <span aria-hidden="true" className="flex-none text-[26px] font-light text-violeta">
                {open ? "−" : "+"}
              </span>
            </button>
            {open && <p className="mt-0 mb-6 max-w-[40em] text-base leading-relaxed text-medio">{f.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
