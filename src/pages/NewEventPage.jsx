import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle.jsx';
import Flash from '../components/Flash.jsx';
import { useSession } from '../context/SessionContext.jsx';
import { useEvents } from '../context/EventsContext.jsx';

const EMPTY_VALUES = {
  title: '',
  description: '',
  date: '',
  location: '',
  capacity: '',
};

export default function NewEventPage() {
  const { role } = useSession();
  const { createEvent, notify } = useEvents();
  const navigate = useNavigate();
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});

  if (role !== 'organizer') {
    return (
      <>
        <Flash />
        <PageTitle>Nuevo evento</PageTitle>
        <div className="empty-state">
          <p>Solo el organizador puede crear eventos.</p>
          <Link className="btn btn--secondary" to="/">
            Volver a la lista
          </Link>
        </div>
      </>
    );
  }

  function updateField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!values.title.trim()) nextErrors.title = 'Escribe el título del evento';
    if (!values.date) nextErrors.date = 'Elige la fecha y hora del evento';
    if (!values.location.trim()) nextErrors.location = 'Escribe el lugar del evento';
    const capacity = Number(values.capacity);
    if (!values.capacity.trim() || !Number.isInteger(capacity) || capacity <= 0) {
      nextErrors.capacity = 'El cupo debe ser un número entero mayor que 0';
    }
    return nextErrors;
  }

  function handleSubmit(domEvent) {
    domEvent.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const result = createEvent({ ...values, capacity: Number(values.capacity) });
    if (!result.ok) {
      notify('error', result.error);
      return;
    }
    navigate('/');
  }

  return (
    <>
      <Flash />
      <PageTitle>Nuevo evento</PageTitle>
      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="title">Título</label>
          <input
            id="title"
            type="text"
            value={values.title}
            onChange={(event) => updateField('title', event.target.value)}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          {errors.title && (
            <p className="field__error" id="title-error">
              {errors.title}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="date">Fecha y hora</label>
          <input
            id="date"
            type="datetime-local"
            value={values.date}
            onChange={(event) => updateField('date', event.target.value)}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? 'date-error' : undefined}
          />
          {errors.date && (
            <p className="field__error" id="date-error">
              {errors.date}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="location">Lugar</label>
          <input
            id="location"
            type="text"
            value={values.location}
            onChange={(event) => updateField('location', event.target.value)}
            aria-invalid={Boolean(errors.location)}
            aria-describedby={errors.location ? 'location-error' : undefined}
          />
          {errors.location && (
            <p className="field__error" id="location-error">
              {errors.location}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="capacity">Cupo</label>
          <input
            id="capacity"
            type="number"
            min="1"
            step="1"
            value={values.capacity}
            onChange={(event) => updateField('capacity', event.target.value)}
            aria-invalid={Boolean(errors.capacity)}
            aria-describedby={errors.capacity ? 'capacity-error' : undefined}
          />
          {errors.capacity && (
            <p className="field__error" id="capacity-error">
              {errors.capacity}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="description">Descripción (opcional)</label>
          <textarea
            id="description"
            value={values.description}
            onChange={(event) => updateField('description', event.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn--primary">
            Crear evento
          </button>
          <Link className="btn btn--secondary" to="/">
            Cancelar
          </Link>
        </div>
      </form>
    </>
  );
}
