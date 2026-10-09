import { Link, useParams } from 'react-router-dom';
import PageTitle from '../components/PageTitle.jsx';
import Flash from '../components/Flash.jsx';
import CapacityBar from '../components/CapacityBar.jsx';
import EnrollButton from '../components/EnrollButton.jsx';
import { useEvents } from '../context/EventsContext.jsx';
import { useSession } from '../context/SessionContext.jsx';
import { isFull, spotsLeft } from '../lib/events.js';

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (number) => String(number).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function EventDetailPage() {
  const { id } = useParams();
  const { getEvent } = useEvents();
  const { role } = useSession();
  const event = getEvent(id);

  if (!event) {
    return (
      <>
        <Flash />
        <PageTitle>Evento</PageTitle>
        <div className="empty-state">
          <p>No encontramos este evento.</p>
          <Link className="btn btn--secondary" to="/">
            Volver a la lista
          </Link>
        </div>
      </>
    );
  }

  const registered = event.registrations.length;
  const left = spotsLeft(event);
  const full = isFull(event);

  const info = (
    <div className="card">
      <div className="card__band">Fecha: {formatDate(event.date)}</div>
      <div className="card__body">
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
        {event.description && <p className="meta__value">{event.description}</p>}
        <EnrollButton event={event} />
      </div>
    </div>
  );

  return (
    <>
      <Flash />
      <PageTitle>{event.title}</PageTitle>
      <div className={`event-detail${role === 'organizer' ? '' : ' event-detail--single'}`}>
        {info}
      </div>
    </>
  );
}
