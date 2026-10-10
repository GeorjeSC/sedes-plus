import { Link } from 'react-router-dom';
import CapacityBar from './CapacityBar.jsx';
import { useSession } from '../context/SessionContext.jsx';
import {
  isFull,
  spotsLeft,
  isRegistered,
  isInWaitlist,
  getWaitlistPosition,
} from '../lib/events.js';

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (number) => String(number).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function EventCard({ event }) {
  const { role, student } = useSession();
  const registered = event.registrations?.length || 0;
  const waitlistCount = event.waitlist?.length || 0;
  const left = spotsLeft(event);
  const full = isFull(event);

  const studentEnrolled = role === 'student' && student && isRegistered(event, student.code);
  const studentWaitlisted = role === 'student' && student && isInWaitlist(event, student.code);
  const waitlistPos = studentWaitlisted ? getWaitlistPosition(event, student.code) : null;

  return (
    <article className="card card--event">
      <div className="card__band">
        <span>Fecha: {formatDate(event.date)}</span>
        {event.status === 'finished' && <span className="badge badge--warning">Finalizado</span>}
        {event.status === 'cancelled' && <span className="badge badge--danger">Cancelado</span>}
        {studentEnrolled && <span className="badge badge--success">✓ Inscrito</span>}
        {studentWaitlisted && (
          <span className="badge badge--warning">⏳ Espera #{waitlistPos}</span>
        )}
      </div>
      <div className="card__body">
        <h2 className="card__title">{event.title}</h2>
        <ul className="meta">
          <li>
            <span className="meta__label">Lugar: </span>
            <span className="meta__value">{event.location}</span>
          </li>
          <li>
            <span className="meta__label">Cupo: </span>
            <span className="meta__value">
              {registered} de {event.capacity}
            </span>
          </li>
          <li>
            <span className="meta__label">Disponibles: </span>
            <span className="meta__value">
              {full ? 'Sin cupos' : `${left} cupo${left === 1 ? '' : 's'}`}
            </span>
          </li>
          {waitlistCount > 0 && (
            <li>
              <span className="meta__label">Lista de espera: </span>
              <span className="meta__value">
                {waitlistCount} alumno{waitlistCount === 1 ? '' : 's'} en cola
              </span>
            </li>
          )}
        </ul>
        <CapacityBar event={event} />
        <Link className="btn btn--secondary btn--block" to={`/events/${event.id}`}>
          Ver evento
        </Link>
      </div>
    </article>
  );
}
