import { Route, Routes } from 'react-router-dom';
import DemoBar from './components/DemoBar.jsx';
import Header from './components/Header.jsx';
import EventsListPage from './pages/EventsListPage.jsx';
import NewEventPage from './pages/NewEventPage.jsx';
import EventDetailPage from './pages/EventDetailPage.jsx';

export default function App() {
  return (
    <>
      <DemoBar />
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<EventsListPage />} />
          <Route path="/events/new" element={<NewEventPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="*" element={<EventsListPage />} />
        </Routes>
      </main>
    </>
  );
}
