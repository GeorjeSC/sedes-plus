# Sedes+

**Sedes+** es un prototipo de módulo para el intranet de estudiantes de la UCSS que permite gestionar inscripciones y controlar la asistencia a eventos universitarios. El organizador crea un evento con cupo, los estudiantes se inscriben con un clic desde su sesión, y el organizador ve la lista de inscritos, controla el aforo y marca la asistencia en el momento. Si el cupo se llena, entra en juego la lista de espera con promoción automática. Se usa igual de bien desde el celular que desde la computadora.

> **Proyecto académico.** No está conectado al intranet real de la UCSS ni usa credenciales reales: el acceso se simula con una pantalla de login institucional y los estudiantes de ejemplo son ficticios.

## El problema

Los organizadores de eventos estudiantiles (charlas, torneos y talleres) tienen dificultad para controlar inscritos y asistencia, lo que causa aforos excedidos y listas desordenadas. Google Forms y las hojas de papel no controlan cupos, no manejan lista de espera ni registran la asistencia en el momento.

## Funcionalidades

- **Acceso institucional simulado:** pantalla de login con el estilo del intranet y acceso rápido de demo para cualquiera de los 8 estudiantes o como organizador.
- **Eventos con cupo (organizador):** crear, editar (incluido el ciclo de vida: abierto, en curso, finalizado, cancelado) y eliminar eventos.
- **Listado de eventos:** búsqueda por título, lugar o descripción; filtros por estado (todos, con cupos, llenos, finalizados) y orden por fecha, cupos libres o capacidad.
- **Inscripción del estudiante:** un clic con la sesión activa, con bloqueo si el cupo está lleno o si ya está inscrito, y pase digital de ingreso con comprobante.
- **Lista de espera inteligente:** se activa cuando el evento está lleno, muestra el turno en la cola y sube automáticamente al primero en espera cuando alguien cancela.
- **Gestión de asistencia (organizador):** lista de inscritos, panel de métricas de aforo, validador rápido de ingreso por código, exportación a CSV y "Acta Oficial de Control de Asistencia" imprimible.
- **Mis inscripciones (estudiante):** portal con los eventos en los que está inscrito, el pase digital y la cancelación de cupo.
- **Centro de notificaciones:** recordatorios de eventos, posición en la lista de espera, aviso de últimos cupos y eventos con lista de espera activa.
- **Diseño responsive**, con la apariencia del intranet de estudiantes.

**Fuera del alcance de esta versión:** login real e integración con las credenciales del intranet, certificados, pagos, códigos QR y correos automáticos.

## Tecnología

