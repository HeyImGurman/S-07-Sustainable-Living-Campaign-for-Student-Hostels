import { IoHome, IoSettings } from 'react-icons/io5';
import { GoGraph } from 'react-icons/go';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { CgDarkMode } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import '../index.css';

export default function Taskbar({ darkMode, setDarkMode }) {
  function toggleMode() {
    setDarkMode(!darkMode);
  }

  return (
    <div className="w-screen font-pliant font-brand">
      <div className="flex h-[3rem] w-screen items-center justify-left gap-[2rem] bg-red-500 pl-[2rem]">
        <Link to="/" className="flex items-center justify-center gap-[5px] rounded-[5px] px-[5px] py-[5px] transition-colors duration-300 ease-in-out hover:bg-red-400">
          <IoHome />
          <p>Home</p>
        </Link>

        <Link to="/analytics" className="flex items-center justify-center gap-[5px] rounded-[5px] px-[5px] py-[5px] transition-colors duration-300 ease-in-out hover:bg-red-400">
          <GoGraph />
          <p>Analytics</p>
        </Link>

        <Link to="/logs" className="flex items-center justify-center gap-[5px] rounded-[5px] px-[5px] py-[5px] transition-colors duration-300 ease-in-out hover:bg-red-400">
          <HiOutlineDocumentReport />
          <p>Logs</p>
        </Link>

        <div className="flex items-center justify-center gap-[5px] rounded-[5px] px-[5px] py-[5px] transition-colors duration-300 ease-in-out hover:bg-red-400">
          <IoSettings />
          <p>Settings</p>
        </div>

        <button
          className="ml-auto mr-[2rem] rounded-[5px] px-[5px] py-[5px] transition-colors duration-300 ease-in-out hover:bg-red-400"
          onClick={toggleMode}
        >
          <CgDarkMode size={20} />
        </button>
      </div>
    </div>
  );
}
