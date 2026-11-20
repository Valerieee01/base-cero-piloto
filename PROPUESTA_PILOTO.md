# Base Cero — Propuesta del piloto (MVP)

> Documento de arranque para desarrollar en Claude Code. Basado en el Plan de Negocio Base Cero (entrega final, UDI 2026).
> Puedes ponerlo en la raíz del repo y referenciarlo desde `CLAUDE.md`.

---

## 1. Qué es el piloto

Una versión funcional y pequeña de la academia virtual **Base Cero** que permita:

1. **Validar interés real** (no solo el 75,9 % de "sí contrataría" de la encuesta): que la gente se registre, tome la clase gratis y llegue al checkout.
2. **Probar la experiencia de aprendizaje** del curso **Básico**: clases cortas grabadas + ejercicio práctico + avance visible.
3. **Mostrar el producto** en la sustentación / a posibles aliados (universidades).

**Lo que NO es el piloto:** no tiene los 3 niveles completos, ni pagos reales, ni chat en tiempo real. Eso queda para fases siguientes (ver §8).

---

## 2. Usuarios

| Rol | Qué hace en el piloto |
|---|---|
| **Visitante** | Ve la landing, los niveles y precios, toma la clase de muestra sin registrarse. |
| **Estudiante** | Se registra, "compra" el Básico (pago simulado), ve clases, resuelve ejercicios, ve su avance, deja dudas. |
| **Docente (Ingeniero)** | Responde dudas desde un panel simple. |
| **Admin (Gerente)** | Ve inscritos, ventas simuladas y cupos sociales. *(Opcional en el piloto — puede ser una tabla en la BD.)* |

---

## 3. Pantallas

### 3.1 Públicas
| # | Pantalla | Contenido clave (sale del plan) |
|---|---|---|
| P1 | **Landing** | Problema ("explicaciones difíciles, falta de tiempo, falta de práctica"), propuesta (explicaciones sencillas, a tu ritmo, práctica), cómo funciona (4 semanas, 3 clases/semana de 20–25 min), CTA a clase gratis. Datos de la encuesta como prueba social (71,2 %, 60,4 %, 58,5 %). |
| P2 | **Niveles y precios** | Básico $24.900 · Intermedio $34.900 · Avanzado $44.900 COP, 4 semanas c/u, temario por nivel. Intermedio y Avanzado marcados "Próximamente". |
| P3 | **Clase de muestra** | 1 clase del Básico abierta + 1 ejercicio, sin registro. |
| P4 | **Compromiso social** | Cupos gratis (2/mes), descuento solidario 30 % para colegios/universidades públicas, talleres. Formulario de postulación. |
| P5 | **Registro / ingreso** | Con aceptación explícita de la política de datos (Ley 1581/2012). |
| P6 | **Legales** | Términos y condiciones, política de datos, política de devoluciones (Ley 1480/2011). |

### 3.2 Plataforma del estudiante
| # | Pantalla | Contenido |
|---|---|---|
| E1 | **Mi aprendizaje (dashboard)** | Curso actual, semana en la que va, próxima clase, % de avance, racha/recordatorio suave. |
| E2 | **Ruta del curso** | 4 semanas × 3 clases, con estado (pendiente / vista / ejercicio aprobado). Evaluación semanal al final de cada semana. |
| E3 | **Clase** | Video, apuntes/guía descargable, ejercicio práctico debajo, botón "Tengo una duda". Opción de descargar video (para conexión limitada). |
| E4 | **Ejercicio** | Editor + "Ejecutar" + verificación automática (ver §5). |
| E5 | **Mis dudas** | Lista de preguntas y respuestas del docente. Promesa visible: respuesta en máx. 24 h. |
| E6 | **Checkout (simulado)** | Resumen, código de descuento (solidario), botón pagar → éxito. Sin cobro real. |
| E7 | **Certificado** | Se habilita al aprobar las 4 evaluaciones semanales. Descargable en PDF. |

### 3.3 Docente
| # | Pantalla | Contenido |
|---|---|---|
| D1 | **Bandeja de dudas** | Dudas pendientes ordenadas por antigüedad, con el contexto (clase + código del estudiante). |

---

## 4. Contenido del curso Básico (piloto)

Según el plan: variables, tipos de datos, operadores, condicionales y ciclos; en BD: tabla, registro y campo. Propuesta de distribución (ajustable):

| Semana | Clase 1 | Clase 2 | Clase 3 | Evaluación |
|---|---|---|---|---|
| 1 | ¿Qué es programar? | Variables y tipos de datos | Operadores | Quiz + ejercicio |
| 2 | Condicionales (if) | Condicionales anidadas | Ciclos (while/for) | Quiz + ejercicio |
| 3 | ¿Qué es una base de datos? | Tabla, registro, campo | Tu primer `SELECT` | Quiz + ejercicio SQL |
| 4 | Mini proyecto: guion | Mini proyecto: código | Mini proyecto: datos | Entrega final |

