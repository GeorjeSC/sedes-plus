import { Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import EventsListPage from './pages/EventsListPage.jsx';
import NewEventPage from './pages/NewEventPage.jsx';
import EventDetailPage from './pages/EventDetailPage.jsx';
import MyRegistrationsPage from './pages/MyRegistrationsPage.jsx';
import UcssLoginPage from './pages/UcssLoginPage.jsx';
import { useSession } from './context/SessionContext.jsx';

export default function App() {
  const { isLoggedIn } = useSession();

  if (!isLoggedIn) {
    return <UcssLoginPage />;
  }

  return (
    <div className="intranet-app-wrapper">
      <Header />
      <main className="container intranet-main-content">
        <Routes>
          <Route path="/" element={<EventsListPage />} />
          <Route path="/events/new" element={<NewEventPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/my-registrations" element={<MyRegistrationsPage />} />
          <Route path="*" element={<EventsListPage />} />
        </Routes>
      </main>
    </div>
  );
}
