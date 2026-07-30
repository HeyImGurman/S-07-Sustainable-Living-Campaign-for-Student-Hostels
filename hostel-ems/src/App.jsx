import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Analytics from './components/Analytics';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import Logs from './components/Logs';
import TaskBar from './components/TaskBar';

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

  function handleLogin(nextUser) {
    setUser(nextUser);
  }

  function handleLogout() {
    setUser(null);
  }

  return (
    <BrowserRouter>
      <TaskBar darkMode={darkMode} setDarkMode={setDarkMode} user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/" element={<Dashboard user={user} />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}