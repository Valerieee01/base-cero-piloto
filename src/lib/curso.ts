// Contenido del curso Básico para el piloto (PROPUESTA_PILOTO.md §4).
// Semanas 1 y 3 con contenido completo; 2 y 4 con contenido de muestra.

export type TipoEjercicio = "PYTHON" | "SQL";

export interface PruebaPython {
  salidaEsperada: string;
}

export interface Ejercicio {
  id: string;
  tipo: TipoEjercicio;
  enunciado: string;
  codigoInicial: string;
  /** Python: salida esperada. SQL: consulta solución contra la BD semilla. */
  pruebas?: PruebaPython[];
  solucionSql?: string;
  /** Palabras o expresiones que el código debe usar (p. ej. "while"). */
  debeUsar?: { patron: string; mensaje: string }[];
  pista: string;
}

export interface Clase {
  id: string;
  semana: number;
  orden: number; // 1..3 dentro de la semana
  numero: number; // 1..12 en el curso
  titulo: string;
  subtitulo: string;
  duracionMin: number;
  esMuestra?: boolean;
  /** Código que aparece en la miniatura del video. */
  codigoVideo: string[];
  apuntes: string[];
  ejercicio: Ejercicio;
  contenidoDeMuestra?: boolean;
}

export interface Pregunta {
  pregunta: string;
  opciones: string[];
  correcta: number;
}

export interface Evaluacion {
  semana: number;
  titulo: string;
  preguntas: Pregunta[];
  ejercicio: Ejercicio;
}

export interface Semana {
  numero: number;
  titulo: string;
  resumen: string;
}

export const SEMANAS: Semana[] = [
  { numero: 1, titulo: "Tus primeros programas", resumen: "Qué es programar, variables, tipos de datos y operadores." },
  { numero: 2, titulo: "Decidir y repetir", resumen: "Condicionales y ciclos para que tu programa tome decisiones." },
  { numero: 3, titulo: "Dónde viven los datos", resumen: "Bases de datos: tabla, registro, campo y tu primera consulta SQL." },
  { numero: 4, titulo: "Mini proyecto", resumen: "Juntas código y datos en un programa pequeño que tú construyes." },
];

export const NIVELES = [
  {
    id: "basico",
    nombre: "Básico",
    para: "Para quien nunca ha programado",
    precio: 24900,
    descripcion:
      "Variables, tipos de datos, operadores, condicionales y ciclos. En bases de datos: tabla, registro y campo.",
    incluye: [
      "4 semanas, 12 clases grabadas",
      "Ejercicios con revisión automática",
      "Dudas respondidas en máximo 24 horas",
      "Certificado al aprobar",
    ],
    disponible: true,
    abre: "",
  },
  {
    id: "intermedio",
    nombre: "Intermedio",
    para: "Para quien terminó el Básico",
    precio: 34900,
    descripcion: "Organizar el código con funciones y listas, relaciones entre tablas y consultas SQL básicas.",
    incluye: ["4 semanas, 12 clases grabadas", "Ejercicios con revisión automática", "Dudas respondidas en máximo 24 horas"],
    disponible: false,
    abre: "Se abre en el mes 2",
  },
  {
    id: "avanzado",
    nombre: "Avanzado",
    para: "Para armar tu primer proyecto",
    precio: 44900,
    descripcion: "Un proyecto práctico que une programación y bases de datos, con consultas más completas.",
    incluye: ["4 semanas, 12 clases grabadas", "Revisión de tu proyecto", "Dudas respondidas en máximo 24 horas"],
    disponible: false,
    abre: "Se abre en el mes 3",
  },
] as const;

export const PRECIO_BASICO = 24900;
export const DESCUENTO_SOLIDARIO = 0.3;
export const CODIGOS_VALIDOS = ["SOLIDARIO30"];

/** Base de datos semilla para los ejercicios SQL (sql.js). */
export const BD_SEMILLA = `
CREATE TABLE estudiantes (
  id INTEGER PRIMARY KEY,
  nombre TEXT,
  ciudad TEXT,
  edad INTEGER,
  nivel TEXT
);
INSERT INTO estudiantes VALUES
  (1, 'Andrea', 'Bucaramanga', 19, 'Básico'),
  (2, 'Camilo', 'Floridablanca', 23, 'Básico'),
  (3, 'Valentina', 'Girón', 17, 'Básico'),
  (4, 'Santiago', 'Bucaramanga', 21, 'Intermedio'),
  (5, 'Laura', 'Piedecuesta', 25, 'Básico'),
  (6, 'Mateo', 'Bucaramanga', 18, 'Básico'),
  (7, 'Daniela', 'Floridablanca', 22, 'Intermedio');
`;

