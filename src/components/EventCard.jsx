import { Link } from 'react-router-dom';
import CapacityBar from './CapacityBar.jsx';
import { isFull, spotsLeft } from '../lib/events.js';

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (number) => String(number).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function EventCard({ event }) {
  const registered = event.registrations.length;
  const left = spotsLeft(event);
  const full = isFull(event);

  return (
    <article className="card">
      <div className="card__band">Fecha: {formatDate(event.date)}</div>
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
        </ul>
        <CapacityBar event={event} />
        <Link className="btn btn--secondary btn--block" to={`/events/${event.id}`}>
          Ver evento
        </Link>
      </div>
    </article>
  );
}