- [React](https://react.dev) con [Vite](https://vite.dev)
- [React Router](https://reactrouter.com)
- CSS propio (sin librerías de componentes)
- Datos guardados en el `localStorage` del navegador (sin backend)

## Requisitos

- [Node.js](https://nodejs.org) 20 o superior (versión LTS)
- npm
- Git

## Instalación y ejecución

```bash
git clone https://github.com/GeorjeSC/sedes-plus.git
cd sedes-plus
npm install
npm run dev
```

Abre <http://localhost:5173> en el navegador. Para generar la versión de producción: `npm run build`. Otros comandos: `npm run preview` (sirve la build) y `npm run lint` (oxlint).

## Cómo usarlo

Al entrar, la aplicación muestra la **pantalla de acceso del intranet**. El usuario y la contraseña no se validan: usa el panel de **acceso rápido de demo** para entrar como cualquiera de los 8 estudiantes de ejemplo o como **Organizador**.

1. Entra como **Organizador**, pulsa **Nuevo evento**, completa título, fecha, lugar y cupo, y guarda.
2. Cambia a un **Estudiante** y abre el evento.
3. Pulsa **Inscribirme**. Cuando el cupo se llena, el sistema bloquea nuevas inscripciones y ofrece la **lista de espera**.
4. Abre **Mis inscripciones** para ver el pase digital o cancelar tu cupo.
5. Vuelve como **Organizador**, abre el evento y marca la asistencia, usa el validador por código, exporta a CSV o imprime el acta.

La primera vez, la aplicación carga tres eventos de ejemplo (uno de ellos lleno, para probar la lista de espera) y ocho estudiantes ficticios. La sesión se recuerda al recargar la página. Para probar el diseño en celular, reduce el ancho de la ventana a 360, 768 y 1280 px o usa el modo dispositivo de las herramientas del navegador.

## Documentación

La documentación técnica completa (arquitectura, modelo de datos, roles y permisos, reglas de negocio, rutas y API de los contextos) está en [`DOCUMENTACION.md`](./DOCUMENTACION.md).

## Publicar en GitHub

```bash
git remote add origin https://github.com/<USUARIO>/<REPOSITORIO>.git
git push -u origin main
```

Si el repositorio aún no existe, créalo vacío en <https://github.com/new> (sin README ni .gitignore, para no chocar con los del proyecto).

## Desplegar en Vercel

1. Entra a <https://vercel.com/new> e importa el repositorio de GitHub.
2. Vercel detecta Vite automáticamente. Confirma: **Build Command** `npm run build`, **Output Directory** `dist`.
3. Pulsa **Deploy**. Cada `git push` a `main` publica una nueva versión.

El archivo `vercel.json` ya incluye el rewrite de SPA, necesario porque las rutas (`/events/:id`) se manejan con React Router en el navegador: sin él, recargar una ruta profunda daría 404. No se necesitan variables de entorno.

También se puede desplegar desde la terminal con [`vercel`](https://vercel.com/docs/cli): `npm install -g vercel`, `vercel` (preview) y `vercel --prod` (producción).

## Limitaciones

- Los datos se guardan en el navegador donde se usa la aplicación: no se comparten entre dispositivos ni entre navegadores.
- La sesión es simulada; no hay inicio de sesión real.
- No hay pruebas automatizadas.
- Para volver a los datos de ejemplo, borra las claves `sedes-plus:v1:events` y `sedes-plus:v1:session` en las herramientas del navegador (Application, Local Storage) y recarga la página.

## Estructura del proyecto

```
src/pages/        UcssLoginPage, EventsListPage, NewEventPage, EventDetailPage, MyRegistrationsPage
src/components/   Header, PageTitle, EventCard, CapacityBar, EnrollButton, RegistrationTable,
                  AttendanceMetrics, QuickCheckIn, EditEventModal, StudentTicketModal,
                  NotificationsCenter, Flash
src/context/      SessionContext (sesión simulada) y EventsContext (eventos, acciones y flash)
src/lib/          events.js (reglas de negocio), attendance.js (métricas y CSV) y storage.js (localStorage)
src/data/         students.js (8 estudiantes ficticios) y seed.js (3 eventos de ejemplo)
src/styles/       theme.css (colores, tipografía y formas) y app.css
vercel.json       configuración de despliegue (rewrite de SPA)
.nvmrc            versión de Node (22)
.opencode/skills/ instrucciones para agentes de IA (alcance, estructura y estilo)
DOCUMENTACION.md  documentación técnica del proyecto
```

## Skills para agentes de IA

El repositorio incluye tres skills en `.opencode/skills/` que guían a un asistente de IA al trabajar en el proyecto:

| Skill | Para qué sirve |
|---|---|
| `sedes-plus-alcance` | Qué entra y qué no en el prototipo, criterios de aceptación y guion de demo |
| `sedes-plus-estructura` | Carpetas, modelo de datos, sesión simulada, roles, reglas de negocio y convenciones de Git |
| `sedes-plus-estilo` | Colores, tipografía y formas del intranet, componentes, diseño responsive y textos |

## Historial de versiones

| Versión | Descripción |
|---|---|
| v0.1.0 | Primer prototipo: eventos con cupo, inscripción con sesión simulada, lista de inscritos y asistencia |
| v1.0.0 | Acceso institucional simulado, lista de espera inteligente, ciclo de vida de eventos, búsqueda y filtros, métricas de aforo, check-in por código, exportación a CSV, pase digital y centro de notificaciones |
