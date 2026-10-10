function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function calculateAttendanceMetrics(event) {
  if (!event) {
    return {
      capacity: 0,
      registered: 0,
      attended: 0,
      absent: 0,
      occupancyRate: 0,
      attendanceRate: 0,
      spotsRemaining: 0,
    };
  }

  const capacity = event.capacity || 0;
  const registered = event.registrations?.length || 0;
  const attended = event.registrations?.filter((r) => r.attended).length || 0;
  const absent = registered - attended;
  const occupancyRate = capacity > 0 ? Math.min(100, Math.round((registered / capacity) * 100)) : 0;
  const attendanceRate = registered > 0 ? Math.round((attended / registered) * 100) : 0;
  const spotsRemaining = Math.max(0, capacity - registered);

  return {
    capacity,
    registered,
    attended,
    absent,
    occupancyRate,
    attendanceRate,
    spotsRemaining,
  };
}

export function exportAttendanceToCSV(event) {
  if (!event) return;

  const BOM = '\uFEFF';
  const metrics = calculateAttendanceMetrics(event);
  const registrations = [...(event.registrations || [])].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const escapeCSV = (text) => `"${String(text ?? '').replace(/"/g, '""')}"`;

  const rows = [
    ['UNIVERSIDAD CATOLICA SEDES SAPIENTIAE (UCSS) - SEDES+'],
    ['ACTA OFICIAL DE CONTROL DE ASISTENCIA'],
    [''],
    ['Evento:', escapeCSV(event.title)],
    ['Fecha del evento:', escapeCSV(formatDateTime(event.date))],
    ['Lugar:', escapeCSV(event.location)],
    ['Aforo maximo:', event.capacity],
    ['Total inscritos:', metrics.registered],
    ['Total asistentes (Presentes):', metrics.attended],
    ['Total ausentes (Pendientes):', metrics.absent],
    ['Tasa de asistencia:', `${metrics.attendanceRate}%`],
    ['Fecha de emision del reporte:', escapeCSV(formatDateTime(new Date().toISOString()))],
    [''],
    ['N°', 'Codigo UCSS', 'Estudiante', 'Fecha de Inscripcion', 'Estado Asistencia', 'Hora de Ingreso Marcada'],
  ];

  registrations.forEach((reg, index) => {
    rows.push([
      index + 1,
      escapeCSV(reg.studentCode),
      escapeCSV(reg.name),
      escapeCSV(formatDateTime(reg.createdAt)),
      reg.attended ? 'PRESENTE' : 'AUSENTE',
      escapeCSV(formatDateTime(reg.attendedAt)),
    ]);
  });

  const csvContent = rows.map((r) => r.join(',')).join('\r\n');
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const safeTitle = event.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_')
    .slice(0, 30);

  const today = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.setAttribute('download', `UCSS_Asistencia_${safeTitle}_${today}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
