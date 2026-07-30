import { useState } from 'react';
import { IoChevronDown, IoHome, IoLogOut, IoPersonCircleOutline, IoSettings } from 'react-icons/io5';
import { GoGraph } from 'react-icons/go';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { CgDarkMode } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import '../index.css';

export default function Taskbar({ darkMode, setDarkMode, user, onLogout, onRequireLogin }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMode() {
    setDarkMode(!darkMode);
  }

  function handleLogin(event) {
    event.preventDefault();
    if (!user) {
      onRequireLogin?.();
      return;
    }
    navigate('/login');
  }

  function handleProtectedNavigation(event, path) {
    event.preventDefault();

    if (!user) {
      onRequireLogin?.();
      return;
    }

    navigate(path);
  }

  function handleLogout() {
    setMenuOpen(false);
    onLogout?.();
    navigate('/login');
  }

  return (
    <div className="w-screen font-pliant font-brand">
      <div className="flex h-auto min-h-[3rem] w-screen flex-wrap items-center gap-[1rem] bg-red-500 px-[1rem] py-[0.6rem] text-white sm:gap-[1.5rem] sm:px-[2rem]">
        <div className="flex flex-wrap items-center gap-[0.75rem] sm:gap-[1rem]">
          <button
            type="button"
            onClick={(event) => handleProtectedNavigation(event, '/')}
            className="flex items-center justify-center gap-[5px] rounded-[5px] px-[5px] py-[5px] transition-colors duration-300 ease-in-out hover:bg-red-400"
          >
            <IoHome />
            <p>Home</p>
          </button>

          <button
            type="button"
            onClick={(event) => handleProtectedNavigation(event, '/analytics')}
            className="flex items-center justify-center gap-[5px] rounded-[5px] px-[5px] py-[5px] transition-colors duration-300 ease-in-out hover:bg-red-400"
          >
            <GoGraph />
            <p>Analytics</p>
          </button>

          <button
            type="button"
            onClick={(event) => handleProtectedNavigation(event, '/logs')}
            className="flex items-center justify-center gap-[5px] rounded-[5px] px-[5px] py-[5px] transition-colors duration-300 ease-in-out hover:bg-red-400"
          >
            <HiOutlineDocumentReport />
            <p>Logs</p>
          </button>

          <button
            type="button"
            onClick={(event) => handleProtectedNavigation(event, '/settings')}
            className="flex items-center justify-center gap-[5px] rounded-[5px] px-[5px] py-[5px] transition-colors duration-300 ease-in-out hover:bg-red-400"
          >
            <IoSettings />
            <p>Settings</p>
          </button>
        </div>

        <div className="ml-auto flex flex-wrap items-center justify-end gap-[0.75rem]">
          {!user ? (
            <form onSubmit={handleLogin} className="rounded-[8px] bg-red-500 px-[0.6rem] py-[0.35rem]">
              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 px-[0.9rem] py-[0.4rem] text-sm font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-[1px] hover:bg-gradient-to-r hover:from-sky-500 hover:via-cyan-400 hover:to-emerald-400 hover:shadow-[0_6px_16px_rgba(0,0,0,0.25)]"
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
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium">{user.name || 'User'}</span>
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
