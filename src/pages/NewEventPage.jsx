import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle.jsx';
import Flash from '../components/Flash.jsx';
import { useSession } from '../context/SessionContext.jsx';

export default function NewEventPage() {
  const { role } = useSession();

  if (role !== 'organizer') {
    return (
      <>
        <Flash />
        <PageTitle>Nuevo evento</PageTitle>
        <div className="empty-state">
          <p>Solo el organizador puede crear eventos.</p>
          <Link className="btn btn--secondary" to="/">
            Volver a la lista
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Flash />
      <PageTitle>Nuevo evento</PageTitle>
      <div className="empty-state">
        <p>El formulario para crear un evento se agrega en el siguiente paso.</p>
      </div>
    </>
  );
}
