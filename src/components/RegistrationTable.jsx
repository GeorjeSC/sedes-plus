import { useState } from 'react';
import { useEvents } from '../context/EventsContext.jsx';
import { exportAttendanceToCSV } from '../lib/attendance.js';

function formatTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function RegistrationTable({ event }) {
  const { toggleAttendance } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('all'); // 'all', 'attended', 'pending'

  const rawRegistrations = [...(event.registrations || [])].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt)
  );

  const attendedCount = rawRegistrations.filter((r) => r.attended).length;
  const pendingCount = rawRegistrations.length - attendedCount;

  // Filtrado compuesto: búsqueda + pestaña
  const filtered = rawRegistrations.filter((item) => {
    const matchesFilter =
      filterState === 'all' ||
      (filterState === 'attended' && item.attended) ||
      (filterState === 'pending' && !item.attended);

    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      item.name.toLowerCase().includes(term) ||
      item.studentCode.toLowerCase().includes(term);

    return matchesFilter && matchesSearch;
  });

  if (rawRegistrations.length === 0) {
    return <p className="reg-table__empty">Todavía no hay inscritos en este evento.</p>;
  }

  return (
    <div className="registration-table-wrapper">
      {/* Barra de herramientas: Búsqueda y Exportación */}
      <div className="table-toolbar">
        <div className="table-toolbar__search">
          <input
            type="search"
            className="search-input"
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar en la lista de inscritos"
          />
        </div>

        <div className="table-toolbar__actions">
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() => exportAttendanceToCSV(event)}
            title="Descargar acta de asistencia en formato compatible con Excel"
          >
            Exportar CSV / Excel
          </button>
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() => window.print()}
            title="Imprimir el acta oficial de asistencia"
          >
            Imprimir Acta
          </button>
        </div>
      </div>

      {/* Pestañas de filtrado de asistencia */}
      <div className="filter-tabs" role="tablist" aria-label="Filtrar por estado de asistencia">
        <button
          type="button"
          role="tab"
          aria-selected={filterState === 'all'}
          className={`filter-tab ${filterState === 'all' ? 'filter-tab--active' : ''}`}
          onClick={() => setFilterState('all')}
        >
          Todos ({rawRegistrations.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filterState === 'attended'}
          className={`filter-tab ${filterState === 'attended' ? 'filter-tab--active' : ''}`}
          onClick={() => setFilterState('attended')}
        >
          Presentes ({attendedCount})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filterState === 'pending'}
          className={`filter-tab ${filterState === 'pending' ? 'filter-tab--active' : ''}`}
          onClick={() => setFilterState('pending')}
        >
          Pendientes ({pendingCount})
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-filter-state">
          <p>No se encontraron inscritos con los filtros aplicados.</p>
        </div>
      ) : (
        <table className="reg-table">
          <thead>
            <tr>
              <th scope="col">Nº</th>
              <th scope="col">Nombre</th>
              <th scope="col">Código UCSS</th>
              <th scope="col">Asistencia</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((registration, index) => (
              <tr key={registration.id}>
                <td data-label="Nº">{index + 1}</td>
                <td data-label="Nombre">{registration.name}</td>
                <td data-label="Código">{registration.studentCode}</td>
                <td data-label="Asistencia">
                  <label className="attendance">
                    <input
                      type="checkbox"
                      checked={registration.attended}
                      onChange={() => toggleAttendance(event.id, registration.id)}
                      aria-label={`Asistencia de ${registration.name}`}
                    />
                    <span
                      className={
                        registration.attended ? 'attendance__status' : 'attendance__pending'
                      }
                    >
                      {registration.attended
                        ? `Asistió ${registration.attendedAt ? `(${formatTime(registration.attendedAt)})` : ''}`
                        : 'Pendiente'}
                    </span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
