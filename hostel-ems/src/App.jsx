import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TaskBar from './components/TaskBar';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <BrowserRouter>
      <TaskBar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />
    </BrowserRouter>
  );
}