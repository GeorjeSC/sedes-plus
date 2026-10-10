import { useState } from 'react';
import { useEvents } from '../context/EventsContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function EditEventModal({ event, onClose }) {
  const { updateEventDetails, deleteEvent } = useEvents();
  const navigate = useNavigate();

  const [title, setTitle] = useState(event.title || '');
  const [location, setLocation] = useState(event.location || '');
  const [date, setDate] = useState(event.date || '');
  const [capacity, setCapacity] = useState(String(event.capacity || 30));
  const [description, setDescription] = useState(event.description || '');
  const [status, setStatus] = useState(event.status || 'open');
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const registeredCount = event.registrations?.length || 0;

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const capNum = Number(capacity);
    if (!Number.isInteger(capNum) || capNum <= 0) {
      setError('El cupo debe ser un número entero mayor que 0.');
      return;
    }

    if (capNum < registeredCount) {
      setError(`El cupo no puede ser menor a los ${registeredCount} inscritos actuales.`);
      return;
    }

    const res = updateEventDetails(event.id, {
      title,
      location,
      date,
      capacity: capNum,
      description,
      status,
    });

    if (res.ok) {
      onClose();
    } else {
      setError(res.error);
    }
  }

  function handleDelete() {
    deleteEvent(event.id);
    navigate('/');
  }

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-event-title"
      onClick={onClose}
    >
      <div className="modal-content modal-edit-event" onClick={(e) => e.stopPropagation()}>
        <header className="modal-edit-header">
          <h2 id="edit-event-title" className="modal-edit-title">
            Editar Evento y Ciclo de Vida
          </h2>
          <button type="button" className="feedback__close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </header>

        {error && <div className="flash flash--error">{error}</div>}

        <form onSubmit={handleSubmit} className="form-edit-event">
          <div className="form-group">
            <label htmlFor="edit-title" className="form-label">
              Título del Evento *
            </label>
            <input
              id="edit-title"
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="edit-location" className="form-label">
                Lugar / Aula *
              </label>
              <input
                id="edit-location"
                type="text"
                className="form-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-capacity" className="form-label">
                Aforo Total (Mín. {registeredCount}) *
              </label>
              <input
                id="edit-capacity"
                type="number"
                min={registeredCount}
                className="form-input"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="edit-date" className="form-label">
                Fecha y Hora *
              </label>
              <input
                id="edit-date"
                type="datetime-local"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-status" className="form-label">
                Estado del Evento
              </label>
              <select
                id="edit-status"
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="open">Abierto para inscripciones</option>
                <option value="in_progress">En curso (en desarrollo)</option>
                <option value="finished">Finalizado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="edit-desc" className="form-label">
              Descripción o Instrucciones
            </label>
            <textarea
              id="edit-desc"
              rows={3}
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="modal-edit-footer">
            <button
              type="button"
              className="btn btn--danger-outline"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Eliminar evento
            </button>
            <div className="modal-edit-actions">
              <button type="button" className="btn btn--secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn--primary">
                Guardar cambios
              </button>
            </div>
          </div>
        </form>

        {showDeleteConfirm && (
          <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div className="modal-content modal-confirm">
              <h3 className="modal-confirm__title">¿Eliminar este evento?</h3>
              <p className="modal-confirm__text">
                Se borrarán todos los inscritos ({registeredCount}) y la lista de espera de{' '}
                <strong>{event.title}</strong>. Esta acción no se puede deshacer.
              </p>
              <div className="modal-confirm__actions">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancelar
                </button>
                <button type="button" className="btn btn--danger" onClick={handleDelete}>
                  Sí, eliminar definitivamente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
