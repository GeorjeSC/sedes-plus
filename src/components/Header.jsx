import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';
import { useEvents } from '../context/EventsContext.jsx';
import { isRegistered } from '../lib/events.js';
import NotificationsCenter from './NotificationsCenter.jsx';

export default function Header() {
  const { role, student, logout } = useSession();
  const { events } = useEvents();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  const myEnrollmentCount =
    role === 'student' && student
      ? events.filter((event) => isRegistered(event, student.code)).length
      : 0;

  const studentName = role === 'organizer' ? 'ORGANIZADOR' : student?.name || 'Ana Torres Quispe';
  const studentCode = role === 'organizer' ? 'COORDINACIÓN ACADÉMICA' : `${student?.code || '20211234'} - UCSS`;
  const studentCareer = role === 'organizer' ? 'DIRECCIÓN DE EVENTOS' : 'PREGRADO ESTUDIANTES';

  return (
    <header className="header ucss-intranet-header">
      <div className="header__inner">
        {/* Marca UCSS Oficial (Sello de alta resolución + barra divisoria + texto nítido) */}
        <Link to="/" className="header__brand" onClick={closeMenu}>
          <div className="header__brand-identity">
            <img
              src="/ucss-seal-crisp.png"
              alt="Sello Oficial UCSS"
              className="header__brand-seal-img"
            />
            <span className="header__brand-acronym">UCSS</span>
          </div>
          <div className="header__brand-vseparator" aria-hidden="true" />
          <div className="header__brand-portal-text">
            <span className="portal-text-title">INTRANET</span>
            <span className="portal-text-sub">
              {role === 'organizer' ? 'ORGANIZADOR' : 'ESTUDIANTES'}
            </span>
          </div>
        </Link>

        {/* Botón responsive menú */}
        <button
          type="button"
          className="header__toggle"
          aria-label="Abrir menú de navegación"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          ☰
        </button>

        {/* Enlaces de Navegación del Intranet UCSS */}
        <nav className={`header__nav ${open ? 'header__nav--open' : ''}`}>
          <NavLink to="/" end className="header__link" onClick={closeMenu}>
            Inicio
          </NavLink>
          <span className="header__link header__link--dummy" title="Módulo del Intranet">
            Oferta académica
          </span>
          <span className="header__link header__link--dummy" title="Módulo del Intranet">
            Matrícula
          </span>
          <span className="header__link header__link--dummy" title="Módulo del Intranet">
            Cta. Cte.
          </span>
          <span className="header__link header__link--dummy" title="Módulo del Intranet">
            Horario
          </span>
          <span className="header__link header__link--dummy" title="Módulo del Intranet">
            Notas
          </span>

          {role === 'student' && (
            <NavLink to="/my-registrations" className="header__link" onClick={closeMenu}>
              Mis inscripciones{myEnrollmentCount > 0 ? ` (${myEnrollmentCount})` : ''}
            </NavLink>
          )}

          {role === 'organizer' && (
            <NavLink to="/events/new" className="header__link" onClick={closeMenu}>
              + Nuevo evento
            </NavLink>
          )}

          <button
            type="button"
            className="header__link header__link--exit"
            onClick={() => {
              closeMenu();
              logout();
            }}
            title="Cerrar sesión y volver al login del intranet"
          >
            Salir
          </button>
        </nav>

        {/* Panel derecho: Centro de Notificaciones + Perfil de Estudiante */}
        <div className="header__user-block">
          <NotificationsCenter />

          <div className="header__student-profile">
            <div className="header__student-info">
              <span className="header__student-name">{studentName}</span>
              <span className="header__student-meta">{studentCode}</span>
              <span className="header__student-career">{studentCareer}</span>
            </div>
            <div className="header__student-avatar" aria-hidden="true">
              <span>{studentName.charAt(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
