---
name: sedes-plus-alcance
description: Alcance del prototipo Sedes+ (módulo de inscripciones y asistencia a eventos para el intranet de estudiantes de la UCSS). Úsala siempre que se vaya a implementar, agregar, modificar o priorizar una funcionalidad de Sedes+, o cuando el usuario pida algo y haya que decidir si entra o no en el prototipo, aunque no mencione la palabra "alcance". También para preparar la demo, planificar el tiempo de desarrollo o redactar el README y la presentación.
---

# Alcance de Sedes+

Sedes+ es un módulo pensado para el **intranet de estudiantes de la UCSS**: el organizador de un evento estudiantil controla cupos, lista de inscritos y asistencia, y los estudiantes se inscriben con la sesión que ya tienen en el intranet. El prototipo debe poder **demostrarse en poco tiempo** (bloque de desarrollo de 80 minutos), por eso el alcance es corto y cerrado.

## Cómo usar esta skill

1. Antes de escribir código, comprueba que lo pedido está en la lista "Dentro del alcance".
2. Si lo pedido está en "Fuera del alcance" o "Pospuesto", **no lo implementes**: avisa al usuario de que está fuera del alcance y pregunta si quiere ampliarlo.
3. Si lo pedido no aparece en ninguna lista, trátalo como fuera del alcance y pregunta.
4. Prefiere siempre la solución más simple que cumpla el criterio de aceptación. No agregues campos, pantallas ni librerías que no se necesiten para la demo.

## Contexto: la sesión del intranet se simula

En el producto real, el estudiante entra con su usuario y contraseña del intranet y Sedes+ ya sabe quién es. En el prototipo **no se construye una pantalla de login**: la sesión se simula con una **barra de demo** que permite elegir el rol (Estudiante u Organizador) y, como estudiante, uno de los estudiantes de ejemplo. Todo lo demás se comporta como si la identidad viniera del intranet.

## Dentro del alcance

| # | Funcionalidad | Criterio de aceptación |
|---|---|---|
| 1 | Crear evento con cupo (organizador) | Se guarda con título, fecha, lugar y cupo (entero mayor que 0) |
| 2 | Listar eventos (ambos roles) | Cada evento muestra inscritos, cupos disponibles y avisa cuando está lleno |
| 3 | Inscribirse a un evento (estudiante) | Un clic en "Inscribirme", sin formulario: usa el nombre y el código de la sesión. Rechaza la inscripción si el cupo está lleno o si ese estudiante ya está inscrito; después de inscribirse el botón pasa a "Estás inscrito" |
| 4 | Ver lista de inscritos (organizador) | Muestra nombre y código de cada inscrito, ordenados por fecha de inscripción; el estudiante no ve esta lista |
| 5 | Marcar asistencia (organizador) | Un clic marca o desmarca la asistencia, el cambio queda guardado y se ve el conteo de asistentes |
| 6 | Sesión simulada y vista por rol | La barra de demo cambia de rol y de estudiante; solo el organizador crea eventos y marca asistencia; la sesión se recuerda al recargar |
| 7 | Diseño responsive con la identidad del intranet | Se usa sin scroll horizontal desde 360 px de ancho, en celular y en computadora, con los colores y formas del intranet (ver skill `sedes-plus-estilo`) |

## Fuera del alcance

No se hace en esta ocasión:

- Login real e integración con el usuario y la contraseña del intranet (SSO o API de la UCSS): lo reemplaza la sesión simulada.
- Certificados.
- Pagos.
- Códigos QR.
- Correos automáticos.

## Pospuesto para una versión futura

- Que el estudiante marque su propia asistencia.
- Lista "Mis inscripciones" del estudiante.
- Editar o eliminar eventos.
- Buscar o filtrar inscritos.
- Exportar la lista a Excel o PDF.
- Lista de espera cuando el cupo se llena.
- Servidor o base de datos compartida entre dispositivos.
- Botón para restablecer los datos de ejemplo desde la interfaz.

## Restricciones

1. **Un solo organizador y sin pantalla de login:** la identidad viene de la sesión simulada.
2. **Tecnología:** React (con Vite), sin backend; los datos se guardan en `localStorage`.
3. **Los datos viven en un solo navegador:** la demo se hace en un solo navegador, cambiando de rol y de estudiante desde la barra de demo.
4. **Datos ficticios:** los estudiantes de ejemplo son inventados; no se usan datos de personas reales ni credenciales reales.
5. **Tiempo:** 80 minutos de desarrollo; corre en local y se demuestra desde el navegador.

## Plan de tiempo (bloque de 80 minutos)

| Minutos | Actividad | Commit sugerido |
|---|---|---|
| 0-15 | Proyecto Vite con React, rutas, tema CSS del intranet, sesión simulada (contexto y barra de demo), `storage.js` y reglas de negocio | `chore: estructura inicial con Vite, React y sesión simulada` |
| 15-35 | Crear y listar eventos | `feat: crear y listar eventos con cupo` |
| 35-55 | Inscripción con un clic y control de cupo | `feat: inscripción con control de cupo` |
| 55-70 | Lista de inscritos y marcar asistencia | `feat: lista de inscritos y asistencia` |
| 70-80 | Ajustes responsive, datos de ejemplo y README | `docs: README y datos de ejemplo` |

## Guion de demo (3 minutos)

1. Como **Organizador**, crear un evento con cupo de 3 personas.
2. Cambiar a **Estudiante** e inscribir a 3 estudiantes distintos (cambiando de estudiante en la barra de demo); mostrar cómo baja el contador de cupos.
3. Con un cuarto estudiante, intentar inscribirse y mostrar que el sistema lo rechaza porque el evento está lleno.
4. Volver a uno de los estudiantes ya inscritos y mostrar que ve "Estás inscrito" y no puede repetir.
5. Volver a **Organizador**, abrir la lista de inscritos y marcar la asistencia de dos personas.
6. Mostrar el conteo final (inscritos, asistentes y cupos libres) y reducir la ventana al ancho de un celular para comprobar que todo se ve bien.

Antes de la demo, borra las claves `sedes-plus:v1:events` y `sedes-plus:v1:session` de `localStorage` y recarga para empezar con los datos de ejemplo. Cada paso del guion debe funcionar sin errores antes de dar por terminado el prototipo.
