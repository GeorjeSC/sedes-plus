import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { KEYS, readStorage, writeStorage } from '../lib/storage.js';
import allStudents from '../data/students.js';

const SessionContext = createContext(null);

function getInitialSession() {
  const stored = readStorage(KEYS.session, null);
  const validRole = stored && (stored.role === 'student' || stored.role === 'organizer');
  if (validRole && typeof stored.studentCode === 'string') {
    return stored;
  }
  return { role: 'student', studentCode: allStudents[0]?.code ?? '' };
}

export function SessionProvider({ children }) {
  const [session, setSession] = useState(getInitialSession);

  useEffect(() => {
    writeStorage(KEYS.session, session);
  }, [session]);

  const student = allStudents.find((item) => item.code === session.studentCode) ?? allStudents[0] ?? null;

  const value = useMemo(
    () => ({
      role: session.role,
      student,
      students: allStudents,
      setRole: (role) => setSession((prev) => ({ ...prev, role })),
      setStudentCode: (studentCode) => setSession((prev) => ({ ...prev, studentCode })),
    }),
    [session, student],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession debe usarse dentro de SessionProvider');
  }
  return context;
}
