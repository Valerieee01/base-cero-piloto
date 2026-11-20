import { notFound } from "next/navigation";
import { EVALUACIONES, getEvaluacion } from "@/lib/curso";
import { EvaluacionVista } from "./EvaluacionVista";

export function generateStaticParams() {
  return EVALUACIONES.map((e) => ({ semana: String(e.semana) }));
}

export default async function Page({ params }: PageProps<"/app/evaluacion/[semana]">) {
  const { semana } = await params;
  const n = Number(semana);
  if (!getEvaluacion(n)) notFound();
  return <EvaluacionVista semana={n} />;
}
