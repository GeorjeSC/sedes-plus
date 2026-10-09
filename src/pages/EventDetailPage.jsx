import { Link, useParams } from 'react-router-dom';
import PageTitle from '../components/PageTitle.jsx';
import Flash from '../components/Flash.jsx';
import { useEvents } from '../context/EventsContext.jsx';

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (number) => String(number).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function EventDetailPage() {
  const { id } = useParams();
  const { getEvent } = useEvents();
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

  return (
    <>
      <Flash />
      <PageTitle>{event.title}</PageTitle>
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
              <span className="meta__value">{event.capacity}</span>
            </li>
          </ul>
          {event.description && <p className="meta__value">{event.description}</p>}
        </div>
      </div>
    </>
  );
}
