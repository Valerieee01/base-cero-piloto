type P = { size?: number; className?: string; color?: string };

export function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden="true">
      <circle cx="15" cy="19" r="11" fill="none" stroke="#8B3FD9" strokeWidth="5" strokeDasharray="54 16" strokeLinecap="round" />
      <path d="M17 17 L30 4 M22 4 H30 V12" fill="none" stroke="#2A1350" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Estrella({ size = 26, relleno = true, className }: { size?: number; relleno?: boolean; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className} style={{ flex: "none" }}>
      <path
        d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z"
        fill={relleno ? "#F2B33D" : "none"}
        stroke="#F2B33D"
        strokeWidth={relleno ? 0 : 2}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Check({ size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" role="img" aria-label="Completada" style={{ flex: "none" }}>
      <circle cx="11" cy="11" r="10" fill="#8B3FD9" />
      <path d="M6.5 11.5 L9.5 14.5 L15.5 8" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Siguiente({ size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" role="img" aria-label="Siguiente" style={{ flex: "none" }}>
      <circle cx="11" cy="11" r="9.5" fill="#FFFFFF" stroke="#F2B33D" strokeWidth="3" />
    </svg>
  );
}

export function Pendiente({ size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" role="img" aria-label="Pendiente" style={{ flex: "none" }}>
      <circle cx="11" cy="11" r="9.5" fill="none" stroke="#C9B8E2" strokeWidth="2" />
    </svg>
  );
}

export function Vista({ size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" role="img" aria-label="Vista, falta el ejercicio" style={{ flex: "none" }}>
      <circle cx="11" cy="11" r="9.5" fill="#EFE6FA" stroke="#8B3FD9" strokeWidth="2" />
      <path d="M11 6v5l3 2" fill="none" stroke="#8B3FD9" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Play({ size = 30, color = "#24103F" }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5v14l11-7z" fill={color} />
    </svg>
  );
}

export function Descargar({ size = 18 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Documento({ size = 18 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Candado({ size = 16, color = "#5E5070" }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flex: "none" }}>
      <rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke={color} strokeWidth="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}

export function Llama({ size = 20 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flex: "none" }}>
      <path
        d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5.3 1.5 1 2.5 2 3 0-3 .5-6 1-8.5z"
        fill="none"
        stroke="#F2B33D"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Flecha({ size = 18 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flex: "none" }}>
      <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Menu({ size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
