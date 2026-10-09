import { useEvents } from '../context/EventsContext.jsx';

export default function Flash() {
  const { flash } = useEvents();
  if (!flash) return null;

  return (
    <div className={`flash flash--${flash.type}`} role={flash.type === 'error' ? 'alert' : 'status'}>
      {flash.message}
    </div>
  );
}
