import { BarChart3, ClipboardList, LayoutDashboard, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { notifyInfo } from '../../utils/notify';

const navItems = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Tasks', to: '/tasks', icon: ClipboardList },
  { name: 'Analytics', to: '/analytics', icon: BarChart3 },
];

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
        />
      ) : null}

      <aside
        className={`glass panel fixed left-0 top-0 z-40 flex h-screen w-[270px] flex-col items-stretch border-r px-4 py-4 transition-transform duration-300 lg:z-20 lg:w-72 lg:translate-x-0 lg:px-6 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 text-xl font-extrabold text-slate-800 dark:text-cyan-100">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 via-cyan-500 to-orange-500 text-white shadow-soft">
            T
          </span>
          <span className="text-gradient">TaskFlow</span>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-soft'
                      : 'text-slate-700 hover:bg-cyan-50/80 dark:text-slate-200 dark:hover:bg-slate-800/80'
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => {
            logout();
            notifyInfo('You have been signed out');
            navigate('/login');
          }}
          className="mt-auto flex items-center gap-3 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
        >
          <LogOut size={16} />
          Logout
        </button>
      </aside>
    </>
  );
}

export default Sidebar;
