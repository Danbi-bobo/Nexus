
import React from 'react';
import { Page } from '../App';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const navItems: { name: Page; icon: string }[] = [
  { name: 'Dashboard', icon: 'grid-outline' },
  { name: 'Explorer', icon: 'compass-outline' },
  { name: 'Analytics', icon: 'analytics-outline' },
  { name: 'Admin', icon: 'settings-outline' },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <nav className="hidden md:flex flex-col w-64 bg-gray-950/50 border-r border-gray-800 p-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 bg-indigo-600 rounded-lg">
          <ion-icon name="link-outline" class="text-2xl text-white"></ion-icon>
        </div>
        <span className="text-xl font-bold text-white">Nexus</span>
      </div>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.name}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(item.name);
              }}
              className={`flex items-center p-3 rounded-lg transition-colors ${
                currentPage === item.name
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <ion-icon name={item.icon} class="text-2xl"></ion-icon>
              <span className="ml-3">{item.name}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <a
          href="#"
          className="flex items-center p-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          <ion-icon name="help-circle-outline" class="text-2xl"></ion-icon>
          <span className="ml-3">Help & Support</span>
        </a>
      </div>
    </nav>
  );
};
