import Link from "next/link";
import { Logo } from "./Icons";

export function AuthShell({ titulo, subtitulo, children }: { titulo: string; subtitulo: string; children: React.ReactNode }) {
  return (
    <div className="cuaderno flex min-h-screen flex-col bg-papel">
      <header className="mx-auto w-full max-w-[1180px] px-4 py-5 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2.5 text-tinta no-underline">
          <Logo />
          <span className="text-[21px] font-bold">Base Cero</span>
        </Link>
      </header>
      <main className="mx-auto w-full max-w-[520px] flex-1 px-4 pt-6 pb-20">
        <div className="rounded-[20px] border-[1.5px] border-tinta bg-white p-6 shadow-solido sm:p-8">
          <h1 className="m-0 text-[30px] leading-tight font-bold tracking-tight">{titulo}</h1>
          <p className="mt-2 text-base text-suave">{subtitulo}</p>
          {children}
        </div>
      </main>
    </div>
  );
}

export const campoAuth =
  "mt-1.5 w-full min-h-12 rounded-xl border-[1.5px] border-lila-borde bg-white px-4 py-3 text-base text-tinta";
