import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import Analytics from './components/Analytics';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import Logs from './components/Logs';
import TaskBar from './components/TaskBar';

function AppShell({ user, setUser, darkMode, setDarkMode }) {
  const location = useLocation();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (!user && location.pathname !== '/login') {
      const timer = window.setTimeout(() => {
        setToastVisible(false);
      }, 3200);

      setToastMessage('Please log in to access this page.');
      setToastVisible(true);

      return () => window.clearTimeout(timer);
    }

    setToastVisible(false);
  }, [location.pathname, user]);

  function handleLogin(nextUser) {
    setUser(nextUser);
  }

  function handleLogout() {
    setUser(null);
  }

  return (
    <>
      <TaskBar darkMode={darkMode} setDarkMode={setDarkMode} user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />} />
        <Route
          path="/"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/analytics"
          element={user ? <Analytics /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/logs"
          element={user ? <Logs /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
      </Routes>

      {toastVisible && (
        <div className="fixed bottom-4 left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-2xl backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Login required</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{toastMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setToastVisible(false)}
              className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    const savedTheme = window.localStorage.getItem('hostel-ems-theme');
    return savedTheme === 'dark';
  });
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const storedUser = window.localStorage.getItem('hostel-ems-user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    window.localStorage.setItem('hostel-ems-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem('hostel-ems-user', JSON.stringify(user));
    } else {
      window.localStorage.removeItem('hostel-ems-user');
    }
  }, [user]);

  return (
    <BrowserRouter>
      <AppShell user={user} setUser={setUser} darkMode={darkMode} setDarkMode={setDarkMode} />
    </BrowserRouter>
  );
}