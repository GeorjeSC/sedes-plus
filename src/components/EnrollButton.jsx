import { useState } from 'react';
import { useSession } from '../context/SessionContext.jsx';
import { useEvents } from '../context/EventsContext.jsx';
import {
  isFull,
  isRegistered,
  getRegistration,
  isInWaitlist,
  getWaitlistPosition,
} from '../lib/events.js';
import StudentTicketModal from './StudentTicketModal.jsx';

export default function EnrollButton({ event }) {
  const { role, student } = useSession();
  const {
    registerCurrentStudent,
    unenrollCurrentStudent,
    joinWaitlist,
    leaveWaitlist,
  } = useEvents();
  const [showTicket, setShowTicket] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  if (role !== 'student' || !student) return null;

  if (isRegistered(event, student.code)) {
    const registration = getRegistration(event, student.code);
    return (
      <div className="enroll-actions-group">
        <span className="enroll-tag" role="status">
          <span aria-hidden="true">✓</span> Estás inscrito
        </span>
        <div className="enroll-actions-buttons">
          <button
            type="button"
            className="btn btn--primary btn--block"
            onClick={() => setShowTicket(true)}
          >
            Ver comprobante de ingreso
          </button>
          <button
            type="button"
            className="btn btn--danger-outline btn--block"
            onClick={() => setShowConfirmCancel(true)}
          >
            Cancelar inscripción
          </button>
        </div>

        {showTicket && (
          <StudentTicketModal
            event={event}
            student={student}
            registration={registration}
            onClose={() => setShowTicket(false)}
          />
        )}

        {showConfirmCancel && (
          <div
            className="modal-backdrop"
            role="dialog"
            aria-modal="true"
            onClick={() => setShowConfirmCancel(false)}
          >
            <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-confirm__title">¿Cancelar tu inscripción?</h3>
              <p className="modal-confirm__text">
                Al cancelar, tu cupo en <strong>{event.title}</strong> quedará disponible para otro
                compañero.
              </p>
              <div className="modal-confirm__actions">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setShowConfirmCancel(false)}
                >
                  Volver
                </button>
                <button
                  type="button"
                  className="btn btn--danger"
                  onClick={() => {
                    unenrollCurrentStudent(event.id);
                    setShowConfirmCancel(false);
                  }}
                >
                  Sí, cancelar cupo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Estudiante en lista de espera
  if (isInWaitlist(event, student.code)) {
    const position = getWaitlistPosition(event, student.code);
    return (
      <div className="waitlist-status-box">
        <span className="badge badge--warning waitlist-badge">
          ⏳ En Lista de Espera (Turno #{position})
        </span>
        <p className="waitlist-hint">
          Si algún inscrito cancela su cupo, serás promovido automáticamente.
        </p>
        <button
          type="button"
          className="btn btn--secondary btn--block btn--sm"
          onClick={() => leaveWaitlist(event.id)}
        >
          Salir de la lista de espera
        </button>
      </div>
    );
  }

  // Evento lleno: opción inteligente de lista de espera
  if (isFull(event)) {
    const waitlistCount = (event.waitlist || []).length;
    return (
      <div className="event-full-box">
        <button type="button" className="btn btn--block btn--disabled-full" disabled>
          Evento lleno
        </button>
        <button
          type="button"
          className="btn btn--primary btn--block waitlist-join-btn"
          onClick={() => joinWaitlist(event.id)}
        >
          Anotarme en Lista de Espera {waitlistCount > 0 ? `(${waitlistCount} en cola)` : ''}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="btn btn--primary btn--block"
      onClick={() => registerCurrentStudent(event.id)}
    >
      Inscribirme
    </button>
  );
}
