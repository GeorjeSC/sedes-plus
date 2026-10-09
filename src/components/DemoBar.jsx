import { useSession } from '../context/SessionContext.jsx';

export default function DemoBar() {
  const { role, setRole, students, student, setStudentCode } = useSession();

  return (
    <div className="demo-bar">
      <div className="demo-bar__inner">
        <span className="demo-bar__label">Modo demo: simula la sesión del intranet</span>
        <div className="demo-bar__controls">
          <div className="demo-bar__roles" role="group" aria-label="Rol de la sesión">
            <button
              type="button"
              className="demo-bar__role"
              aria-pressed={role === 'student'}
              onClick={() => setRole('student')}
            >
              Estudiante
            </button>
            <button
              type="button"
              className="demo-bar__role"
              aria-pressed={role === 'organizer'}
              onClick={() => setRole('organizer')}
            >
              Organizador
            </button>
          </div>
          {role === 'student' && (
            <select
              className="demo-bar__student"
              aria-label="Estudiante de ejemplo"
              value={student?.code ?? ''}
              onChange={(event) => setStudentCode(event.target.value)}
            >
              {students.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
}
