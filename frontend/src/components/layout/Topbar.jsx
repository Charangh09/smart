import { Menu, Moon, Sun } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

const pageMap = {
  '/dashboard': 'Dashboard',
  '/tasks': 'Tasks',
  '/analytics': 'Analytics',
};

function Topbar({ isDark, setIsDark, onToggleSidebar }) {
  const { user } = useAuth();
  const location = useLocation();
  const avatarLetter = (user?.name || 'U').trim().charAt(0).toUpperCase();

  return (
    <header className="glass panel sticky top-0 z-10 border-b px-4 py-4 md:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="field rounded-xl p-2 text-slate-700 lg:hidden dark:text-slate-200"
          >
            <Menu size={18} />
          </button>

          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-700/80 dark:text-cyan-300">Workspace</p>
            <h1 className="text-lg font-semibold text-slate-900 md:text-xl dark:text-slate-100">{pageMap[location.pathname] || 'TaskFlow'}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            className="field rounded-xl p-2.5 text-slate-700 transition hover:scale-105 dark:text-slate-200"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500/15 via-cyan-500/15 to-orange-500/15 px-2 py-2 md:px-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-sm font-bold text-blue-800 dark:text-blue-200">
              {avatarLetter}
            </span>
            <div className="hidden md:block">
              <p className="text-xs text-slate-600 dark:text-slate-300">Signed in as</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name || 'User'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
