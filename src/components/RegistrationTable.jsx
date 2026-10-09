import { useEvents } from '../context/EventsContext.jsx';

export default function RegistrationTable({ event }) {
  const { toggleAttendance } = useEvents();
  const registrations = [...event.registrations].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  if (registrations.length === 0) {
    return <p className="reg-table__empty">Todavía no hay inscritos en este evento.</p>;
  }

  return (
    <table className="reg-table">
      <thead>
        <tr>
          <th scope="col">Nº</th>
          <th scope="col">Nombre</th>
          <th scope="col">Código</th>
          <th scope="col">Asistencia</th>
        </tr>
      </thead>
      <tbody>
        {registrations.map((registration, index) => (
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
                <span className={registration.attended ? 'attendance__status' : 'attendance__pending'}>
                  {registration.attended ? 'Asistió' : 'Pendiente'}
                </span>
              </label>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
