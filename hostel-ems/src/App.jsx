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

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    window.localStorage.setItem('hostel-ems-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <BrowserRouter>
      <TaskBar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}