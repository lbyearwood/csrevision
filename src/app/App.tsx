import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../features/auth/LoginPage';
import { StudentApp } from '../features/student/StudentApp';
import { TeacherApp } from '../features/teacher/TeacherApp';
import { useAppState } from './AppState';

export function App() {
  const { session } = useAppState();

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/student/*"
          element={session.role === 'student' ? <StudentApp /> : <Navigate to="/" replace />}
        />
        <Route
          path="/teacher/*"
          element={session.role === 'teacher' || session.role === 'admin' ? <TeacherApp /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
