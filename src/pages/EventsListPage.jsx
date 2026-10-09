import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle.jsx';
import Flash from '../components/Flash.jsx';
import { useEvents } from '../context/EventsContext.jsx';

export default function EventsListPage() {
  const { events } = useEvents();

  return (
    <>
      <Flash />
      <PageTitle>Eventos</PageTitle>
      <div className="events-grid">
        {events.map((event) => (
          <div className="card" key={event.id}>
            <div className="card__body">
              <h2 className="card__title">{event.title}</h2>
              <p className="meta__value">
                {event.date} — {event.location}
              </p>
              <Link className="btn btn--secondary" to={`/events/${event.id}`}>
                Ver evento
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
