---
name: sedes-plus-estilo
description: Guía visual de Sedes+ basada en la identidad del intranet de estudiantes de la UCSS (colores, tipografía, formas, componentes, diseño responsive y textos de interfaz). Úsala siempre que se cree o modifique cualquier página, componente, CSS, formulario, tabla, botón, mensaje o texto visible de Sedes+, o cuando el usuario pida que el sistema se vea como el intranet, moderno, ordenado, con mejores colores o que funcione bien en celular, aunque no mencione "estilo" ni "diseño".
---

# Estilo visual de Sedes+

Sedes+ se presenta como **una función más del intranet de estudiantes de la UCSS**, así que debe sentirse parte de él: cabecera azul con enlaces blancos, fondo gris azulado claro, tarjetas grises de esquinas redondeadas con una banda azul clara arriba, títulos en mayúsculas y tablas con cabecera azul claro. Debe ser **responsive** y cómoda tanto en celular como en computadora.

Los valores de color de la tabla son **aproximados**, tomados de capturas del intranet. Si el grupo tiene acceso al intranet real, conviene confirmarlos con las herramientas de desarrollador del navegador (inspeccionar el elemento y leer el color) y ajustar `theme.css`.

No copies el logo oficial ni otras imágenes de la UCSS salvo que el grupo tenga el archivo (va en `public/ucss-logo.png`). Si no, usa solo texto.

## Paleta

| Variable | Hex | Uso |
|---|---|---|
| `--primary` | `#39A1C8` | Cabecera y superficies grandes de color (el azul del intranet) |
| `--primary-dark` | `#2A7CA0` | Botones y texto pequeño sobre azul (da contraste suficiente) |
| `--brand` | `#00A3CA` | Cian de la marca; úsalo muy poco, solo como acento |
| `--primary-soft` | `#C5E5F1` | Banda superior de las tarjetas |
| `--primary-faint` | `#DCEEFB` | Cabecera de las tablas |
| `--bg` | `#E9ECEF` | Fondo de la página |
| `--card` | `#F0F0F0` | Fondo de las tarjetas |
| `--surface` | `#FFFFFF` | Campos de formulario y filas de tabla |
| `--text` | `#212529` | Texto principal |
| `--muted` | `#6C757D` | Texto secundario |
| `--border` | `#CED4DA` | Bordes de campos y tablas |
| `--link` | `#0B5ED7` | Enlaces y etiquetas azules (el intranet usa `#0D6EFD`; este es un poco más oscuro para leerse mejor) |
| `--topline` | `#2B3340` | Franja fina de 3 px en el borde superior de la página |
| `--success` | `#198754` | Asistió, cupo disponible |
| `--warning` | `#FFC107` | Pocos cupos |
| `--danger` | `#DC3545` | Evento lleno y errores |
| `--demo-bg` / `--demo-text` | `#FFF3CD` / `#664D03` | Barra de demo |

Reglas:
- Usa solo estos colores; no inventes otros.
- Texto blanco solo sobre `--primary` si es en negrita y de 16 px o más (como en la cabecera del intranet); para texto pequeño o botones usa `--primary-dark`.
- Texto sobre `--warning` siempre en `--text`.
- Los colores de estado siempre van acompañados de texto ("Lleno", "Asistió"); nunca dependas solo del color.

## Variables CSS (`src/styles/theme.css`)

```css
:root {
  --primary: #39A1C8;
  --primary-dark: #2A7CA0;
  --brand: #00A3CA;
  --primary-soft: #C5E5F1;
  --primary-faint: #DCEEFB;
  --bg: #E9ECEF;
  --card: #F0F0F0;
  --surface: #FFFFFF;
  --text: #212529;
  --muted: #6C757D;
  --border: #CED4DA;
  --link: #0B5ED7;
  --topline: #2B3340;
  --success: #198754;
  --warning: #FFC107;
  --danger: #DC3545;
  --demo-bg: #FFF3CD;
  --demo-text: #664D03;

  --radius-sm: 4px;
  --radius-md: 12px;
  --shadow: 0 2px 8px rgba(0, 0, 0, .18);
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: var(--bg);
  color: var(--text);
  border-top: 3px solid var(--topline);
}
```

Usa siempre las variables en los componentes y en `app.css`; los hex solo se escriben en `theme.css`. Los estilos son CSS propio: sin Tailwind, sin Bootstrap y sin librerías de componentes.

## Tipografía

