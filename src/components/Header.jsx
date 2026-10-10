import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';
import { useEvents } from '../context/EventsContext.jsx';
import { isRegistered } from '../lib/events.js';

export default function Header() {
  const { role, student } = useSession();
  const { events } = useEvents();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);
  const userLabel = role === 'organizer' ? 'Organizador' : student?.name ?? 'Estudiante';

  const myEnrollmentCount =
    role === 'student' && student
      ? events.filter((event) => isRegistered(event, student.code)).length
      : 0;

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__brand" onClick={closeMenu}>
          <span className="header__brand-name">UCSS</span>
          <span className="header__divider" aria-hidden="true" />
          <span className="header__brand-sub">
            <strong>SEDES+</strong>
            <span>Eventos</span>
          </span>
        </Link>

        <button
          type="button"
          className="header__toggle"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          ☰
        </button>

        <nav className={`header__nav ${open ? 'header__nav--open' : ''}`}>
          <NavLink to="/" end className="header__link" onClick={closeMenu}>
            Inicio
          </NavLink>
          {role === 'student' && (
            <NavLink to="/my-registrations" className="header__link" onClick={closeMenu}>
              Mis inscripciones{myEnrollmentCount > 0 ? ` (${myEnrollmentCount})` : ''}
            </NavLink>
          )}
          {role === 'organizer' && (
            <NavLink to="/events/new" className="header__link" onClick={closeMenu}>
              Nuevo evento
            </NavLink>
          )}
          <span className="header__user">{userLabel}</span>
        </nav>
      </div>
    </header>
  );
}
