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
  if (isRegistered(event, student.code)) {
    return { ok: false, error: 'Ya estás inscrito en este evento' };
  }
  if (isFull(event)) {
    return { ok: false, error: 'Este evento ya no tiene cupos disponibles' };
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

export function getRegistration(event, studentCode) {
  return event.registrations.find((registration) => registration.studentCode === studentCode) ?? null;
}

export function removeRegistration(event, studentCode) {
  if (!studentCode) {
    return { ok: false, error: 'No se especificó el código del estudiante' };
  }
  if (!isRegistered(event, studentCode)) {
    return { ok: false, error: 'No estás inscrito en este evento' };
  }

  const registrations = event.registrations.filter(
    (registration) => registration.studentCode !== studentCode
  );

  let updatedEvent = {
    ...event,
    registrations,
    waitlist: event.waitlist || [],
  };

  let promotedStudent = null;
  if (updatedEvent.waitlist && updatedEvent.waitlist.length > 0) {
    const [firstInWaitlist, ...remainingWaitlist] = updatedEvent.waitlist;
    const promotedRegistration = {
      id: crypto.randomUUID(),
      studentCode: firstInWaitlist.studentCode,
      name: firstInWaitlist.name,
      attended: false,
      attendedAt: null,
      createdAt: new Date().toISOString(),
    };
    updatedEvent = {
      ...updatedEvent,
      registrations: [...updatedEvent.registrations, promotedRegistration],
      waitlist: remainingWaitlist,
    };
    promotedStudent = firstInWaitlist;
  }

  return {
    ok: true,
    event: updatedEvent,
    promotedStudent,
  };
}

export function isInWaitlist(event, studentCode) {
  return (event.waitlist || []).some((w) => w.studentCode === studentCode);
}

export function getWaitlistPosition(event, studentCode) {
  const index = (event.waitlist || []).findIndex((w) => w.studentCode === studentCode);
  return index >= 0 ? index + 1 : null;
}

export function addToWaitlist(event, student) {
  if (!student || !student.code) {
    return { ok: false, error: 'No hay un estudiante en la sesión' };
  }
  if (isRegistered(event, student.code)) {
    return { ok: false, error: 'Ya estás inscrito en este evento' };
  }
  if (isInWaitlist(event, student.code)) {
    return { ok: false, error: 'Ya estás en la lista de espera' };
  }
  if (!isFull(event)) {
    return { ok: false, error: 'Aún quedan cupos libres, puedes inscribirte directamente' };
  }

  const entry = {
    id: crypto.randomUUID(),
    studentCode: student.code,
    name: student.name,
    createdAt: new Date().toISOString(),
  };

  const waitlist = [...(event.waitlist || []), entry];

  return {
    ok: true,
    event: {
      ...event,
      waitlist,
    },
    position: waitlist.length,
  };
}

export function removeFromWaitlist(event, studentCode) {
  if (!studentCode) {
    return { ok: false, error: 'No se especificó el código del estudiante' };
  }
  if (!isInWaitlist(event, studentCode)) {
    return { ok: false, error: 'No estás en la lista de espera de este evento' };
  }

  const waitlist = (event.waitlist || []).filter((w) => w.studentCode !== studentCode);

  return {
    ok: true,
    event: {
      ...event,
      waitlist,
    },
  };
}

export function updateEvent(event, data = {}) {
  const title = normalizeText(data.title ?? event.title);
  const location = normalizeText(data.location ?? event.location);
  const date = normalizeText(data.date ?? event.date);
  const description = normalizeText(data.description ?? event.description);
  const capacity = Number(data.capacity ?? event.capacity);
  const status = data.status || event.status || 'open';

  if (!title) return { ok: false, error: 'El título es obligatorio' };
  if (!date) return { ok: false, error: 'La fecha es obligatoria' };
  if (!location) return { ok: false, error: 'El lugar es obligatorio' };
  if (!Number.isInteger(capacity) || capacity <= 0) {
    return { ok: false, error: 'El cupo debe ser un número entero mayor que 0' };
  }
  if (capacity < event.registrations.length) {
    return {
      ok: false,
      error: `El cupo (${capacity}) no puede ser menor a los ${event.registrations.length} inscritos actuales.`,
    };
  }

  return {
    ok: true,
    event: {
      ...event,
      title,
      location,
      date,
      description,
      capacity,
      status,
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

export function markAttendanceByStudentCode(event, studentCode) {
  const code = normalizeText(studentCode);
  if (!code) {
    return { ok: false, error: 'Ingresa un código de estudiante válido.' };
  }

  const registration = event.registrations.find(
    (item) => item.studentCode.toLowerCase() === code.toLowerCase()
  );

  if (!registration) {
    return {
      ok: false,
      error: `El código "${code}" no está inscrito en este evento.`,
      status: 'not_found',
    };
  }

  if (registration.attended) {
    return {
      ok: false,
      error: `El estudiante ${registration.name} (${registration.studentCode}) ya tiene asistencia registrada.`,
      status: 'already_attended',
      registration,
    };
  }

  const now = new Date().toISOString();
  const registrations = event.registrations.map((item) => {
    if (item.id !== registration.id) return item;
    return {
      ...item,
      attended: true,
      attendedAt: now,
    };
  });

  const updatedRegistration = {
    ...registration,
    attended: true,
    attendedAt: now,
  };

  return {
    ok: true,
    status: 'marked',
    event: { ...event, registrations },
    registration: updatedRegistration,
  };
}