La misma del intranet: **Arial, Helvetica, sans-serif**. No cargues fuentes externas.

| Elemento | Tamaño | Peso | Notas |
|---|---|---|---|
| Título de página | 24 px | 400 | Centrado, en mayúsculas, con una línea fina debajo |
| Título de tarjeta | 15 px | 700 | En mayúsculas |
| Etiquetas ("LUGAR:", "CUPO:") | 13 px | 700 | En mayúsculas; el valor va en peso normal |
| Texto | 16 px | 400 | |
| Texto de apoyo | 14 px | 400 | |

- Las mayúsculas se logran con `text-transform: uppercase` en el CSS; en el código el texto se escribe normal.
- Altura de línea 1.5 en texto y 1.3 en títulos.
- Texto largo de unos 70 caracteres por línea como máximo.

## Formas y espaciado

- Tarjetas: radio de 12 px y sombra suave (`--shadow`).
- Botones, campos y etiquetas pequeñas: radio de 4 px.
- Espaciado en múltiplos de 8 px (8, 16, 24, 32).
- Contenedor centrado de máximo 1200 px, con 16 px de margen lateral en celular y 24 px desde 768 px.

## Componentes

Cada uno es un componente de React en `src/components/`.

**Cabecera (`Header`):** fondo `--primary`, texto blanco, altura de 64 px (56 px en celular). A la izquierda, el logo si existe, o el texto "UCSS" en negrita seguido de una línea vertical y "SEDES+" con "EVENTOS" debajo, en mayúsculas pequeñas (imita "INTRANET ESTUDIANTES"). Enlaces blancos: "Inicio" y, solo para el organizador, "Nuevo evento"; el enlace activo lleva una línea blanca debajo. A la derecha, el nombre del estudiante en sesión o la palabra "Organizador". En celular los enlaces se esconden tras un botón de menú (☰) que los despliega en columna.

**Barra de demo (`DemoBar`):** franja encima de la cabecera con fondo `--demo-bg` y texto `--demo-text`: "Modo demo: simula la sesión del intranet", un selector de dos opciones (Estudiante | Organizador) y, si el rol es Estudiante, un desplegable con los estudiantes de ejemplo. En celular se reparte en dos líneas.

**Título de página (`PageTitle`):** texto centrado en mayúsculas con una línea gris de 1 px debajo, como "NOTAS 2026-II" en el intranet.

**Tarjeta de evento (`EventCard`):** fondo `--card`, radio de 12 px y sombra. Arriba una banda `--primary-soft` con la fecha en azul `--link`, mayúsculas, 13 px y negrita ("FECHA: 12/11/2026 18:00"), y debajo el título del evento en mayúsculas y negrita. Cuerpo con líneas etiqueta-valor ("LUGAR: Auditorio", "CUPO: 12 de 30"), la barra de cupo y un botón.

**Barra de cupo (`CapacityBar`):** pista gris `#DEE2E6` de 10 px de alto con extremos redondeados, y el texto "12 de 30 cupos ocupados" debajo.
- Menos del 80 % ocupado: relleno `--success`.
- Del 80 % al 99 %: relleno `--warning` y el texto "Quedan pocos cupos".
- 100 %: relleno `--danger` y la etiqueta "Lleno".

**Botón de inscripción (`EnrollButton`):**
- "Inscribirme": botón principal.
- "Estás inscrito": etiqueta verde (`--success`, texto blanco) con una marca ✓, sin ser botón.
- "Evento lleno": botón desactivado (fondo `--border`, texto `--muted`, cursor `not-allowed`).

**Botones:** principal con fondo `--primary-dark`, texto blanco en negrita, radio de 4 px y altura mínima de 44 px; secundario con fondo blanco, borde `--border` y texto `--text`. Hover un poco más oscuro y foco visible con contorno de 2 px en `--link`. Un solo botón principal por pantalla.

**Formularios (solo "Nuevo evento"):** etiqueta en negrita encima del campo, campo blanco con borde `--border`, radio de 4 px, altura mínima de 44 px y tamaño de letra de 16 px (evita el zoom automático en iPhone). El error va debajo del campo, en `--danger`, y explica qué corregir.

**Tabla de inscritos (`RegistrationTable`):** cabecera con fondo `--primary-faint`, texto en negrita, mayúsculas y 13 px; filas blancas con borde `--border` y contenido centrado, como las tablas de notas del intranet. Columnas: Nº, Nombre, Código y Asistencia, esta última con un interruptor (un `<input type="checkbox">` con etiqueta accesible, por ejemplo "Asistencia de Ana Pérez"). Cuando asistió, el interruptor queda en `--success` y aparece el texto "Asistió".

