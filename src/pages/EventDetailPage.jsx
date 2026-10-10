import { Link, useParams } from 'react-router-dom';
import PageTitle from '../components/PageTitle.jsx';
import Flash from '../components/Flash.jsx';
import CapacityBar from '../components/CapacityBar.jsx';
import EnrollButton from '../components/EnrollButton.jsx';
import RegistrationTable from '../components/RegistrationTable.jsx';
import AttendanceMetrics from '../components/AttendanceMetrics.jsx';
import QuickCheckIn from '../components/QuickCheckIn.jsx';
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

      {/* Cabecera para impresión de Acta Oficial UCSS */}
      <div className="print-acta-header">
        <div className="print-acta-ucss">UNIVERSIDAD CATÓLICA SEDES SAPIENTIAE</div>
        <div className="print-acta-title">ACTA OFICIAL DE CONTROL DE ASISTENCIA</div>
        <div className="print-acta-meta">
          <div><strong>Evento:</strong> {event.title}</div>
          <div><strong>Fecha:</strong> {formatDate(event.date)}</div>
          <div><strong>Lugar:</strong> {event.location}</div>
          <div><strong>Aforo Total:</strong> {event.capacity}</div>
        </div>
      </div>

      <div className={`event-detail${role === 'organizer' ? '' : ' event-detail--single'}`}>
        <div className="event-detail__sidebar">
          {info}
          {role === 'organizer' && <QuickCheckIn event={event} />}
        </div>

        {role === 'organizer' && (
          <div className="event-detail__main">
            <div className="card">
              <div className="card__band">Panel de Asistencia y Aforo</div>
              <div className="card__body">
                <AttendanceMetrics event={event} />
                <RegistrationTable event={event} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pie de firmas para impresión oficial */}
      <div className="print-acta-signatures">
        <div className="signature-box">
          <div className="signature-line" />
          <span>Firma del Organizador del Evento</span>
        </div>
        <div className="signature-box">
          <div className="signature-line" />
          <span>Coordinación Académica UCSS</span>
        </div>
      </div>
    </>
  );
}
