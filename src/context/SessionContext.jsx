import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { KEYS, readStorage, writeStorage } from '../lib/storage.js';
import allStudents from '../data/students.js';

const SessionContext = createContext(null);

function getInitialSession() {
  const stored = readStorage(KEYS.session, null);
  const validRole = stored && (stored.role === 'student' || stored.role === 'organizer');
  if (validRole && typeof stored.studentCode === 'string') {
    return {
      isLoggedIn: Boolean(stored.isLoggedIn),
      role: stored.role,
      studentCode: stored.studentCode,
    };
  }
  return {
    isLoggedIn: false,
    role: 'student',
    studentCode: allStudents[0]?.code ?? '2022100708',
  };
}

export function SessionProvider({ children }) {
  const [session, setSession] = useState(getInitialSession);

  useEffect(() => {
    writeStorage(KEYS.session, session);
  }, [session]);

  const student =
    allStudents.find((item) => item.code === session.studentCode) ?? allStudents[0] ?? null;

  const login = (username = '') => {
    const cleanUser = String(username).trim().toLowerCase();
    if (cleanUser === 'organizador' || cleanUser === 'admin') {
      setSession({
        isLoggedIn: true,
        role: 'organizer',
        studentCode: '',
      });
      return { ok: true, role: 'organizer' };
    }

    const found = allStudents.find((s) => s.code.toLowerCase() === cleanUser);
    const targetCode = found ? found.code : allStudents[0]?.code ?? '2022100708';

    setSession({
      isLoggedIn: true,
      role: 'student',
      studentCode: targetCode,
    });
    return { ok: true, role: 'student', student: found || allStudents[0] };
  };

  const logout = () => {
    setSession((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));
  };

  const value = useMemo(
    () => ({
      isLoggedIn: session.isLoggedIn,
      role: session.role,
      student,
      students: allStudents,
      login,
      logout,
      setRole: (role) => setSession((prev) => ({ ...prev, role })),
      setStudentCode: (studentCode) => setSession((prev) => ({ ...prev, studentCode })),
    }),
    [session, student]
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
