import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Compass, BarChart2, Settings, Link as LinkIcon, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';


const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutGrid },
  { name: 'Explorer', path: '/explorer', icon: Compass },
  { name: 'Analytics', path: '/analytics', icon: BarChart2 },
  { name: 'Admin', path: '/admin', icon: Settings },
];

export const Sidebar: React.FC = () => {
  return (
    <nav className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-950/50 border-r border-gray-200 dark:border-gray-800 p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="p-2 bg-indigo-600 rounded-lg">
          <LinkIcon className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">Nexus</span>
      </div>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center p-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                )
              }
            >
              <item.icon className="w-6 h-6" />
              <span className="ml-3 font-medium">{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <a
          href="#"
          className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          <HelpCircle className="w-6 h-6" />
          <span className="ml-3 font-medium">Help & Support</span>
        </a>
      </div>
    </nav>
  );
};