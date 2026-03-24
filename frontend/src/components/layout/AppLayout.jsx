import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Spinner from '../common/Spinner';

function AppLayout() {
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    setPageLoading(true);
    const timeout = setTimeout(() => setPageLoading(false), 280);
    setIsSidebarOpen(false);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen overflow-x-hidden text-slate-900 dark:text-slate-100 lg:flex">
      <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-teal-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-44 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl" />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col lg:ml-72">
        <Topbar
          isDark={isDark}
          setIsDark={setIsDark}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {pageLoading ? (
            <div className="mb-4 inline-flex items-center gap-2 rounded-xl bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-700 dark:text-blue-300">
              <Spinner size={16} />
              Loading page...
            </div>
          ) : null}
          <div className="mx-auto max-w-7xl animate-fadeInUp">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
