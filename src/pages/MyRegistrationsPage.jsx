import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle.jsx';
import Flash from '../components/Flash.jsx';
import StudentTicketModal from '../components/StudentTicketModal.jsx';
import { useEvents } from '../context/EventsContext.jsx';
import { useSession } from '../context/SessionContext.jsx';
import { isRegistered, getRegistration } from '../lib/events.js';

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function MyRegistrationsPage() {
  const { events, unenrollCurrentStudent } = useEvents();
  const { role, student } = useSession();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [eventToCancel, setEventToCancel] = useState(null);

  if (role !== 'student' || !student) {
    return (
      <>
        <Flash />
        <PageTitle>Mis Inscripciones</PageTitle>
        <div className="empty-state">
          <p>Esta sección es exclusiva para el rol Estudiante.</p>
          <p className="meta__value">Usa la barra superior de demo para cambiar al rol Estudiante.</p>
          <Link className="btn btn--secondary" to="/">
            Volver al inicio
          </Link>
        </div>
      </>
    );
  }

  // Filter events where student is registered
  const myEvents = events.filter((event) => isRegistered(event, student.code));

  const handleConfirmCancel = () => {
    if (!eventToCancel) return;
    unenrollCurrentStudent(eventToCancel.id);
    setEventToCancel(null);
  };

  return (
    <>
      <Flash />
      <PageTitle>Mis Inscripciones</PageTitle>

      <div className="my-registrations-intro">
        <p>
          Eventos registrados para <strong>{student.name}</strong> (Código: {student.code}).
        </p>
      </div>

      {myEvents.length === 0 ? (
        <div className="empty-state">
          <p>Aún no te has inscrito en ningún evento.</p>
          <Link className="btn btn--primary" to="/">
            Explorar eventos disponibles
          </Link>
        </div>
      ) : (
        <div className="my-registrations-grid">
          {myEvents.map((event) => {
            const registration = getRegistration(event, student.code);
            return (
              <article key={event.id} className="card card--my-registration">
                <div className="card__band">
                  <span>Fecha: {formatDate(event.date)}</span>
                  {registration?.attended ? (
                    <span className="badge badge--success">✓ Asistió</span>
                  ) : (
                    <span className="badge badge--pending">Inscrito</span>
                  )}
                </div>

                <div className="card__body">
                  <h3 className="card__title">{event.title}</h3>
                  <ul className="meta">
                    <li>
                      <span className="meta__label">Lugar: </span>
                      <span className="meta__value">{event.location}</span>
                    </li>
                    <li>
                      <span className="meta__label">Inscripción: </span>
                      <span className="meta__value">
                        {registration?.createdAt ? formatDate(registration.createdAt) : 'Registrado'}
                      </span>
                    </li>
                  </ul>

                  <div className="my-registration__actions">
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={() =>
                        setSelectedTicket({
                          event,
                          student,
                          registration,
                        })
                      }
                    >
                      Pase Digital (QR)
                    </button>

                    <button
                      type="button"
                      className="btn btn--danger-outline"
                      onClick={() => setEventToCancel(event)}
                    >
                      Cancelar cupo
                    </button>

                    <Link to={`/events/${event.id}`} className="btn btn--secondary">
                      Ver evento
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal Pase Digital con QR */}
      {selectedTicket && (
        <StudentTicketModal
          event={selectedTicket.event}
          student={selectedTicket.student}
          registration={selectedTicket.registration}
          onClose={() => setSelectedTicket(null)}
        />
      )}

      {/* Modal Confirmación de Cancelación */}
      {eventToCancel && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-cancel-title"
          onClick={() => setEventToCancel(null)}
        >
          <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
            <h3 id="confirm-cancel-title" className="modal-confirm__title">
              ¿Cancelar tu inscripción?
            </h3>
            <p className="modal-confirm__text">
              Vas a cancelar tu inscripción para <strong>{eventToCancel.title}</strong>. Tu cupo
              se liberará de inmediato para que otro compañero pueda inscribirse.
            </p>
            <div className="modal-confirm__actions">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setEventToCancel(null)}
              >
                Volver
              </button>
              <button
                type="button"
                className="btn btn--danger"
                onClick={handleConfirmCancel}
              >
                Sí, liberar mi cupo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
