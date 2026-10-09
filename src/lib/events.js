function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function createEvent(data = {}) {
  const title = normalizeText(data.title);
  const location = normalizeText(data.location);
  const date = normalizeText(data.date);
  const description = normalizeText(data.description);
  const capacity = Number(data.capacity);

  if (!title) {
    return { ok: false, error: 'El título es obligatorio' };
  }
  if (!date) {
    return { ok: false, error: 'La fecha es obligatoria' };
  }
  if (!location) {
    return { ok: false, error: 'El lugar es obligatorio' };
  }
  if (!Number.isInteger(capacity) || capacity <= 0) {
    return { ok: false, error: 'El cupo debe ser un número entero mayor que 0' };
  }

  const event = {
    id: crypto.randomUUID(),
    title,
    description,
    date,
    location,
    capacity,
    createdAt: new Date().toISOString(),
    registrations: [],
  };

  return { ok: true, event };
}

export function spotsLeft(event) {
  return event.capacity - event.registrations.length;
}

export function isFull(event) {
  return spotsLeft(event) <= 0;
}

export function isRegistered(event, studentCode) {
  return event.registrations.some((registration) => registration.studentCode === studentCode);
}

export function attendedCount(event) {
  return event.registrations.filter((registration) => registration.attended).length;
}

export function addRegistration(event, student) {
  if (!student || !student.code) {
    return { ok: false, error: 'No hay un estudiante en la sesión' };
  }
  if (isFull(event)) {
    return { ok: false, error: 'Este evento ya no tiene cupos disponibles' };
  }
  if (isRegistered(event, student.code)) {
    return { ok: false, error: 'Ya estás inscrito en este evento' };
  }

  const registration = {
    id: crypto.randomUUID(),
    studentCode: student.code,
    name: student.name,
    attended: false,
    attendedAt: null,
    createdAt: new Date().toISOString(),
  };

  return {
    ok: true,
    event: {
      ...event,
      registrations: [...event.registrations, registration],
    },
  };
}

export function toggleAttendance(event, registrationId) {
  const registrations = event.registrations.map((registration) => {
    if (registration.id !== registrationId) return registration;
    const attended = !registration.attended;
    return {
      ...registration,
      attended,
      attendedAt: attended ? new Date().toISOString() : null,
    };
  });

  return { ...event, registrations };
}