export const CLASES: Clase[] = [
  // ───────────── Semana 1 ─────────────
  {
    id: "s1-c1",
    semana: 1,
    orden: 1,
    numero: 1,
    titulo: "¿Qué es programar?",
    subtitulo: "Darle instrucciones claras a un computador",
    duracionMin: 20,
    codigoVideo: ['print("Hola, mundo")'],
    apuntes: [
      "Programar es escribir instrucciones, paso a paso, para que el computador haga algo.",
      "Un programa se lee de arriba hacia abajo: una instrucción por línea.",
      "print(...) muestra en pantalla lo que pongas entre los paréntesis.",
      'El texto va entre comillas: "Hola". Los números no: 20.',
    ],
    ejercicio: {
      id: "s1-c1-ej1",
      tipo: "PYTHON",
      enunciado: 'Escribe un programa que muestre en pantalla el texto Hola, mundo',
      codigoInicial: "# escribe tu código aquí\n",
      pruebas: [{ salidaEsperada: "Hola, mundo" }],
      debeUsar: [{ patron: "print\\s*\\(", mensaje: "Para mostrar algo en pantalla necesitas usar print( )." }],
      pista: 'Usa print("Hola, mundo"). Revisa la coma y las comillas.',
    },
  },
  {
    id: "s1-c2",
    semana: 1,
    orden: 2,
    numero: 2,
    titulo: "Variables y tipos de datos",
    subtitulo: "Guardar datos para usarlos después",
    duracionMin: 24,
    esMuestra: true,
    codigoVideo: ['nombre = "Andrea"', "edad = 19", "print(nombre)", "print(edad)"],
    apuntes: [
      "Una variable es una caja con nombre donde guardas un dato: edad = 20.",
      'Tipos de datos básicos: texto (str) "Hola", entero (int) 20, decimal (float) 4.5 y lógico (bool) True / False.',
      "El signo = no significa 'igual': significa 'guarda este valor en esta variable'.",
      "Los nombres de variables no llevan espacios ni tildes: mi_edad, nombre_completo.",
    ],
    ejercicio: {
      id: "s1-c2-ej1",
      tipo: "PYTHON",
      enunciado: "Crea una variable edad con el valor 20 e imprímela.",
      codigoInicial: "# escribe tu código aquí\n",
      pruebas: [{ salidaEsperada: "20" }],
      debeUsar: [{ patron: "\\bedad\\s*=", mensaje: "Crea la variable con edad = 20 antes de imprimirla." }],
      pista: "Primero escribe edad = 20 y en la siguiente línea print(edad).",
    },
  },
  {
    id: "s1-c3",
    semana: 1,
    orden: 3,
    numero: 3,
    titulo: "Operadores",
    subtitulo: "Sumar, restar, multiplicar y comparar",
    duracionMin: 21,
    codigoVideo: ["precio = 12000", "cantidad = 3", "total = precio * cantidad", "print(total)"],
    apuntes: [
      "Aritméticos: + suma, - resta, * multiplica, / divide, % residuo.",
      "De comparación: == igual, != distinto, > mayor, < menor, >= mayor o igual.",
      "Una comparación siempre da True o False.",
      "Puedes guardar el resultado de una operación en otra variable: total = precio * cantidad.",
    ],
    ejercicio: {
      id: "s1-c3-ej1",
      tipo: "PYTHON",
      enunciado:
        "Un cuaderno cuesta 12000 pesos y compras 3. Guarda el precio y la cantidad en variables, calcula el total y muéstralo.",
      codigoInicial: "precio = 12000\ncantidad = 3\n# calcula el total y muéstralo\n",
      pruebas: [{ salidaEsperada: "36000" }],
      debeUsar: [{ patron: "\\*", mensaje: "Para calcular el total multiplica con el operador *." }],
      pista: "total = precio * cantidad y luego print(total).",
    },
  },
  // ───────────── Semana 2 (contenido de muestra) ─────────────
  {
    id: "s2-c1",
    semana: 2,
    orden: 1,
    numero: 4,
    titulo: "Condicionales",
    subtitulo: "Que tu programa tome decisiones con if",
    duracionMin: 23,
    contenidoDeMuestra: true,
    codigoVideo: ["edad = 17", "if edad >= 18:", "    print('Mayor de edad')", "else:", "    print('Menor de edad')"],
    apuntes: [
      "if revisa una condición: si es True, ejecuta el bloque de abajo.",
      "else se ejecuta cuando la condición es False.",
      "El bloque va con sangría (4 espacios). Python usa la sangría para saber qué va dentro del if.",
      "No olvides los dos puntos : al final del if y del else.",
    ],
    ejercicio: {
      id: "s2-c1-ej1",
      tipo: "PYTHON",
      enunciado:
        "La variable edad vale 17. Si es mayor o igual a 18 muestra Mayor de edad; si no, muestra Menor de edad.",
      codigoInicial: "edad = 17\n",
      pruebas: [{ salidaEsperada: "Menor de edad" }],
      debeUsar: [
        { patron: "\\bif\\b", mensaje: "El ejercicio pide decidir con un if." },
        { patron: "\\belse\\b", mensaje: "Te falta el else para el caso contrario." },
      ],
      pista: "if edad >= 18: en una línea, el print con sangría debajo, y luego else: con su print.",
    },
  },
  {
    id: "s2-c2",
    semana: 2,
    orden: 2,
    numero: 5,
    titulo: "Condicionales anidadas",
    subtitulo: "Más de dos caminos con elif",
    duracionMin: 25,
    contenidoDeMuestra: true,
    codigoVideo: ["nota = 4.2", "if nota >= 4.5:", "    print('Excelente')", "elif nota >= 3:", "    print('Aprobado')"],
    apuntes: [
      "elif significa 'si no, si...': revisa otra condición cuando la anterior falló.",
      "Python revisa las condiciones en orden y entra solo en la primera que se cumpla.",
      "Puedes poner un if dentro de otro if; a eso se le llama anidar.",
    ],
    ejercicio: {
      id: "s2-c2-ej1",
      tipo: "PYTHON",
      enunciado:
        "La nota es 4.2. Muestra Excelente si es 4.5 o más, Aprobado si es 3 o más, y Reprobado en otro caso.",
      codigoInicial: "nota = 4.2\n",
      pruebas: [{ salidaEsperada: "Aprobado" }],
      debeUsar: [{ patron: "\\belif\\b", mensaje: "Usa elif para el segundo camino." }],
      pista: "if nota >= 4.5: … elif nota >= 3: … else: …",
    },
  },
  {
    id: "s2-c3",
    semana: 2,
    orden: 3,
    numero: 6,
    titulo: "Ciclos con while",
    subtitulo: "Repetir sin copiar y pegar",
    duracionMin: 22,
    contenidoDeMuestra: true,
    codigoVideo: ["contador = 1", "while contador <= 3:", "    print(contador)", "    contador = contador + 1"],
    apuntes: [
      "while repite un bloque mientras la condición sea True.",
      "Dentro del ciclo debes cambiar algo (por ejemplo sumar 1); si no, el ciclo nunca termina.",
      "for i in range(1, 6) es otra forma de repetir: recorre los números del 1 al 5.",
    ],
    ejercicio: {
      id: "s2-c3-ej1",
      tipo: "PYTHON",
      enunciado: "Usa un ciclo while para mostrar los números del 1 al 5, uno por línea.",
      codigoInicial: "numero = 1\n",
      pruebas: [{ salidaEsperada: "1\n2\n3\n4\n5" }],
      debeUsar: [
        {
          patron: "\\bwhile\\b",
          mensaje: "Tu código todavía no usa while. El ejercicio pide repetir con un ciclo, no escribir cinco print.",
        },
      ],
      pista:
        "Empieza con numero = 1. El ciclo debe seguir mientras numero <= 5, y en cada vuelta sumas 1. Si olvidas sumar, el ciclo nunca termina.",
    },
  },
  // ───────────── Semana 3 (SQL) ─────────────
  {
    id: "s3-c1",
    semana: 3,
    orden: 1,
    numero: 7,
    titulo: "¿Qué es una base de datos?",
    subtitulo: "Dónde guardan los datos las aplicaciones",
    duracionMin: 20,
    codigoVideo: ["SELECT *", "FROM estudiantes;"],
    apuntes: [
      "Una base de datos guarda información de forma ordenada para buscarla rápido.",
      "SQL es el lenguaje con el que le preguntamos cosas a la base de datos.",
      "SELECT * FROM estudiantes significa: 'tráeme todo de la tabla estudiantes'.",
      "El punto y coma ; marca el final de la consulta.",
    ],
    ejercicio: {
      id: "s3-c1-ej1",
      tipo: "SQL",
      enunciado: "Escribe una consulta que muestre todos los datos de la tabla estudiantes.",
      codigoInicial: "-- escribe tu consulta aquí\n",
      solucionSql: "SELECT * FROM estudiantes;",
      pista: "SELECT * FROM estudiantes;",
    },
  },
  {
    id: "s3-c2",
    semana: 3,
    orden: 2,
    numero: 8,
    titulo: "Tabla, registro y campo",
    subtitulo: "Las partes de una base de datos",
    duracionMin: 22,
    codigoVideo: ["SELECT nombre, ciudad", "FROM estudiantes;"],
    apuntes: [
      "Tabla: un conjunto de datos del mismo tipo, como una hoja de cálculo (estudiantes).",
      "Registro (fila): un elemento de la tabla, por ejemplo una estudiante: Andrea.",
      "Campo (columna): un dato de cada registro, por ejemplo nombre, ciudad o edad.",
      "En vez de * puedes pedir solo los campos que necesitas, separados por comas.",
    ],
    ejercicio: {
      id: "s3-c2-ej1",
      tipo: "SQL",
      enunciado: "Muestra solo los campos nombre y ciudad de todos los estudiantes.",
      codigoInicial: "SELECT \nFROM estudiantes;\n",
      solucionSql: "SELECT nombre, ciudad FROM estudiantes;",
      pista: "Después de SELECT escribe los dos campos separados por coma: nombre, ciudad.",
    },
  },
  {
    id: "s3-c3",
    semana: 3,
    orden: 3,
    numero: 9,
    titulo: "Tu primera consulta SQL",
    subtitulo: "Filtrar registros con WHERE",
    duracionMin: 24,
    codigoVideo: ["SELECT nombre", "FROM estudiantes", "WHERE edad >= 18;"],
    apuntes: [
      "WHERE filtra: solo trae los registros que cumplen la condición.",
      "El texto va entre comillas simples: WHERE ciudad = 'Bucaramanga'.",
      "Puedes combinar condiciones con AND y OR.",
      "ORDER BY edad ordena los resultados de menor a mayor.",
    ],
    ejercicio: {
      id: "s3-c3-ej1",
      tipo: "SQL",
      enunciado: "Muestra el nombre y la edad de los estudiantes que viven en Bucaramanga.",
      codigoInicial: "SELECT nombre, edad\nFROM estudiantes\n",
      solucionSql: "SELECT nombre, edad FROM estudiantes WHERE ciudad = 'Bucaramanga';",
      pista: "Agrega al final: WHERE ciudad = 'Bucaramanga';",
    },
  },
  // ───────────── Semana 4 (contenido de muestra) ─────────────
  {
    id: "s4-c1",
    semana: 4,
    orden: 1,
    numero: 10,
    titulo: "Mini proyecto: el guion",
    subtitulo: "Planear antes de programar",
    duracionMin: 20,
    contenidoDeMuestra: true,
    codigoVideo: ['proyecto = "Mi tienda"', 'print("Bienvenido a", proyecto)'],
    apuntes: [
      "Antes de programar, escribe en palabras qué debe hacer tu programa.",
      "Divide el problema en pasos pequeños: mostrar menú, leer datos, calcular, mostrar resultado.",
      "En el mini proyecto armarás una tienda que calcula el total de una compra.",
    ],
    ejercicio: {
      id: "s4-c1-ej1",
      tipo: "PYTHON",
      enunciado: 'Guarda el nombre de tu proyecto, "Mi tienda", en una variable y muestra: Bienvenido a Mi tienda',
      codigoInicial: 'proyecto = "Mi tienda"\n',
      pruebas: [{ salidaEsperada: "Bienvenido a Mi tienda" }],
      pista: 'print("Bienvenido a", proyecto) separa con un espacio automáticamente.',
    },
  },
  {
    id: "s4-c2",
    semana: 4,
    orden: 2,
    numero: 11,
    titulo: "Mini proyecto: el código",
    subtitulo: "Calcular el total con descuento",
    duracionMin: 25,
    contenidoDeMuestra: true,
    codigoVideo: ["total = 50000", "if total > 40000:", "    total = total * 0.9", "print(total)"],
    apuntes: [
      "Juntas variables, operadores y condicionales en un solo programa.",
      "Si la compra supera un valor, aplicas un descuento.",
      "int(...) convierte un decimal en entero: int(45000.0) da 45000.",
    ],
    ejercicio: {
      id: "s4-c2-ej1",
      tipo: "PYTHON",
      enunciado:
        "El total de la compra es 50000. Si es mayor a 40000, aplica un 10 % de descuento. Muestra el total final como número entero.",
      codigoInicial: "total = 50000\n",
      pruebas: [{ salidaEsperada: "45000" }],
      debeUsar: [{ patron: "\\bif\\b", mensaje: "Usa un if para decidir si aplica el descuento." }],
      pista: "Dentro del if: total = total * 0.9. Al final: print(int(total)).",
    },
  },
  {
    id: "s4-c3",
    semana: 4,
    orden: 3,
    numero: 12,
    titulo: "Mini proyecto: los datos",
    subtitulo: "Contar registros con COUNT",
    duracionMin: 21,
    contenidoDeMuestra: true,
    codigoVideo: ["SELECT COUNT(*)", "FROM estudiantes;"],
    apuntes: [
      "COUNT(*) cuenta cuántos registros hay.",
      "Combinado con WHERE cuenta solo los que cumplen la condición.",
      "Así tu tienda podría saber cuántos clientes tiene en cada ciudad.",
    ],
    ejercicio: {
      id: "s4-c3-ej1",
      tipo: "SQL",
      enunciado: "Cuenta cuántos estudiantes están en el nivel Básico.",
      codigoInicial: "SELECT COUNT(*)\nFROM estudiantes\n",
      solucionSql: "SELECT COUNT(*) FROM estudiantes WHERE nivel = 'Básico';",
      pista: "Agrega WHERE nivel = 'Básico'; (con tilde).",
    },
  },
];

