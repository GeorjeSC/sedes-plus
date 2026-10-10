import { useState } from 'react';
import { useSession } from '../context/SessionContext.jsx';
import { useEvents } from '../context/EventsContext.jsx';
import { isFull, isRegistered, getRegistration } from '../lib/events.js';
import StudentTicketModal from './StudentTicketModal.jsx';

export default function EnrollButton({ event }) {
  const { role, student } = useSession();
  const { registerCurrentStudent, unenrollCurrentStudent } = useEvents();
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
            Ver pase digital (QR)
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
          <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div className="modal-content modal-confirm">
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

  if (isFull(event)) {
    return (
      <button type="button" className="btn btn--primary btn--block" disabled>
        Evento lleno
      </button>
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
