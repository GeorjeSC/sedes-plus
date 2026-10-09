# Sedes+

**Sedes+** es un prototipo de módulo para el intranet de estudiantes de la UCSS que permite gestionar inscripciones a eventos universitarios. El organizador crea un evento con cupo, los estudiantes se inscriben con un clic desde su sesión, y el organizador ve la lista de inscritos y marca la asistencia en el momento. Se usa igual de bien desde el celular que desde la computadora.

> **Proyecto académico.** No está conectado al intranet real de la UCSS ni usa credenciales reales: la sesión del estudiante se simula con una barra de demo y los estudiantes de ejemplo son ficticios.

## El problema

Los organizadores de eventos estudiantiles (charlas, torneos y talleres) tienen dificultad para controlar inscritos y asistencia, lo que causa aforos excedidos y listas desordenadas. Google Forms y las hojas de papel no controlan cupos ni registran la asistencia en el momento.

## Funcionalidades

- Crear un evento con cupo (organizador)
- Ver la lista de eventos con los cupos disponibles
- Inscribirse con un clic usando la sesión del estudiante; se bloquea si el cupo está lleno o si ya está inscrito
- Ver la lista de inscritos de cada evento (organizador)
- Marcar la asistencia de cada inscrito (organizador)
- Diseño responsive, con la apariencia del intranet de estudiantes

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
git clone <URL-DEL-REPOSITORIO>
cd sedes-plus
npm install
npm run dev
```

Abre <http://localhost:5173> en el navegador. Para generar la versión de producción: `npm run build`.

## Cómo usarlo

La barra amarilla de arriba (**Modo demo**) simula la sesión del intranet:

1. Elige el rol **Organizador**, pulsa **Nuevo evento**, completa título, fecha, lugar y cupo, y guarda.
2. Cambia al rol **Estudiante**, elige un estudiante de ejemplo y abre el evento.
3. Pulsa **Inscribirme**. Cuando el cupo se llena, el sistema no permite más inscripciones.
4. Vuelve al rol **Organizador**, abre el evento y marca la asistencia de cada persona en la lista de inscritos.

La primera vez, la aplicación carga dos eventos de ejemplo. Para probar el diseño en celular, reduce el ancho de la ventana o usa el modo dispositivo de las herramientas del navegador.

## Limitaciones

- Los datos se guardan en el navegador donde se usa la aplicación: no se comparten entre dispositivos ni entre navegadores.
- La sesión es simulada; no hay inicio de sesión real.
- Para volver a los datos de ejemplo, borra las claves `sedes-plus:v1:events` y `sedes-plus:v1:session` en las herramientas del navegador (Application, Local Storage) y recarga la página.

## Estructura del proyecto

```
src/pages/        EventsListPage, NewEventPage, EventDetailPage
src/components/   Header, DemoBar, EventCard, CapacityBar, EnrollButton, RegistrationTable, Flash
src/context/      SessionContext (rol y estudiante) y EventsContext (eventos)
src/lib/          events.js (reglas de negocio) y storage.js (localStorage)
src/data/         students.js y seed.js: datos ficticios de ejemplo
src/styles/       theme.css (colores, tipografía y formas) y app.css
.opencode/skills/ instrucciones para agentes de IA (alcance, estructura y estilo)
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

## Equipo

| Integrante | Rol |
|---|---|
| Georje Soto | Prototipo |
| _(nombre)_ | Problema y alcance |
| _(nombre)_ | Presentación |
| _(nombre)_ | Gestión de Configuración (Git) |
| _(nombre)_ | Validación y retroalimentación |
| _(nombre)_ | Demo y pruebas |

## Contexto académico

Proyecto de taller universitario (Opción 7: gestión de inscripciones para eventos universitarios).
