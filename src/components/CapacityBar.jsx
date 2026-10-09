import { isFull } from '../lib/events.js';

export default function CapacityBar({ event }) {
  const registered = event.registrations.length;
  const percent = event.capacity > 0 ? Math.min(100, Math.round((registered / event.capacity) * 100)) : 0;
  const full = isFull(event);
  const fewLeft = !full && percent >= 80;

  let fillModifier = 'ok';
  let text = `${registered} de ${event.capacity} cupos ocupados`;
  if (full) {
    fillModifier = 'danger';
    text = `Lleno: ${registered} de ${event.capacity} cupos ocupados`;
  } else if (fewLeft) {
    fillModifier = 'warning';
    text = `Quedan pocos cupos: ${registered} de ${event.capacity} ocupados`;
  }

  return (
    <div className="capacity">
      <div
        className="capacity__track"
        role="img"
        aria-label={`${registered} de ${event.capacity} cupos ocupados`}
      >
        <div className={`capacity__fill capacity__fill--${fillModifier}`} style={{ width: `${percent}%` }} />
      </div>
      <p className="capacity__text">{text}</p>
    </div>
  );
}
