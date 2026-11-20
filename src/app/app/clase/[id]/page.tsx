import { notFound } from "next/navigation";
import { CLASES, getClase } from "@/lib/curso";
import { ClaseEstudiante } from "./ClaseEstudiante";

export function generateStaticParams() {
  return CLASES.map((c) => ({ id: c.id }));
}

export default async function Page({ params }: PageProps<"/app/clase/[id]">) {
  const { id } = await params;
  if (!getClase(id)) notFound();
  return <ClaseEstudiante id={id} />;
}
