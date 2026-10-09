import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext.jsx';
import { EventsProvider } from './context/EventsContext.jsx';
import App from './App.jsx';
import './styles/theme.css';
import './styles/app.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <EventsProvider>
          <App />
        </EventsProvider>
      </SessionProvider>
    </BrowserRouter>
  </StrictMode>,
);
