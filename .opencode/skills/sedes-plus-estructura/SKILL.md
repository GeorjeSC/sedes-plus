---
name: sedes-plus-estructura
description: Estructura técnica de Sedes+ con React y Vite (carpetas, modelo de datos en localStorage, sesión simulada del intranet, roles, pantallas, reglas de negocio, comandos y convenciones de Git). Úsala siempre que se vaya a crear o modificar código, componentes, páginas, funciones de datos o rutas de Sedes+, o cuando se necesite saber dónde va cada archivo o cómo se llaman los datos y funciones, aunque el usuario no pida "estructura" expresamente.
---

# Estructura del proyecto Sedes+

Stack: **React** (con **Vite**) + **React Router** + **CSS propio**. Sin backend, sin base de datos y sin login real: los datos se guardan en el `localStorage` del navegador y la sesión del intranet se simula. Lenguaje: JavaScript (archivos `.jsx`). Antes de crear algo nuevo, comprueba que cabe en el alcance (skill `sedes-plus-alcance`) y aplica el estilo visual de la skill `sedes-plus-estilo`.

## Arquitectura

```
Páginas (pages) → Componentes (components) → Contextos (Session y Events) → Reglas de negocio (lib/events.js) → localStorage (lib/storage.js)
```

- Las **páginas** juntan componentes y leen o modifican datos a través de los contextos.
- **SessionContext** simula la sesión del intranet: rol actual y estudiante actual.
- **EventsContext** guarda el estado de los eventos y lo sincroniza con `localStorage` cada vez que cambia.
- Las **reglas de negocio** son funciones puras (no tocan React ni el navegador): reciben datos y devuelven el resultado.
- No agregues librerías de estado, de interfaz ni de formularios: React, React Router y CSS bastan.

## Árbol de carpetas

```
sedes-plus/
├── index.html                       # meta viewport para móvil y título; sin fuentes externas
├── package.json
├── vite.config.js
├── public/
│   └── ucss-logo.png                # opcional: solo si el grupo tiene el logo oficial
├── src/
│   ├── main.jsx                     # BrowserRouter, SessionProvider y EventsProvider
│   ├── App.jsx                      # barra de demo, cabecera y rutas
│   ├── context/
│   │   ├── SessionContext.jsx       # sesión simulada: rol y estudiante actual
│   │   └── EventsContext.jsx        # eventos, acciones y mensajes (flash)
│   ├── lib/
│   │   ├── storage.js               # leer y guardar en localStorage (con try/catch)
│   │   └── events.js                # reglas de negocio puras
│   ├── data/
│   │   ├── students.js              # estudiantes ficticios de ejemplo
│   │   └── seed.js                  # eventos de ejemplo para la demo
│   ├── pages/
│   │   ├── EventsListPage.jsx       # lista de eventos
│   │   ├── NewEventPage.jsx         # formulario de nuevo evento (organizador)
│   │   └── EventDetailPage.jsx      # inscripción (estudiante) o inscritos (organizador)
│   ├── components/
│   │   ├── DemoBar.jsx              # cambia de rol y de estudiante (solo demo)
│   │   ├── Header.jsx               # cabecera estilo intranet con menú móvil
│   │   ├── PageTitle.jsx            # título centrado con línea inferior
│   │   ├── EventCard.jsx
│   │   ├── CapacityBar.jsx          # barra de cupo
│   │   ├── EnrollButton.jsx         # Inscribirme / Estás inscrito / Evento lleno
│   │   ├── RegistrationTable.jsx    # inscritos con asistencia (tabla en escritorio, tarjetas en móvil)
│   │   └── Flash.jsx                # mensajes de éxito o error
│   └── styles/
│       ├── theme.css                # variables de color, tipografía y formas
│       └── app.css                  # estilos de componentes y páginas
├── .opencode/skills/                # estas skills
├── .gitignore
└── README.md
```

## Modelo de datos

**Estudiante** (ficticio, en `students.js`, 8 ejemplos): `code` (string de 8 dígitos) y `name`. No uses datos de personas reales.

**Sesión** (clave `sedes-plus:v1:session`): `{ role: "student" | "organizer", studentCode: string }`. Por defecto: rol `student` y el primer estudiante de la lista.

**Eventos** (clave `sedes-plus:v1:events`): arreglo JSON de eventos; cada evento lleva sus inscripciones dentro.

| Campo del evento | Tipo | Notas |
|---|---|---|
| id | string | `crypto.randomUUID()` |
| title | string | obligatorio |
| description | string | opcional |
| date | string | fecha y hora del evento (valor de `datetime-local`) |
| location | string | obligatorio |
| capacity | number | entero, mínimo 1 |
| createdAt | string | fecha ISO |
| registrations | arreglo | inscripciones del evento |