> Para el piloto basta con **contenido real en semanas 1 y 3** (una de programación y una de BD) y placeholders en el resto.

---

## 5. Stack propuesto

| Capa | Elección | Por qué |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Lo que elegiste; landing y plataforma en un solo proyecto. |
| Estilos | **Tailwind CSS** + tokens de la marca Base Cero | Rápido de iterar; los tokens salen del diseño. |
| BD | **PostgreSQL** (Neon/Supabase free) con **Prisma** | Gratis para el piloto, migraciones simples. En local puede ser SQLite. |
| Auth | **Auth.js** (email + Google) | Estándar en Next.js. |
| Videos | **YouTube no listado** o **Cloudflare Stream** | Piloto: YouTube no listado ($0). Producción: algo que impida compartir el link. |
| Ejercicios SQL | **sql.js** (SQLite en el navegador) | Corre 100 % en el cliente, sin servidor, ideal para principiantes. |
| Ejercicios de programación | **Pyodide** (Python en el navegador) *o* JS nativo | Ver ambigüedad A1. |
| Certificado | `@react-pdf/renderer` | PDF generado en el servidor. |
| Pagos | **Simulado** en el piloto. Producción: **Wompi** (PSE, tarjeta, Nequi) | La comisión del plan (2,65 % + $700 + IVA) coincide con la tarifa de Wompi — confirmar. |
| Deploy | **Vercel** (free) | Cero configuración con Next.js. |

### Verificación automática de ejercicios
Cada ejercicio define casos de prueba en JSON:
```json
{
  "id": "s1-c2-ej1",
  "tipo": "python",
  "enunciado": "Crea una variable edad con el valor 20 e imprímela.",
  "codigoInicial": "# escribe tu código aquí\n",
  "pruebas": [{ "salidaEsperada": "20" }],
  "pista": "Usa print(edad)"
}
```
Para SQL: se carga una BD semilla en sql.js y se compara el resultado de la consulta del estudiante con el de la consulta solución.

---

## 6. Modelo de datos (inicial)

```
Usuario(id, nombre, email, rol[ESTUDIANTE|DOCENTE|ADMIN], aceptoDatos, aceptoDatosEn, creadoEn)
Curso(id, nivel[BASICO|INTERMEDIO|AVANZADO], titulo, precio, publicado)
Semana(id, cursoId, numero, titulo)
Clase(id, semanaId, orden, titulo, videoUrl, duracionMin, guiaUrl, esMuestra)
Ejercicio(id, claseId, tipo[PYTHON|SQL|QUIZ], enunciado, codigoInicial, pruebasJson, pista)
Inscripcion(id, usuarioId, cursoId, estado[ACTIVA|FINALIZADA], origen[PAGO|CUPO_SOCIAL], precioPagado, codigoDescuento, creadaEn)
ProgresoClase(id, inscripcionId, claseId, vista, vistaEn)
Intento(id, usuarioId, ejercicioId, codigo, aprobado, creadoEn)
Duda(id, usuarioId, claseId, pregunta, codigoAdjunto, respuesta, respondidaPor, creadaEn, respondidaEn)
Certificado(id, inscripcionId, codigo, emitidoEn)
PostulacionSocial(id, nombre, email, tipo[CUPO|DESCUENTO], institucion, soporteUrl, estado)
```

---

## 7. Criterios de aceptación del piloto

- [ ] Un visitante puede tomar la clase de muestra y resolver su ejercicio **sin registrarse**.
- [ ] Registro exige aceptar la política de datos y guarda fecha de aceptación.
- [ ] Checkout simulado aplica el descuento solidario del 30 % con código válido.
- [ ] El estudiante ve su avance (% y semana actual) actualizado al ver clases y aprobar ejercicios.
- [ ] Un ejercicio SQL y uno de programación se verifican automáticamente en el navegador.
- [ ] El estudiante puede enviar una duda desde la clase y verla respondida.
- [ ] El certificado se habilita solo al aprobar las 4 evaluaciones semanales.
- [ ] Todo funciona en celular (muchos principiantes estudian desde el móvil).
- [ ] Precios, duración y política de devoluciones visibles antes de pagar (Ley 1480).

### Métricas para medir el piloto
Visitantes → clase de muestra → registro → checkout iniciado → "pago" → clase 1 completada → semana 1 completada. Esto da una tasa real que se puede comparar con la meta de la estrategia comercial (5–10 interesados el primer mes) y con el supuesto del plan financiero (20 estudiantes en el mes 1).

---

## 8. Fuera del piloto (fases siguientes)

