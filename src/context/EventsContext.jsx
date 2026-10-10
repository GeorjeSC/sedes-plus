import { createContext, useContext, useEffect, useState } from 'react';
import { KEYS, readStorage, writeStorage } from '../lib/storage.js';
import seedEvents from '../data/seed.js';
import {
  createEvent as createEventRule,
  addRegistration,
  removeRegistration,
  toggleAttendance as toggleAttendanceRule,
} from '../lib/events.js';
import { useSession } from './SessionContext.jsx';

const EventsContext = createContext(null);

function getInitialEvents() {
  const stored = readStorage(KEYS.events, null);
  if (Array.isArray(stored)) return stored;
  return seedEvents;
}

export function EventsProvider({ children }) {
  const { role, student } = useSession();
  const [events, setEvents] = useState(getInitialEvents);
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    writeStorage(KEYS.events, events);
  }, [events]);

  useEffect(() => {
    if (!flash) return undefined;
    const timer = window.setTimeout(() => setFlash(null), 4000);
    return () => window.clearTimeout(timer);
  }, [flash]);

  function notify(type, message) {
    setFlash({ type, message });
  }

  function getEvent(id) {
    return events.find((event) => event.id === id) ?? null;
  }

  function createEvent(data) {
    if (role !== 'organizer') {
      return { ok: false, error: 'Solo el organizador puede crear eventos' };
    }
    const result = createEventRule(data);
    if (!result.ok) return result;
    setEvents((prev) => [...prev, result.event]);
    notify('success', 'Evento creado');
    return { ok: true, event: result.event };
  }

  function registerCurrentStudent(eventId) {
    if (role !== 'student') {
      return { ok: false, error: 'Solo los estudiantes pueden inscribirse' };
    }
    const current = events.find((event) => event.id === eventId);
    if (!current) {
      return { ok: false, error: 'No encontramos este evento' };
    }
    const result = addRegistration(current, student);
    if (!result.ok) {
      notify('error', result.error);
      return result;
    }
    setEvents((prev) => prev.map((event) => (event.id === eventId ? result.event : event)));
    notify('success', 'Te inscribiste en el evento');
    return { ok: true, event: result.event };
  }

  function unenrollCurrentStudent(eventId) {
    if (role !== 'student' || !student) {
      return { ok: false, error: 'Solo los estudiantes pueden cancelar inscripciones' };
    }
    const current = events.find((event) => event.id === eventId);
    if (!current) {
      return { ok: false, error: 'No encontramos este evento' };
    }
    const result = removeRegistration(current, student.code);
    if (!result.ok) {
      notify('error', result.error);
      return result;
    }
    setEvents((prev) => prev.map((event) => (event.id === eventId ? result.event : event)));
    notify('success', 'Inscripción cancelada. Se liberó tu cupo.');
    return { ok: true, event: result.event };
  }

  function toggleAttendance(eventId, registrationId) {
    if (role !== 'organizer') {
      return { ok: false, error: 'Solo el organizador puede marcar la asistencia' };
    }
    const current = events.find((event) => event.id === eventId);
    if (!current) {
      return { ok: false, error: 'No encontramos este evento' };
    }
    const updated = toggleAttendanceRule(current, registrationId);
    setEvents((prev) => prev.map((event) => (event.id === eventId ? updated : event)));
    const registration = updated.registrations.find((item) => item.id === registrationId);
    notify('success', registration?.attended ? 'Asistencia registrada' : 'Asistencia retirada');
    return { ok: true, event: updated };
  }

  const value = {
    events,
    getEvent,
    createEvent,
    registerCurrentStudent,
    unenrollCurrentStudent,
    toggleAttendance,
    flash,
    notify,
  };

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents debe usarse dentro de EventsProvider');
  }
  return context;
}
