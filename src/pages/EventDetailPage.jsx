import { Link, useParams } from 'react-router-dom';
import PageTitle from '../components/PageTitle.jsx';
import Flash from '../components/Flash.jsx';
import { useEvents } from '../context/EventsContext.jsx';

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
        <div className="card__band">Fecha: {event.date}</div>
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
          <p className="meta__value">{event.description}</p>
        </div>
      </div>
    </>
  );
}
