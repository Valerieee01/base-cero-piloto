import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-linea bg-white">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-start justify-between gap-8 px-4 py-12 text-[15px] text-medio sm:px-6">
        <div className="max-w-[26em]">
          <p className="text-lg font-bold text-tinta">Base Cero</p>
          <p className="mt-2 leading-relaxed">Un proyecto de estudiantes de Ingeniería de Sistemas en Bucaramanga.</p>
          <p className="mt-3 text-sm text-suave">Versión piloto. Los pagos son simulados.</p>
        </div>
        <nav aria-label="Redes" className="flex flex-col gap-2.5">
          <a className="text-violeta-texto hover:text-tinta" href="https://www.instagram.com/base_cero1" target="_blank" rel="noreferrer">
            Instagram @base_cero1
          </a>
          <a className="text-violeta-texto hover:text-tinta" href="https://www.facebook.com/share/1FsPXLhAMW/" target="_blank" rel="noreferrer">
            Facebook
          </a>
        </nav>
        <nav aria-label="Legal" className="flex flex-col gap-2.5">
          <Link className="text-violeta-texto hover:text-tinta" href="/legal/terminos">
            Términos y condiciones
          </Link>
          <Link className="text-violeta-texto hover:text-tinta" href="/legal/datos">
            Política de datos personales
          </Link>
          <Link className="text-violeta-texto hover:text-tinta" href="/legal/devoluciones">
            Política de devoluciones
          </Link>
        </nav>
      </div>
    </footer>
  );
}
