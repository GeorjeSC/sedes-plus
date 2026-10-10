import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../context/EventsContext.jsx';
import { useSession } from '../context/SessionContext.jsx';
import { isRegistered, isInWaitlist, getWaitlistPosition, spotsLeft } from '../lib/events.js';

export default function NotificationsCenter() {
  const { events } = useEvents();
  const { role, student } = useSession();
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState(new Set());
  const dropdownRef = useRef(null);

  // Cerrar al hacer clic afuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generar notificaciones dinámicas basadas en eventos y estado del usuario
  const notifications = [];

  if (role === 'student' && student) {
    // 1. Recordatorios de eventos inscritos
    events.forEach((ev) => {
      if (isRegistered(ev, student.code)) {
        notifications.push({
          id: `reminder-${ev.id}`,
          type: 'reminder',
          title: 'Recordatorio de Evento',
          message: `Estás inscrito en "${ev.title}". Recuerda presentar tu comprobante de ingreso en ${ev.location}.`,
          time: 'Próximamente',
          link: `/events/${ev.id}`,
        });
      }
    });

    // 2. Avisos de Lista de Espera
    events.forEach((ev) => {
      if (isInWaitlist(ev, student.code)) {
        const pos = getWaitlistPosition(ev, student.code);
        notifications.push({
          id: `waitlist-${ev.id}`,
          type: 'waitlist',
          title: 'Estado de Lista de Espera',
          message: `Ocupas el Turno #${pos} en "${ev.title}". Si un alumno cancela, se te asignará el cupo de inmediato.`,
          time: 'En espera activa',
          link: `/events/${ev.id}`,
        });
      }
    });

    // 3. Alertas de aforos con pocos cupos
    events.forEach((ev) => {
      const left = spotsLeft(ev);
      if (left > 0 && left <= 3 && !isRegistered(ev, student.code) && !isInWaitlist(ev, student.code)) {
        notifications.push({
          id: `low-spots-${ev.id}`,
          type: 'alert',
          title: '¡Últimos Cupos Disponibles!',
          message: `Solo quedan ${left} cupos para "${ev.title}". ¡Asegura tu lugar ahora!`,
          time: 'Atención',
          link: `/events/${ev.id}`,
        });
      }
    });
  } else if (role === 'organizer') {
    // Notificaciones para organizador
    events.forEach((ev) => {
      const waitlistCount = (ev.waitlist || []).length;
      if (waitlistCount > 0) {
        notifications.push({
          id: `org-waitlist-${ev.id}`,
          type: 'waitlist',
          title: 'Lista de Espera Activa',
          message: `Hay ${waitlistCount} estudiante(s) esperando cupo en "${ev.title}".`,
          time: 'Gestión',
          link: `/events/${ev.id}`,
        });
      }
    });
  }

  // Notificación institucional general
  notifications.push({
    id: 'general-emplea-ucss',
    type: 'info',
    title: 'Emplea UCSS: Convocatoria Abierta',
    message: 'Participa en el Taller Gratuito de LinkedIn & Networking Profesional para potenciar tu empleabilidad.',
    time: 'Institucional',
    link: '/',
  });

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  const markAllAsRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  return (
    <div className="notifications-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className="notifications-bell"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Centro de notificaciones y recordatorios"
        aria-expanded={open}
      >
        <span className="bell-icon" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
          </svg>
        </span>
        {unreadCount > 0 && <span className="notifications-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notifications-dropdown">
          <header className="notifications-dropdown__header">
            <div>
              <strong className="notifications-title">Centro de Notificaciones</strong>
              <span className="notifications-sub">Recordatorios y alertas universitarias</span>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                className="btn-mark-read"
                onClick={markAllAsRead}
              >
                Leídas
              </button>
            )}
          </header>

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <p className="notifications-empty">No tienes notificaciones pendientes.</p>
            ) : (
              notifications.map((item) => {
                const isRead = readIds.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={`notification-item notification-item--${item.type} ${
                      isRead ? 'notification-item--read' : ''
                    }`}
                  >
                    <div className="notification-item__head">
                      <span className="notification-item__title">{item.title}</span>
                      <span className="notification-item__time">{item.time}</span>
                    </div>
                    <p className="notification-item__message">{item.message}</p>
                    <Link
                      to={item.link}
                      className="notification-item__link"
                      onClick={() => setOpen(false)}
                    >
                      Ver detalles →
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
