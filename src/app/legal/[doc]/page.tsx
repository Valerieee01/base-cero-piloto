import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const DOCS = {
  terminos: {
    titulo: "Términos y condiciones",
    secciones: [
      {
        h: "1. Qué ofrece Base Cero",
        p: [
          "Base Cero es una academia virtual de programación y bases de datos para principiantes. El curso Básico dura 4 semanas, con 3 clases grabadas de 20 a 25 minutos por semana, ejercicios prácticos con revisión automática, una evaluación semanal y acompañamiento del docente por dudas escritas.",
        ],
      },
      {
        h: "2. Precio y forma de pago",
        p: [
          "El precio del curso Básico es $24.900 COP, en un único pago, con impuestos incluidos. Los pagos se procesan por una pasarela de pagos (PSE, tarjeta o Nequi). Base Cero no almacena los datos de tu tarjeta.",
          "Durante el piloto los pagos son simulados: no se cobra dinero real.",
        ],
      },
      {
        h: "3. Acceso al curso",
        p: ["El acceso empieza en el momento del pago. [Por definir: si el acceso vence al terminar las 4 semanas o se mantiene.]"],
      },
      {
        h: "4. Uso del contenido",
        p: [
          "Los videos, guías y ejercicios son para uso personal. No está permitido compartir el acceso a la cuenta ni redistribuir el material.",
        ],
      },
      {
        h: "5. Certificado",
        p: ["El certificado se emite cuando el estudiante aprueba las 4 evaluaciones semanales del curso."],
      },
    ],
  },
  datos: {
    titulo: "Política de tratamiento de datos personales",
    secciones: [
      {
        h: "Responsable",
        p: ["Base Cero, proyecto de estudiantes de Ingeniería de Sistemas en Bucaramanga. Contacto: [correo de contacto]."],
      },
      {
        h: "Qué datos recolectamos",
        p: [
          "Nombre, correo electrónico, avance en el curso, código que escribes en los ejercicios, dudas que envías y, si te postulas a un cupo o descuento, la institución donde estudias y el soporte que nos envíes.",
        ],
      },
      {
        h: "Para qué los usamos",
        p: [
          "Darte acceso al curso, guardar tu avance, responder tus dudas, emitir tu certificado, revisar postulaciones a cupos sociales y enviarte información del curso. No vendemos tus datos.",
        ],
      },
      {
        h: "Tus derechos (Ley 1581 de 2012)",
        p: [
          "Puedes conocer, actualizar, rectificar y suprimir tus datos, y revocar la autorización en cualquier momento, escribiendo al correo de contacto. Guardamos la fecha en que aceptaste esta política.",
        ],
      },
    ],
  },
  devoluciones: {
    titulo: "Política de devoluciones",
    secciones: [
      {
        h: "Derecho de retracto (Ley 1480 de 2011)",
        p: [
          "Propuesta del piloto: puedes pedir la devolución del dinero dentro de los primeros 5 días calendario después del pago, siempre que hayas visto menos de 3 clases del curso.",
        ],
      },
      {
        h: "Cómo pedirla",
        p: [
          "Escríbenos al correo de contacto con el correo de tu cuenta. Devolvemos el dinero por el mismo medio de pago en un plazo máximo de 30 días calendario.",
        ],
      },
      {
        h: "Casos especiales",
        p: ["Los cupos sociales gratuitos no tienen devolución porque no tienen costo."],
      },
    ],
  },
} as const;

type Doc = keyof typeof DOCS;

export function generateStaticParams() {
  return Object.keys(DOCS).map((doc) => ({ doc }));
}

export default async function Legal({ params }: PageProps<"/legal/[doc]">) {
  const { doc } = await params;
  if (!(doc in DOCS)) notFound();
  const d = DOCS[doc as Doc];

  return (
    <div className="min-h-screen bg-papel">
      <SiteHeader />
      <main className="mx-auto max-w-[760px] px-4 pt-8 pb-24 sm:px-6">
        <p className="rounded-xl bg-aviso px-4 py-3 text-[15px] text-aviso-texto">
          Borrador del piloto: debe revisarlo un asesor legal antes de cobrar dinero real.
        </p>
        <h1 className="mt-8 text-[clamp(30px,4vw,44px)] leading-tight font-bold tracking-tight">{d.titulo}</h1>
        <nav aria-label="Documentos legales" className="mt-4 flex flex-wrap gap-2 text-[15px]">
          {(Object.keys(DOCS) as Doc[]).map((k) => (
            <Link
              key={k}
              href={`/legal/${k}`}
              aria-current={k === doc ? "page" : undefined}
              className={`rounded-full px-4 py-2 no-underline ${k === doc ? "bg-lila font-medium text-tinta" : "text-medio hover:text-tinta"}`}
            >
              {DOCS[k].titulo.split(" ").slice(0, 2).join(" ")}
            </Link>
          ))}
        </nav>
        <div className="prose-legal mt-4">
          {d.secciones.map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              {s.p.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
