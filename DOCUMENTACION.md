# Documentación técnica de Sedes+

Esta guía describe cómo está construido **Sedes+**, el prototipo del módulo de inscripciones y control de asistencia a eventos para el intranet de estudiantes de la UCSS. Está pensada para quien va a leer, mantener o extender el código.

- [Visión general](#visión-general)
- [Tecnología](#tecnología)
- [Arquitectura](#arquitectura)
- [Estructura de archivos](#estructura-de-archivos)
- [Modelo de datos](#modelo-de-datos)
- [Roles y permisos](#roles-y-permisos)
- [Reglas de negocio](#reglas-de-negocio)
- [Rutas y pantallas](#rutas-y-pantallas)
- [Funcionalidades](#funcionalidades)
- [Contextos y API interna](#contextos-y-api-interna)
- [Puesta en marcha](#puesta-en-marcha)
- [Despliegue](#despliegue)
- [Datos de ejemplo](#datos-de-ejemplo)
- [Limitaciones](#limitaciones)
- [Convenciones](#convenciones)
- [Historial de versiones](#historial-de-versiones)

## Visión general

Sedes+ permite que el organizador de un evento estudiantil (charla, taller, torneo) cree el evento con un cupo, y que los estudiantes del intranet se inscriban con un clic y reciban un pase digital. El organizador consulta la lista de inscritos, controla el aforo y marca la asistencia en el momento de la puerta.

El prototipo es **solo front-end**: no hay backend, ni base de datos, ni autenticación real. Todo se guarda en el `localStorage` del navegador y la sesión del intranet se simula con una pantalla de acceso institucional.

## Tecnología

| Categoría | Herramienta | Versión |
|---|---|---|
| Interfaz | React | 19 |
| Enrutado | React Router (`react-router-dom`) | 7 |
| Construcción | Vite | 8 |
| Linter | oxlint | 1 |
| Estado | React Context API | — |
| Persistencia | `localStorage` del navegador | — |
| Estilos | CSS propio (`theme.css` y `app.css`) | — |

- Lenguaje: **JavaScript** con JSX (archivos `.jsx` / `.js`). No se usa TypeScript.
- No se usan librerías de componentes (nada de Bootstrap o Tailwind): los estilos son CSS propio.
- Node requerido: `^20.19.0 || >=22.12.0` (el archivo `.nvmrc` fija la versión 22).

> Las dependencias `@types/react` y `qrcode` siguen declaradas en `package.json`, pero no se usan en el código (el tipo no aporta en un proyecto JS y la funcionalidad de QR se retiró). Pueden eliminarse sin afectar la aplicación.

## Arquitectura

Flujo de datos unidireccional:

```
Páginas (pages) → Componentes (components) → Contextos (Session, Events) → Reglas puras (lib/events.js) → localStorage (lib/storage.js)
```

- Las **páginas** componen la interfaz y operan los datos a través de los contextos.
- **`SessionContext`** simula la sesión del intranet: quién entra (rol y estudiante).
- **`EventsContext`** mantiene el estado de los eventos y lo sincroniza con `localStorage` en cada cambio.
- Las **reglas de negocio** (`src/lib/events.js`) son funciones puras: reciben datos y devuelven una copia con el resultado, sin tocar React ni el navegador.
- Las **métricas y la exportación** (`src/lib/attendance.js`) también son funciones puras.

Los permisos se aplican en dos capas: la interfaz oculta las acciones que no corresponden al rol y las acciones del contexto las rechazan devolviendo `{ ok: false, error }`.

## Estructura de archivos

```
sedes-plus/
├── index.html                  # HTML raíz (lang="es", meta viewport, #root)
├── vite.config.js              # plugin de React
├── vercel.json                 # configuración de despliegue (rewrite SPA)
├── .nvmrc                      # versión de Node (22)
├── .oxlintrc.json              # configuración del linter
├── public/                     # logos de la UCSS, favicon e íconos
└── src/
    ├── main.jsx                # arranque: BrowserRouter + SessionProvider + EventsProvider
    ├── App.jsx                 # puerta de sesión y tabla de rutas
    ├── context/
    │   ├── SessionContext.jsx  # sesión simulada (login, logout, rol, estudiante)
    │   └── EventsContext.jsx   # eventos, acciones, mensajes flash y persistencia
    ├── lib/
    │   ├── storage.js          # lectura/escritura en localStorage y claves (KEYS)
    │   ├── events.js           # reglas de negocio puras
    │   └── attendance.js       # métricas de asistencia y exportación a CSV
    ├── data/
    │   ├── students.js         # 8 estudiantes ficticios
    │   └── seed.js             # 3 eventos de ejemplo
    ├── pages/
    │   ├── UcssLoginPage.jsx       # pantalla de acceso institucional (simulada)
    │   ├── EventsListPage.jsx      # listado, búsqueda, filtros y orden
    │   ├── NewEventPage.jsx        # formulario de nuevo evento (organizador)
    │   ├── EventDetailPage.jsx     # detalle; inscripción (estudiante) o gestión (organizador)
    │   └── MyRegistrationsPage.jsx # portal "Mis inscripciones" (estudiante)
    ├── components/
    │   ├── Header.jsx              # cabecera del intranet con menú móvil
    │   ├── PageTitle.jsx           # título de página centrado
    │   ├── EventCard.jsx           # tarjeta de evento
    │   ├── CapacityBar.jsx         # barra de cupo
    │   ├── EnrollButton.jsx        # inscribirse / lista de espera / comprobante
    │   ├── RegistrationTable.jsx   # inscritos con asistencia, búsqueda y exportación
    │   ├── AttendanceMetrics.jsx   # panel de métricas de aforo
    │   ├── QuickCheckIn.jsx        # validador rápido de ingreso por código
    │   ├── EditEventModal.jsx      # editar evento y ciclo de vida
    │   ├── StudentTicketModal.jsx  # pase digital de ingreso
    │   ├── NotificationsCenter.jsx # centro de notificaciones
    │   └── Flash.jsx               # mensajes de éxito o error
    └── styles/
        ├── theme.css           # variables de color, tipografía y formas
        └── app.css             # estilos de páginas y componentes
```

## Modelo de datos

### Claves de `localStorage`

Definidas en `src/lib/storage.js`:

| Clave | Contenido |
|---|---|
| `sedes-plus:v1:session` | Sesión actual |
| `sedes-plus:v1:events` | Arreglo de eventos (con sus inscripciones y lista de espera dentro) |

### Sesión

```js
{ isLoggedIn: boolean, role: "student" | "organizer", studentCode: string }
```

Por defecto (sin datos o datos corruptos): `{ isLoggedIn: false, role: "student", studentCode: "20211234" }`.

### Evento

```js
{
  id: string,              // crypto.randomUUID() (los de ejemplo usan ids fijos)
  title: string,           // obligatorio
  description: string,     // opcional
  date: string,            // valor de datetime-local, p. ej. "2026-10-21T15:30"
  location: string,        // obligatorio
  capacity: number,        // entero, mínimo 1
  status: "open" | "in_progress" | "finished" | "cancelled",
  createdAt: string,       // ISO
  registrations: Registration[],
  waitlist: WaitlistEntry[]
}
```

### Inscripción (`registrations`)

```js
{
  id: string,
  studentCode: string,
  name: string,
  attended: boolean,
  attendedAt: string | null,  // ISO al marcar; null al desmarcar
  createdAt: string
}
```

### Entrada de lista de espera (`waitlist`)

```js
{ id: string, studentCode: string, name: string, createdAt: string }
```

### Estudiante (ficticio, `src/data/students.js`)

Cada estudiante es `{ code, name }` con código de 8 dígitos. Hay 8 de ejemplo (Ana Torres Quispe, Luis Ramírez Soto, María Fernández Rojas, Diego Herrera Luna, Carla Mendoza Ríos, Jorge Palacios Vega, Sofía Cabrera Núñez y Andrés Salazar Paredes).

## Roles y permisos

Existen dos roles: **estudiante** (`student`) y **organizador** (`organizer`). En el acceso, el usuario `admin` o `organizador` entra como organizador; cualquier código de estudiante válido entra como estudiante; un usuario desconocido cae por defecto en el primer estudiante de ejemplo.

| Acción | Estudiante | Organizador |
|---|---|---|
| Ver listado y detalle de eventos | Sí | Sí |
| Inscribirse (un clic) | Sí | No |
| Entrar o salir de la lista de espera | Sí | No |
| Ver "Mis inscripciones" y el pase digital | Sí | No |
| Cancelar su propia inscripción | Sí | No |
| Crear evento | No | Sí |
| Editar evento y su ciclo de vida | No | Sí |
| Eliminar evento | No | Sí |
| Ver la lista de inscritos | No | Sí |
| Marcar o desmarcar asistencia | No | Sí |
| Validar ingreso por código (check-in) | No | Sí |
| Exportar asistencia a CSV e imprimir acta | No | Sí |

## Reglas de negocio

Implementadas en `src/lib/events.js` y aplicadas por el contexto:

- Una inscripción solo se acepta si quedan cupos (`spotsLeft > 0`).
- Un estudiante no puede inscribirse dos veces al mismo evento (se identifica por `studentCode`).
- Solo se puede entrar a la lista de espera cuando el evento está lleno y el estudiante no está inscrito ni en cola.
- **Promoción automática:** al cancelar un inscrito, el primero de la lista de espera pasa a inscrito confirmado.
- El cupo debe ser un entero mayor que 0; título, fecha y lugar son obligatorios.
- El cupo no puede reducirse por debajo del número de inscritos actuales.
- Al marcar asistencia se guarda `attended: true` y `attendedAt` ISO; al desmarcar, `attended: false` y `attendedAt: null`.
- El check-in por código no distingue mayúsculas y devuelve estados distintos para "no encontrado" y "ya asistió".
- Ciclo de vida del evento: `open` (por defecto), `in_progress`, `finished` y `cancelled`. Los finalizados y cancelados se excluyen de los filtros "Con cupos" y "Llenos".
- Los mensajes de error están en español y explican cómo corregir el dato.

### Funciones de `src/lib/events.js`

| Función | Descripción |
|---|---|
| `normalizeText(value)` | Normaliza texto para comparaciones (minúsculas y sin tildes). |
| `createEvent(data)` | Valida y devuelve `{ ok: true, event }` o `{ ok: false, error }`. |
| `spotsLeft(event)` | `capacity - registrations.length`. |
| `isFull(event)` | `true` si no quedan cupos. |
| `isRegistered(event, code)` | `true` si el estudiante ya está inscrito. |
| `attendedCount(event)` | Número de inscritos con `attended: true`. |
| `addRegistration(event, student)` | Inscribe; rechaza sesión inválida, duplicado o cupo lleno. |
| `getRegistration(event, code)` | Devuelve la inscripción del estudiante. |
| `removeRegistration(event, code)` | Cancela y **promueve** al primero de la lista de espera. Devuelve `{ ok, event, promotedStudent }`. |
| `isInWaitlist` / `getWaitlistPosition` | Consultan la lista de espera y el turno. |
| `addToWaitlist(event, student)` | Anota en la lista de espera si el evento está lleno. |
| `removeFromWaitlist(event, code)` | Saca a un estudiante de la lista de espera. |
| `updateEvent(event, data)` | Edita campos; asegura `capacity >= registrations.length`. |
| `toggleAttendance(event, registrationId)` | Marca o desmarca asistencia. |
| `markAttendanceByStudentCode(event, code)` | Check-in por código; devuelve `marked`, `not_found` o `already_attended`. |

### Funciones de `src/lib/attendance.js`

| Función | Descripción |
|---|---|
| `calculateAttendanceMetrics(event)` | Devuelve `capacity`, `registered`, `attended`, `absent`, `occupancyRate`, `attendanceRate` y `spotsRemaining`. |
| `exportAttendanceToCSV(event)` | Genera el CSV "Acta Oficial de Control de Asistencia" (UTF-8 con BOM) y descarga `UCSS_Asistencia_<slug>_<fecha>.csv`. |

## Rutas y pantallas

El enrutado se define en `src/App.jsx` (con `BrowserRouter` en `main.jsx`). Si no hay sesión iniciada, la aplicación muestra siempre la pantalla de acceso, sin importar la ruta.

| Ruta | Página | Acceso | Descripción |
|---|---|---|---|
| cualquiera sin sesión | `UcssLoginPage` | público | Acceso institucional simulado con acceso rápido de demo |
| `/` | `EventsListPage` | ambos | Listado con búsqueda, filtros de estado y orden |
| `/events/new` | `NewEventPage` | organizador | Formulario de nuevo evento (el estudiante ve un aviso) |
| `/events/:id` | `EventDetailPage` | ambos | Detalle; inscripción (estudiante) o gestión (organizador) |
| `/my-registrations` | `MyRegistrationsPage` | estudiante | Eventos en los que está inscrito, pase digital y cancelación |
| `*` | `EventsListPage` | ambos | Ruta de respaldo |

## Funcionalidades

### Acceso y sesión (simulados)
- Pantalla de acceso con apariencia del intranet, usuario y contraseña (la contraseña no se valida).
- Acceso rápido de demo a cualquiera de los 8 estudiantes y como organizador.
- La sesión (rol y estudiante) se recuerda al recargar; `logout` vuelve a la pantalla de acceso.

### Listado de eventos
- Cuadrícula responsive de tarjetas (1 → 2 → 3 columnas).
- Búsqueda por título, lugar o descripción.
- Filtros por estado: Todos, Con cupos, Llenos, Finalizados (con conteos en vivo).
- Orden por próxima fecha, más cupos libres o mayor capacidad.
- Estado vacío con llamada a la acción para el organizador.

### Creación y edición de eventos
- Formulario con título, fecha-hora, lugar, cupo y descripción, con validación en línea.
- Edición de todos los campos y del ciclo de vida (`open`, `in_progress`, `finished`, `cancelled`).
- Eliminación con doble confirmación (arrastra inscripciones y lista de espera).

### Inscripción del estudiante
- Inscripción de un clic usando la sesión actual, con control de cupo y duplicados.
- Pase digital de ingreso (`StudentTicketModal`) con código de comprobante `SEDES-<id>` y botón de impresión.
- Cancelación de cupo con confirmación (libera o promueve al primero de la lista de espera).

### Lista de espera
- Se ofrece solo cuando el evento está lleno; muestra el turno en la cola.
- Al cancelar un inscrito, el primero de la lista sube automáticamente a inscrito confirmado.

### Gestión de asistencia (organizador)
- Panel de métricas: inscritos/aforo, asistentes en puerta, pendientes por ingresar y cupos libres, con barra de progreso.
- Tabla de inscritos con búsqueda, filtros (Todos, Presentes, Pendientes) y alternar asistencia.
- Validador rápido de ingreso por código.
- Exportación de la asistencia a CSV y "Acta Oficial de Control de Asistencia" imprimible.

### Notificaciones
- Campana con contador de no leídas y panel desplegable.
- Para el estudiante: recordatorios de eventos inscritos, posición en lista de espera y aviso de últimos cupos.
- Para el organizador: eventos con lista de espera activa.
- Aviso institucional fijo y acción "marcar todas como leídas".

## Contextos y API interna

**`SessionContext`** expone `isLoggedIn`, `role`, `student`, `students`, `login(username)`, `logout()`, `setRole(role)` y `setStudentCode(code)`.

**`EventsContext`** expone el estado `events`, los mensajes `flash` y las acciones (todas verifican el rol y persisten el cambio):

| Acción | Descripción |
|---|---|
| `getEvent(id)` | Busca un evento por id. |
| `createEvent(data)` | Crea un evento. |
| `registerCurrentStudent(eventId)` | Inscribe al estudiante de la sesión. |
| `unenrollCurrentStudent(eventId)` | Cancela la inscripción del estudiante. |
| `joinWaitlist(eventId)` / `leaveWaitlist(eventId)` | Entra o sale de la lista de espera. |
| `updateEventDetails(eventId, data)` | Edita el evento y su estado. |
| `deleteEvent(eventId)` | Elimina el evento. |
| `toggleAttendance(eventId, registrationId)` | Marca o desmarca asistencia. |
| `checkInStudentByCode(eventId, studentCode)` | Check-in por código. |
| `notify(type, message)` | Muestra un mensaje flash (se borra a los 4 s). |

## Puesta en marcha

```bash
git clone <URL-DEL-REPOSITORIO>
cd sedes-plus
npm install
npm run dev
```

La aplicación queda en <http://localhost:5173>.

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente. |
| `npm run build` | Genera la versión de producción en `dist/`. |
| `npm run preview` | Sirve localmente la build de producción. |
| `npm run lint` | Ejecuta oxlint sobre el código. |

## Despliegue

El archivo `vercel.json` define `buildCommand: npm run build`, `outputDirectory: dist` y un *rewrite* de SPA que envía cualquier ruta a `/index.html` (necesario para que `/events/:id` funcione al recargar). No requiere variables de entorno.

Desde Vercel: importa el repositorio de GitHub, confirma los comandos anteriores y despliega. Desde la terminal: `npm install -g vercel`, `vercel` (preview) y `vercel --prod` (producción).

## Datos de ejemplo

En la primera carga (o si el `localStorage` no se puede leer) se siembran 3 eventos y 8 estudiantes ficticios. El tercer evento se crea **lleno** a propósito para poder demostrar la lista de espera.

Para **restablecer** los datos de ejemplo, borra las claves `sedes-plus:v1:events` y `sedes-plus:v1:session` en las herramientas del navegador (Application → Local Storage) y recarga la página.

## Limitaciones

- Los datos viven en el navegador donde se usa la aplicación: no se comparten entre dispositivos ni navegadores.
- La sesión es simulada; no hay autenticación real ni integración con el intranet de la UCSS.
- Sin backend ni base de datos compartida; sin certificados, pagos ni correos automáticos.
- No hay pruebas automatizadas (el proyecto no incluye un ejecutor de tests).

## Convenciones

- Componentes de función y archivos `.jsx`; módulos ES (`"type": "module"`).
- Ramas cortas por funcionalidad y mensajes de commit con prefijo: `feat:`, `fix:`, `docs:`, `chore:`.
- No se versionan `node_modules/`, `dist/` ni archivos `.env`.
- Guía visual y de textos: ver la skill `sedes-plus-estilo` en `.opencode/skills/`.

## Historial de versiones

| Versión | Descripción |
|---|---|
| v0.1.0 | Primer prototipo: eventos con cupo, inscripción con sesión simulada, lista de inscritos y asistencia |
| v1.0.0 | Acceso institucional simulado, lista de espera inteligente, ciclo de vida de eventos, búsqueda y filtros, métricas de aforo, check-in por código, exportación a CSV, pase digital y centro de notificaciones |
