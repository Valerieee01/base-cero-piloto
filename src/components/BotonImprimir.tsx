"use client";

export function BotonImprimir({ texto = "Descargar PDF", className }: { texto?: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={
        className ??
        "cursor-pointer rounded-full border-0 bg-violeta px-5 py-2.5 text-[15px] font-medium text-white hover:bg-violeta-texto"
      }
    >
      {texto}
    </button>
  );
}
