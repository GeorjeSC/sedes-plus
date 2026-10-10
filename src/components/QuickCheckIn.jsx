import { useState } from 'react';
import { useEvents } from '../context/EventsContext.jsx';

export default function QuickCheckIn({ event }) {
  const { checkInStudentByCode } = useEvents();
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState(null);

  const pendingStudents = (event.registrations || []).filter((r) => !r.attended);

  function handleProcessCode(codeToProcess) {
    if (!codeToProcess || !codeToProcess.trim()) return;

    let targetCode = codeToProcess.trim();

    // Soporte para procesar código de estudiante o comprobante
    if (targetCode.startsWith('{') && targetCode.endsWith('}')) {
      try {
        const parsed = JSON.parse(targetCode);
        if (parsed.code) {
          targetCode = parsed.code;
        }
      } catch {
        // Si no es JSON válido, continúa con el string directo
      }
    }

    const result = checkInStudentByCode(event.id, targetCode);

    if (result.ok) {
      setFeedback({
        type: 'success',
        title: '¡Acceso Permitido!',
        message: `Asistencia validada para ${result.registration.name} (Código: ${result.registration.studentCode}).`,
      });
      setInputVal('');
    } else {
      setFeedback({
        type: result.status === 'already_attended' ? 'warning' : 'danger',
        title: result.status === 'already_attended' ? 'Asistencia Previa' : 'Acceso Denegado',
        message: result.error,
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleProcessCode(inputVal);
  }

  return (
    <div className="card quick-checkin-card">
      <div className="card__band">Control de Ingreso en Puerta (Check-in)</div>
      <div className="card__body">
        <p className="quick-checkin-desc">
          Valida estudiantes al ingresar al aula escribiendo su código UCSS:
        </p>

        <form onSubmit={handleSubmit} className="quick-checkin-form">
          <div className="quick-checkin-input-wrapper">
            <input
              type="text"
              className="quick-checkin-input"
              placeholder="Ingresa código de estudiante (ej. 20211234)..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              aria-label="Código de estudiante para registrar ingreso"
            />
            <button type="submit" className="btn btn--primary">
              Validar Ingreso
            </button>
          </div>
        </form>

        {feedback && (
          <div className={`quick-checkin-feedback feedback--${feedback.type}`}>
            <div className="feedback__header">
              <strong>{feedback.title}</strong>
              <button
                type="button"
                className="feedback__close"
                onClick={() => setFeedback(null)}
                aria-label="Cerrar notificación"
              >
                ✕
              </button>
            </div>
            <p className="feedback__message">{feedback.message}</p>
          </div>
        )}

        {pendingStudents.length > 0 && (
          <div className="quick-shortcuts">
            <span className="quick-shortcuts__title">
              Atajo rápido (pendientes de ingresar):
            </span>
            <div className="quick-shortcuts__list">
              {pendingStudents.slice(0, 5).map((student) => (
                <button
                  key={student.id}
                  type="button"
                  className="quick-shortcut-btn"
                  onClick={() => handleProcessCode(student.studentCode)}
                  title={`Registrar asistencia de ${student.name}`}
                >
                  + {student.name.split(' ')[0]} ({student.studentCode})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