**Mensajes (`Flash`):** franja encima del contenido; `--success` para éxito y `--danger` para error, con texto blanco en negrita.

## Responsive

Diseño **mobile first**: los estilos base son para celular y los `@media (min-width: ...)` agregan el escritorio.

| Ancho | Cambios |
|---|---|
| menos de 576 px | Una columna; botones principales de ancho completo; cabecera con menú ☰; la tabla de inscritos pasa a lista de tarjetas |
| desde 576 px | La barra de demo cabe en una sola línea |
| desde 768 px | Lista de eventos en 2 columnas; el detalle del evento en dos columnas; el menú de la cabecera se muestra completo |
| desde 992 px | Lista de eventos en 3 columnas |

- La cuadrícula de eventos usa `display: grid` con `repeat(auto-fill, minmax(280px, 1fr))` y 16 px de separación.
- En celular, cada fila de la tabla de inscritos es una tarjeta: nombre en negrita, código en `--muted` debajo y el interruptor a la derecha.
- Todo elemento tocable mide al menos 44 x 44 px.
- No debe haber scroll horizontal desde 360 px de ancho.
- Revisa la app a 360, 768 y 1280 px de ancho antes de dar por terminado el estilo.

## Pantallas

Escritorio (lista de eventos):

```
┌──────────────────────────────────────────────────────┐
│ Modo demo: [ Estudiante | Organizador ] [ Ana Torres ▾ ]│
├──────────────────────────────────────────────────────┤
│ UCSS | SEDES+     Inicio   Nuevo evento    Organizador │  ← azul
├──────────────────────────────────────────────────────┤
│                   EVENTOS                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │FECHA: ...  │  │FECHA: ...  │  │FECHA: ...  │       │
│  │TÍTULO      │  │TÍTULO      │  │TÍTULO      │       │
│  │LUGAR: ...  │  │LUGAR: ...  │  │LUGAR: ...  │       │
│  │▓▓▓░░ 12/30 │  │▓▓▓▓▓ Lleno │  │▓░░░░  3/20 │       │
│  │[Ver evento]│  │[Ver evento]│  │[Ver evento]│       │
│  └────────────┘  └────────────┘  └────────────┘       │
└──────────────────────────────────────────────────────┘
```

Celular (detalle del evento como estudiante):

```
┌────────────────────┐
│ Modo demo ...      │
│ [Estudiante|Organ.]│
│ [ Ana Torres     ▾]│
├────────────────────┤
│ UCSS|SEDES+      ☰ │  ← azul
├────────────────────┤
│  TÍTULO DEL EVENTO │
│ ┌────────────────┐ │
│ │FECHA: ...      │ │
│ │LUGAR: ...      │ │
│ │▓▓▓░░ 12 de 30  │ │
│ │ [ Inscribirme ]│ │
│ └────────────────┘ │
└────────────────────┘
```

Detalle como organizador: la información del evento arriba y, debajo (o a la derecha desde 768 px), la lista de inscritos con la asistencia.

## Textos de la interfaz

- Todo el texto visible va en español, claro y sin jerga técnica.
- Los botones dicen lo que hacen: "Crear evento", "Inscribirme", "Ver evento". Una acción conserva el mismo nombre en todo el flujo (el botón "Crear evento" produce el mensaje "Evento creado").
- Los errores explican cómo solucionarlos: "El cupo debe ser un número mayor que 0", "Este evento ya no tiene cupos disponibles". No piden perdón.
- Las pantallas vacías invitan a actuar: "Todavía no hay eventos" (y, para el organizador, "Crea el primero").
- Mensajes de éxito breves: "Evento creado", "Te inscribiste en el evento", "Asistencia registrada".

## Principios

1. **Parte del intranet:** si se pone junto a las pantallas del intranet, no debe desentonar.
2. **Un vistazo basta:** el estado del cupo se entiende sin leer.
3. **Una acción principal por pantalla.**
4. **Mobile first:** el estudiante se inscribe desde el celular y el organizador marca la asistencia desde el celular en la puerta.
5. **Accesible:** contraste suficiente, foco visible, botones de 44 px y estado siempre con texto además de color.
6. **Sobrio:** sin animaciones decorativas; solo cambia la barra de cupo cuando alguien se inscribe.
