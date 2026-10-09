import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle.jsx';
import Flash from '../components/Flash.jsx';
import EventCard from '../components/EventCard.jsx';
import { useEvents } from '../context/EventsContext.jsx';
import { useSession } from '../context/SessionContext.jsx';

export default function EventsListPage() {
  const { events } = useEvents();
  const { role } = useSession();

  return (
    <>
      <Flash />
      <PageTitle>Eventos</PageTitle>

      {events.length === 0 ? (
        <div className="empty-state">
          <p>Todavía no hay eventos.</p>
          {role === 'organizer' && (
            <Link className="btn btn--primary" to="/events/new">
              Crea el primero
            </Link>
          )}
        </div>
      ) : (
        <>
          {role === 'organizer' && (
            <div className="page-actions">
              <Link className="btn btn--primary" to="/events/new">
                Crear evento
              </Link>
            </div>
          )}
          <div className="events-grid">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
