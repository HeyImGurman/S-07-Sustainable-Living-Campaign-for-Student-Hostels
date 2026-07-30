import { useState } from 'react';
import { IoChevronDown, IoHome, IoLogOut, IoPersonCircleOutline, IoSettings } from 'react-icons/io5';
import { GoGraph } from 'react-icons/go';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { CgDarkMode } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import '../index.css';

export default function Taskbar({ darkMode, setDarkMode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('Guest');
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMode() {
    setDarkMode(!darkMode);
  }

  function handleLogin(event) {
    event.preventDefault();

    if (!username.trim()) {
      setDisplayName('Guest');
      setIsLoggedIn(true);
      setPassword('');
      setMenuOpen(false);
      return;
    }

    setDisplayName(username.trim());
    setIsLoggedIn(true);
    setPassword('');
    setMenuOpen(false);
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setDisplayName('Guest');
    setMenuOpen(false);
  }

  return (
    <div className="w-screen font-pliant font-brand">
      <div className="flex h-auto min-h-[3rem] w-screen flex-wrap items-center gap-[1rem] bg-red-500 px-[1rem] py-[0.6rem] text-white sm:gap-[1.5rem] sm:px-[2rem]">
        <div className="flex flex-wrap items-center gap-[0.75rem] sm:gap-[1rem]">
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
        </div>

        <div className="ml-auto flex flex-wrap items-center justify-end gap-[0.75rem]">
          {!isLoggedIn ? (
            <form onSubmit={handleLogin} className="rounded-[8px] bg-red-600/70 px-[0.6rem] py-[0.35rem]">
              <button
                type="submit"
                className="rounded-[6px] bg-white px-[0.7rem] py-[0.35rem] text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Login
              </button>
            </form>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center gap-[0.5rem] rounded-[999px] bg-red-600/70 px-[0.6rem] py-[0.35rem] transition hover:bg-red-600"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-sm font-semibold text-red-600">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">{displayName}</span>
                <IoChevronDown size={16} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 z-10 mt-[0.5rem] w-[11rem] rounded-[8px] border border-red-200 bg-white p-[0.4rem] shadow-lg">
                  <button
                    type="button"
                    className="flex w-full items-center gap-[0.5rem] rounded-[6px] px-[0.5rem] py-[0.45rem] text-left text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    <IoPersonCircleOutline size={16} />
                    Account settings
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-[0.5rem] rounded-[6px] px-[0.5rem] py-[0.45rem] text-left text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    <IoLogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className="rounded-[5px] px-[5px] py-[5px] transition-colors duration-300 ease-in-out hover:bg-red-400"
            onClick={toggleMode}
            type="button"
          >
            <CgDarkMode size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
