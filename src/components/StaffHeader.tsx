import Link from "next/link";
import { Logo } from "./Icons";

export function StaffHeader({ rol }: { rol: "Docente" | "Admin" }) {
  return (
    <header className="border-b border-[#4A2F73] bg-tinta text-white">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-white no-underline">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
            <Logo size={26} />
          </span>
          <span className="text-[19px] font-bold">Base Cero</span>
          <span className="rounded-full bg-estrella px-2.5 py-0.5 text-[13px] font-semibold text-tinta-profunda">{rol}</span>
        </Link>
        <nav aria-label="Paneles" className="flex gap-1 text-[15px]">
          <Link
            href="/docente"
            aria-current={rol === "Docente" ? "page" : undefined}
            className={`rounded-full px-4 py-2.5 no-underline ${rol === "Docente" ? "bg-white/15 text-white" : "text-claro hover:text-white"}`}
          >
            Bandeja de dudas
          </Link>
          <Link
            href="/admin"
            aria-current={rol === "Admin" ? "page" : undefined}
            className={`rounded-full px-4 py-2.5 no-underline ${rol === "Admin" ? "bg-white/15 text-white" : "text-claro hover:text-white"}`}
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