1. Pagos reales con Wompi + facturación (consultar IVA/ICA con el contador).
2. Cursos Intermedio y Avanzado.
3. Panel admin con métricas de ventas y metas mensuales.
4. Encuesta de satisfacción automática al terminar el curso.
5. Videos protegidos (Cloudflare Stream / Mux).
6. Recordatorios por correo/WhatsApp.

---

## 9. Ambigüedades a resolver (el plan no las define)

| # | Tema | Pregunta | Mi sugerencia |
|---|---|---|---|
| A1 | **Lenguaje de programación** | El plan dice "variables, ciclos…" pero no qué lenguaje. | **Python**: sintaxis más amable para principiantes y corre en el navegador con Pyodide. |
| A2 | **Acompañamiento** | El plan dice "chat o foro, con horarios fijos". | Piloto: dudas asíncronas por clase (tipo foro privado). Horarios de consulta en vivo por Meet, fuera de la plataforma. |
| A3 | **Acceso al curso** | ¿El acceso vence al terminar las 4 semanas o es de por vida? | Afecta la promesa comercial y la Ley 1480 — definir con el equipo. |
| A4 | **Devoluciones** | No hay política definida. | Ej.: devolución si se pide en los primeros 5 días y se ha visto < 3 clases. |
| A5 | **Certificado** | ¿Requiere solo aprobar evaluaciones o también un mínimo de clases vistas? | Aprobar las 4 evaluaciones. |
| A6 | **Cupos sociales** | ¿Quién aprueba la postulación y con qué soporte? | Admin aprueba manualmente; soporte = constancia de estudio o carta. |
| A7 | **Modelo de precio** ⚠️ | La *Estrategia comercial* plantea **$24.900 COP mensuales** (suscripción). El *Plan de negocio final* plantea **pago único por curso de 4 semanas** ($24.900 / $34.900 / $44.900). Son modelos distintos y cambian el checkout, la BD (`Inscripcion` vs `Suscripcion`) y el flujo de caja. | El diseño usa el del plan final (pago por curso). Unificar en ambos documentos. |

> Dato útil de la encuesta para A7: el 27,8 % pagaría entre $25.000 y $35.000 al mes, el 38,9 % "depende del contenido" y el 24,1 % prefiere gratis → refuerza tener la **clase de muestra gratis** como puerta de entrada.

---

## 10. Diseño (tokens para Tailwind)

Referencia visual: lienzo "Base Cero — Piloto" (landing, mi aprendizaje, clase, inscripción).

| Token | Valor | Uso |
|---|---|---|
| `tinta` | `#2A1350` | Texto principal, bloques oscuros (del fondo del logo) |
| `tinta-profunda` | `#24103F` / `#160926` | Editor de código, video |
| `violeta` | `#8B3FD9` | Marca, botones primarios, progreso (del anillo del logo) |
| `violeta-texto` | `#7A2FCC` | Enlaces y textos pequeños en violeta |
| `estrella` | `#F2B33D` | Solo logros, foco y CTA sobre fondo oscuro (la estrella del logo) |
| `papel` | `#F6F2FB` | Fondo general (lila muy claro, con cuadrícula de cuaderno en el hero) |
| `linea` | `#E4D9F3` | Bordes y separadores |
| `texto-suave` | `#5E5070` | Texto secundario (contraste AA) |

- **Tipografía:** Lexend (títulos y cuerpo) — diseñada para mejorar la fluidez de lectura, encaja con un público principiante. JetBrains Mono solo para código.
- **Principios:** el código real es el protagonista (hero con un ejercicio que se ejecuta); sombra sólida desplazada en violeta solo en el bloque principal de cada pantalla; la estrella dorada aparece únicamente cuando el estudiante logra algo.
- **Logo:** el logo actual es brillante/3D; para la web conviene una **versión plana** (anillo "0" + flecha). En el diseño usé una aproximación plana provisional.

---

## 11. Orden sugerido en Claude Code

1. `create-next-app` + Tailwind + Prisma + tokens de marca (desde el diseño).
2. Esquema Prisma + seed del curso Básico (con contenido de semanas 1 y 3).
3. Landing y niveles (P1, P2) — estáticas, rápidas de validar.
4. Clase de muestra + motor de ejercicios (sql.js / Pyodide) — **lo más diferencial**.
5. Auth + registro con consentimiento.
6. Dashboard, ruta y clase del estudiante (E1–E3).
7. Checkout simulado + descuento solidario.
8. Dudas (E5 + D1).
9. Certificado.
10. Legales + compromiso social + revisión móvil.

> Tip: pídele a Claude Code una fase a la vez y que corra la app al final de cada una. El diseño (Figma / canvas) se usa como referencia visual en cada fase.
