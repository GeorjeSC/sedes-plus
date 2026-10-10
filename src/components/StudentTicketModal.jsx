import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

function formatEventDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function StudentTicketModal({ event, student, registration, onClose }) {
  const [qrSrc, setQrSrc] = useState('');

  useEffect(() => {
    if (!event || !student) return;

    const payload = JSON.stringify({
      app: 'SEDES+',
      inst: 'UCSS',
      eventId: event.id,
      title: event.title,
      code: student.code,
      name: student.name,
      registeredAt: registration?.createdAt || new Date().toISOString(),
    });

    QRCode.toDataURL(payload, {
      width: 220,
      margin: 1,
      color: {
        dark: '#212529',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrSrc(url))
      .catch((err) => console.error('Error generando QR:', err));
  }, [event, student, registration]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!event || !student) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-title"
      onClick={onClose}
    >
      <div
        className="modal-content ticket-card"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="ticket-header">
          <button
            type="button"
            className="ticket-header__close-btn no-print"
            onClick={onClose}
            aria-label="Cerrar ventana"
            title="Cerrar (Esc)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
            </svg>
          </button>
          <div className="ticket-header__ucss">UCSS • SEDES+</div>
          <h2 id="ticket-title" className="ticket-header__title">
            Pase Digital de Ingreso
          </h2>
          <span className="ticket-header__subtitle">Comprobante Oficial de Inscripción</span>
        </header>

        <div className="ticket-body">
          <div className="ticket-section">
            <span className="ticket-label">Evento</span>
            <div className="ticket-event-name">{event.title}</div>
          </div>

          <div className="ticket-grid">
            <div className="ticket-field">
              <span className="ticket-label">Fecha y Hora</span>
              <strong className="ticket-value">{formatEventDate(event.date)}</strong>
            </div>
            <div className="ticket-field">
              <span className="ticket-label">Lugar / Aula</span>
              <strong className="ticket-value">{event.location}</strong>
            </div>
            <div className="ticket-field">
              <span className="ticket-label">Estudiante</span>
              <strong className="ticket-value">{student.name}</strong>
            </div>
            <div className="ticket-field">
              <span className="ticket-label">Código UCSS</span>
              <strong className="ticket-value">{student.code}</strong>
            </div>
          </div>

          <div className="ticket-status-box">
            <span className="ticket-label">Estado de Asistencia</span>
            {registration?.attended ? (
              <span className="badge badge--success">✓ ASISTENCIA REGISTRADA</span>
            ) : (
              <span className="badge badge--pending">⏳ PENDIENTE DE INGRESO</span>
            )}
          </div>

          <div className="ticket-qr-container">
            {qrSrc ? (
              <img src={qrSrc} alt="Código QR de Pase Digital" className="ticket-qr-image" />
            ) : (
              <div className="ticket-qr-placeholder">Generando QR...</div>
            )}
            <p className="ticket-qr-help">Muestra este código al organizador en el ingreso</p>
          </div>
        </div>

        <footer className="ticket-footer no-print">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => window.print()}
          >
            Imprimir / Guardar
          </button>
          <button type="button" className="btn btn--primary" onClick={onClose}>
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
}
