import { useSession } from '../context/SessionContext.jsx';
import { useEvents } from '../context/EventsContext.jsx';
import { isFull, isRegistered } from '../lib/events.js';

export default function EnrollButton({ event }) {
  const { role, student } = useSession();
  const { registerCurrentStudent } = useEvents();

  if (role !== 'student' || !student) return null;

  if (isRegistered(event, student.code)) {
    return (
      <span className="enroll-tag" role="status">
        <span aria-hidden="true">✓</span> Estás inscrito
      </span>
    );
  }

  if (isFull(event)) {
    return (
      <button type="button" className="btn btn--primary btn--block" disabled>
        Evento lleno
      </button>
    );
  }

  return (
    <button
      type="button"
      className="btn btn--primary btn--block"
      onClick={() => registerCurrentStudent(event.id)}
    >
      Inscribirme
    </button>
  );
}
