import { useState, useEffect } from 'react';
import { useTheme } from '@/src/app/context/ThemeContext';

export default function TopHeader() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    setIsCollapsed(saved ? JSON.parse(saved) : false);
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('sidebarCollapsed');
      setIsCollapsed(saved ? JSON.parse(saved) : false);
    };

    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 100);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 z-40 transition-all duration-300 flex items-center justify-end px-6 gap-4 ${
        isCollapsed ? 'left-16' : 'left-60'
      }`}
    >
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-sm px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-slate-700 focus:outline-none focus:border-blue-500 w-64"
        />
        <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 w-4 h-4 flex items-center justify-center"></i>
      </div>

      {/* Notification Bell */}
      <button className="relative p-2 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
        <i className="ri-notification-3-line text-xl w-5 h-5 flex items-center justify-center"></i>
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? (
          <i className="ri-sun-line text-xl w-5 h-5 flex items-center justify-center"></i>
        ) : (
          <i className="ri-moon-line text-xl w-5 h-5 flex items-center justify-center"></i>
        )}
      </button>
    </header>
  );
}
