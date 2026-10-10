import { calculateAttendanceMetrics } from '../lib/attendance.js';

export default function AttendanceMetrics({ event }) {
  const metrics = calculateAttendanceMetrics(event);

  return (
    <div className="attendance-metrics-container">
      <div className="attendance-metrics-grid">
        <div className="metric-card">
          <span className="metric-card__label">Inscritos / Aforo</span>
          <div className="metric-card__value">
            {metrics.registered} <span className="metric-card__total">/ {metrics.capacity}</span>
          </div>
          <span className="metric-card__sub">{metrics.occupancyRate}% aforo ocupado</span>
        </div>

        <div className="metric-card metric-card--highlight">
          <span className="metric-card__label">Asistentes en Puerta</span>
          <div className="metric-card__value metric-card__value--success">
            {metrics.attended} <span className="metric-card__total">/ {metrics.registered}</span>
          </div>
          <span className="metric-card__sub">{metrics.attendanceRate}% de asistencia efectiva</span>
        </div>

        <div className="metric-card">
          <span className="metric-card__label">Pendientes por Ingresar</span>
          <div className="metric-card__value metric-card__value--pending">
            {metrics.absent}
          </div>
          <span className="metric-card__sub">Inscritos aún no validados</span>
        </div>

        <div className="metric-card">
          <span className="metric-card__label">Cupos Libres</span>
          <div className="metric-card__value">
            {metrics.spotsRemaining}
          </div>
          <span className="metric-card__sub">
            {metrics.spotsRemaining === 0 ? 'Sin cupos disponibles' : 'Disponibles para registro'}
          </span>
        </div>
      </div>

      {metrics.registered > 0 && (
        <div className="attendance-progress-box">
          <div className="attendance-progress-header">
            <span>Progreso de Asistencia en Vivo:</span>
            <strong>{metrics.attended} de {metrics.registered} ({metrics.attendanceRate}%)</strong>
          </div>
          <div className="attendance-progress-bar" role="progressbar" aria-valuenow={metrics.attendanceRate} aria-valuemin="0" aria-valuemax="100">
            <div
              className="attendance-progress-bar__fill"
              style={{ width: `${metrics.attendanceRate}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
