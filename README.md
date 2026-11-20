# Base Cero — Piloto

Academia virtual de programación y bases de datos para principiantes. Piloto para mostrar todas las funcionalidades
(ver `PROPUESTA_PILOTO.md`). Diseño de referencia: lienzo "Base Cero — Piloto".

## Cómo correrlo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
```

## Publicar en Vercel

1. Sube esta carpeta a un repositorio de GitHub.
2. En https://vercel.com → **Add New → Project** → importa el repositorio.
3. Deja todo por defecto (Vercel detecta Next.js) → **Deploy**.

No necesita variables de entorno ni base de datos.

## Qué es real y qué es simulado

| Funcionalidad | Estado en el piloto |
|---|---|
| Landing, niveles, precios, compromiso social, legales | Completo |
| Clase de muestra sin registro (`/clase-gratis`) | Completo |
| Ejercicios Python (Pyodide en un Web Worker, corta ciclos infinitos a los 5 s) | Real, en el navegador |
| Ejercicios SQL (sql.js con BD semilla `estudiantes`) | Real, en el navegador |
| Registro con aceptación de política de datos (guarda la fecha) | Simulado: se guarda en el navegador |
| Checkout PSE / tarjeta / Nequi + código `SOLIDARIO30` (30 %) | Simulado, sin cobro |
| Avance, ruta, evaluaciones semanales, racha | Completo, guardado en el navegador |
| Dudas del estudiante → bandeja del docente → respuesta | Completo (mismo navegador) |
| Certificado (solo con las 4 evaluaciones aprobadas) | Completo; PDF con "Imprimir → Guardar como PDF" |
| Videos | Reproductor de muestra (no hay videos reales todavía) |
| Panel admin (inscritos, ventas, cupos, embudo) | Datos de ejemplo + tu cuenta |

**Todo el estado vive en `localStorage`**: cada visitante tiene su propia demo y nada se comparte entre
dispositivos. El botón amarillo **Modo demo** (abajo a la derecha) permite saltar entre roles,
completar semanas y reiniciar.

## Estructura

- `src/lib/curso.ts` — contenido del curso (semanas, clases, ejercicios, evaluaciones, BD semilla).
- `src/lib/store.tsx` — estado de la demo (reemplaza la BD del §6).
- `src/lib/python.ts`, `src/lib/sql.ts`, `src/lib/verificar.ts` — motores y verificación automática.
- `src/app/…` — pantallas: `/`, `/clase-gratis`, `/compromiso-social`, `/registro`, `/ingresar`, `/legal/*`,
  `/app` (dashboard), `/app/clase/[id]`, `/app/evaluacion/[semana]`, `/app/checkout`, `/app/dudas`,
  `/app/certificado`, `/docente`, `/admin`, `/guia/[id]`.

## Siguiente fase

Para pasar a producción: Prisma + PostgreSQL (esquema del §6), Auth.js, Wompi y videos protegidos.
El contenido de `curso.ts` sirve como semilla de la BD.