| Campo de la inscripción | Tipo | Notas |
|---|---|---|
| id | string | `crypto.randomUUID()` |
| studentCode | string | código del estudiante de la sesión |
| name | string | nombre del estudiante de la sesión |
| attended | boolean | por defecto `false` |
| attendedAt | string o null | fecha ISO; nulo hasta marcar la asistencia |
| createdAt | string | fecha ISO |

Usa estos nombres de campos tal cual (en inglés); los textos visibles al usuario van en español.

## Permisos por rol

| Acción | Estudiante | Organizador |
|---|---|---|
| Ver la lista de eventos | Sí | Sí |
| Inscribirse (un clic) | Sí | No |
| Crear evento | No | Sí |
| Ver inscritos y marcar asistencia | No | Sí |

Los permisos se aplican en la interfaz (se ocultan los botones que no corresponden) y también en las acciones del contexto, que devuelven `{ ok: false, error }` si el rol no puede hacerlas.

## Pantallas (rutas)

| Ruta | Página | Qué hace |
|---|---|---|
| `/` | `EventsListPage` | Lista de eventos con barra de cupo |
| `/events/new` | `NewEventPage` | Formulario de nuevo evento; si el rol es estudiante muestra "Solo el organizador puede crear eventos" con un enlace para volver |
| `/events/:id` | `EventDetailPage` | Estudiante: información del evento y `EnrollButton`. Organizador: información y lista de inscritos con asistencia |

Si el `:id` no existe, la página muestra "No encontramos este evento" con un enlace para volver a la lista.

## Funciones de negocio (`src/lib/events.js`)

| Función | Qué hace |
|---|---|
| `createEvent(data)` | Valida y devuelve `{ ok: true, event }` o `{ ok: false, error }` |
| `addRegistration(event, student)` | Rechaza cupo lleno y estudiante ya inscrito (por `code`); devuelve `{ ok: true, event }` o `{ ok: false, error }` |
| `isRegistered(event, studentCode)` | `true` si el estudiante ya está inscrito en el evento |
| `toggleAttendance(event, registrationId)` | Marca o desmarca la asistencia y devuelve el evento actualizado |
| `spotsLeft(event)` | `capacity - registrations.length` |
| `isFull(event)` | `true` si `spotsLeft(event) <= 0` |
| `attendedCount(event)` | Número de inscritos con `attended: true` |

Reglas:
- Una inscripción solo se acepta si `spotsLeft(event) > 0`.
- Un estudiante no puede inscribirse dos veces en el mismo evento.
- El cupo debe ser un entero mayor que 0; título, fecha y lugar son obligatorios.
- Al marcar asistencia se guarda `attended: true` y `attendedAt`; al desmarcar, `attended: false` y `attendedAt: null`.
- Los mensajes de error van en español y dicen cómo corregir el dato.
- Las funciones no modifican el objeto recibido: devuelven una copia nueva.

## Contextos

**`SessionContext`** expone: `role`, `setRole`, `student` (el estudiante actual), `students` (la lista de ejemplo) y `setStudentCode`. Guarda la sesión en `localStorage` cada vez que cambia.

**`EventsContext`** expone: `events`, `getEvent(id)`, `createEvent(data)`, `registerCurrentStudent(eventId)`, `toggleAttendance(eventId, registrationId)`, `flash` y `notify(type, message)`. Cada acción comprueba el rol, llama a la función pura correspondiente, guarda el resultado con `storage.js` y devuelve el error si algo falla.

Si no hay datos en `localStorage` (primera carga) o el contenido no se puede leer, el contexto carga `seed.js` con 2 eventos de ejemplo (uno con el cupo casi lleno).

## Responsive

- El `index.html` debe incluir `<meta name="viewport" content="width=device-width, initial-scale=1">` (Vite ya lo trae).
- Diseño mobile first: los estilos base son para celular y los `@media (min-width: ...)` agregan el escritorio. Detalles en la skill `sedes-plus-estilo`.

## Puesta en marcha

```bash
npm create vite@latest sedes-plus -- --template react
cd sedes-plus
npm install
npm install react-router-dom
npm run dev
```

La app queda en <http://localhost:5173>. Para volver a los datos de ejemplo, borra las claves `sedes-plus:v1:events` y `sedes-plus:v1:session` desde las herramientas del navegador (pestaña Application, Local Storage) y recarga.

## Convenciones de Git

- Rama principal `main`; ramas cortas por funcionalidad (`feat/inscripciones`).
- Mensajes de commit con prefijo: `feat:`, `fix:`, `docs:`, `chore:`.
- Un commit por funcionalidad terminada (mínimo 3 commits significativos en el repositorio).
- No se versionan `node_modules/`, `dist/` ni archivos `.env` (el `.gitignore` de Vite ya cubre los dos primeros).
