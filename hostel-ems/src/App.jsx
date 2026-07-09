import Dashboard from './components/Dashboard';
import TaskBar from './components/TaskBar';
import { useState , useEffect } from 'react';

export default function App() {
        const [darkMode, setDarkMode] = useState(false);

        useEffect(() => {
        document.body.classList.toggle("dark", darkMode);
        }, [darkMode]);

        return(
        <>
        <TaskBar 
        darkMode = {darkMode}
        setDarkMode = {setDarkMode}
        />
        
        <Dashboard 
        darkMode = {darkMode}
        setDarkMode = {setDarkMode}
        />

        </>
      );
}