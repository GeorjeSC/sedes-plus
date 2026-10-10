import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle.jsx';
import Flash from '../components/Flash.jsx';
import EventCard from '../components/EventCard.jsx';
import { useEvents } from '../context/EventsContext.jsx';
import { useSession } from '../context/SessionContext.jsx';
import { isFull, spotsLeft } from '../lib/events.js';

export default function EventsListPage() {
  const { events } = useEvents();
  const { role } = useSession();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'available', 'full', 'finished'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'spots', 'capacity'

  // Contadores para las pestañas
  const availableCount = events.filter((e) => !isFull(e) && e.status !== 'finished' && e.status !== 'cancelled').length;
  const fullCount = events.filter((e) => isFull(e) && e.status !== 'finished' && e.status !== 'cancelled').length;
  const finishedCount = events.filter((e) => e.status === 'finished' || e.status === 'cancelled').length;

  // Filtrado
  const filteredEvents = events.filter((event) => {
    // Filtro por estado
    if (statusFilter === 'available') {
      if (isFull(event) || event.status === 'finished' || event.status === 'cancelled') return false;
    } else if (statusFilter === 'full') {
      if (!isFull(event) || event.status === 'finished' || event.status === 'cancelled') return false;
    } else if (statusFilter === 'finished') {
      if (event.status !== 'finished' && event.status !== 'cancelled') return false;
    }

    // Búsqueda por texto (título, lugar, descripción)
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      const matchTitle = event.title.toLowerCase().includes(q);
      const matchLoc = event.location.toLowerCase().includes(q);
      const matchDesc = (event.description || '').toLowerCase().includes(q);
      if (!matchTitle && !matchLoc && !matchDesc) return false;
    }

    return true;
  });

  // Ordenamiento
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === 'date') {
      return a.date.localeCompare(b.date);
    }
    if (sortBy === 'spots') {
      return spotsLeft(b) - spotsLeft(a);
    }
    if (sortBy === 'capacity') {
      return b.capacity - a.capacity;
    }
    return 0;
  });

  return (
    <>
      <Flash />
      <PageTitle>Eventos Universitarios</PageTitle>

      {events.length === 0 ? (
        <div className="empty-state">
          <p>Todavía no hay eventos registrados.</p>
          {role === 'organizer' && (
            <Link className="btn btn--primary" to="/events/new">
              Crea el primer evento
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Barra de control superior: Búsqueda, Filtros y Nuevo Evento */}
          <div className="events-control-bar">
            <div className="events-search-box">
              <input
                type="search"
                className="search-input"
                placeholder="Buscar por título, aula o facultad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Buscar eventos"
              />
            </div>

            <div className="events-actions-row">
              <div className="sort-box">
                <label htmlFor="sort-select" className="sort-label">
                  Ordenar por:
                </label>
                <select
                  id="sort-select"
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Próxima Fecha</option>
                  <option value="spots">Más Cupos Libres</option>
                  <option value="capacity">Mayor Capacidad</option>
                </select>
              </div>

              {role === 'organizer' && (
                <Link className="btn btn--primary" to="/events/new">
                  + Nuevo Evento
                </Link>
              )}
            </div>
          </div>

          {/* Filtros por pestaña de estado */}
          <div className="filter-tabs" role="tablist" aria-label="Filtrar eventos por estado">
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === 'all'}
              className={`filter-tab ${statusFilter === 'all' ? 'filter-tab--active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              Todos ({events.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === 'available'}
              className={`filter-tab ${statusFilter === 'available' ? 'filter-tab--active' : ''}`}
              onClick={() => setStatusFilter('available')}
            >
              Con cupos ({availableCount})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === 'full'}
              className={`filter-tab ${statusFilter === 'full' ? 'filter-tab--active' : ''}`}
              onClick={() => setStatusFilter('full')}
            >
              Llenos ({fullCount})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === 'finished'}
              className={`filter-tab ${statusFilter === 'finished' ? 'filter-tab--active' : ''}`}
              onClick={() => setStatusFilter('finished')}
            >
              Finalizados ({finishedCount})
            </button>
          </div>

          {sortedEvents.length === 0 ? (
            <div className="empty-filter-state">
              <p>No se encontraron eventos que coincidan con la búsqueda o filtro.</p>
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="events-grid">
              {sortedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
