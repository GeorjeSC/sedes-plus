import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';

export default function Header() {
  const { role, student } = useSession();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);
  const userLabel = role === 'organizer' ? 'Organizador' : student?.name ?? 'Estudiante';

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