export const EVALUACIONES: Evaluacion[] = [
  {
    semana: 1,
    titulo: "Evaluación semana 1: tus primeros programas",
    preguntas: [
      {
        pregunta: "¿Qué hace print(\"Hola\")?",
        opciones: ["Guarda Hola en una variable", "Muestra Hola en pantalla", "Imprime en papel"],
        correcta: 1,
      },
      {
        pregunta: "¿Qué tipo de dato es 4.5?",
        opciones: ["Texto (str)", "Entero (int)", "Decimal (float)"],
        correcta: 2,
      },
      {
        pregunta: "En Python, edad = 20 significa…",
        opciones: ["Que edad es igual a 20, como en matemáticas", "Guardar 20 en la variable edad", "Comparar edad con 20"],
        correcta: 1,
      },
      { pregunta: "¿Cuál es el resultado de 10 % 3?", opciones: ["1", "3", "3,33"], correcta: 0 },
    ],
    ejercicio: {
      id: "eval-s1",
      tipo: "PYTHON",
      enunciado: "Guarda tu año de nacimiento, 2005, en una variable y muestra la edad que cumples en 2026.",
      codigoInicial: "nacimiento = 2005\n",
      pruebas: [{ salidaEsperada: "21" }],
      debeUsar: [{ patron: "-", mensaje: "Calcula la edad restando: 2026 - nacimiento." }],
      pista: "print(2026 - nacimiento)",
    },
  },
  {
    semana: 2,
    titulo: "Evaluación semana 2: decidir y repetir",
    preguntas: [
      {
        pregunta: "¿Cuándo se ejecuta el bloque de un else?",
        opciones: ["Siempre", "Cuando la condición del if es False", "Cuando la condición del if es True"],
        correcta: 1,
      },
      {
        pregunta: "¿Qué pasa si en un while nunca cambias la variable de la condición?",
        opciones: ["El ciclo no se ejecuta", "El ciclo nunca termina", "Python lo arregla solo"],
        correcta: 1,
      },
      {
        pregunta: "¿Qué números recorre for i in range(1, 4)?",
        opciones: ["1, 2, 3", "1, 2, 3, 4", "0, 1, 2, 3"],
        correcta: 0,
      },
    ],
    ejercicio: {
      id: "eval-s2",
      tipo: "PYTHON",
      enunciado: "Usa un ciclo for para sumar los números del 1 al 10 y muestra el resultado.",
      codigoInicial: "suma = 0\n",
      pruebas: [{ salidaEsperada: "55" }],
      debeUsar: [{ patron: "\\bfor\\b", mensaje: "El ejercicio pide usar un ciclo for." }],
      pista: "for n in range(1, 11): suma = suma + n. Al final, fuera del ciclo, print(suma).",
    },
  },
  {
    semana: 3,
    titulo: "Evaluación semana 3: dónde viven los datos",
    preguntas: [
      {
        pregunta: "En una tabla de estudiantes, ¿qué es un registro?",
        opciones: ["Una columna, como la edad", "Una fila: un estudiante con todos sus datos", "El nombre de la tabla"],
        correcta: 1,
      },
      {
        pregunta: "¿Qué hace WHERE en una consulta?",
        opciones: ["Ordena los resultados", "Filtra los registros que cumplen una condición", "Borra registros"],
        correcta: 1,
      },
      {
        pregunta: "¿Qué trae SELECT * FROM estudiantes?",
        opciones: ["Todos los campos de todos los estudiantes", "Solo el primer estudiante", "Solo los nombres"],
        correcta: 0,
      },
    ],
    ejercicio: {
      id: "eval-s3",
      tipo: "SQL",
      enunciado: "Muestra el nombre y la edad de los estudiantes mayores de 20 años, ordenados por edad de menor a mayor.",
      codigoInicial: "SELECT nombre, edad\nFROM estudiantes\n",
      solucionSql: "SELECT nombre, edad FROM estudiantes WHERE edad > 20 ORDER BY edad;",
      pista: "WHERE edad > 20 ORDER BY edad;",
    },
  },
  {
    semana: 4,
    titulo: "Entrega final: mini proyecto",
    preguntas: [
      {
        pregunta: "¿Qué conviene hacer antes de empezar a programar un proyecto?",
        opciones: ["Escribir todo el código de una vez", "Dividir el problema en pasos pequeños", "Buscar el código hecho"],
        correcta: 1,
      },
      {
        pregunta: "¿Qué hace COUNT(*) en SQL?",
        opciones: ["Suma los valores", "Cuenta los registros", "Ordena la tabla"],
        correcta: 1,
      },
    ],
    ejercicio: {
      id: "eval-s4",
      tipo: "PYTHON",
      enunciado: "Muestra los números pares del 1 al 10, uno por línea. Usa un ciclo y un if.",
      codigoInicial: "",
      pruebas: [{ salidaEsperada: "2\n4\n6\n8\n10" }],
      debeUsar: [
        { patron: "\\b(for|while)\\b", mensaje: "Usa un ciclo (for o while)." },
        { patron: "\\bif\\b", mensaje: "Usa un if para quedarte solo con los pares." },
      ],
      pista: "for n in range(1, 11): y dentro if n % 2 == 0: print(n)",
    },
  },
];

export const TOTAL_CLASES = CLASES.length;

export function claseDeMuestra(): Clase {
  return CLASES.find((c) => c.esMuestra)!;
}

export function getClase(id: string): Clase | undefined {
  return CLASES.find((c) => c.id === id);
}

export function clasesDeSemana(semana: number): Clase[] {
  return CLASES.filter((c) => c.semana === semana);
}

export function getEvaluacion(semana: number): Evaluacion | undefined {
  return EVALUACIONES.find((e) => e.semana === semana);
}

export function todosLosEjercicios(): Ejercicio[] {
  return [...CLASES.map((c) => c.ejercicio), ...EVALUACIONES.map((e) => e.ejercicio)];
}

export function formatoPesos(valor: number): string {
  return "$" + String(Math.round(valor)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
