import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Search, Plus, Moon, Sun, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onAddLink: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddLink, theme, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="flex-shrink-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">

        {/* Search */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute inset-y-0 left-0 mt-2 ml-3 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search links, tags, or owners..."
              className="block w-full bg-gray-100 dark:bg-gray-800 rounded-md py-2 pl-10 pr-3 text-sm text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center ml-4 space-x-2 md:space-x-4">
          <Button onClick={onAddLink} variant="primary" size="md" className="hidden sm:inline-flex">
            <Plus className="h-5 w-5 -ml-1 mr-2" />
            Add Link
          </Button>

          <Button onClick={toggleTheme} variant="ghost" size="md" className="p-2">
            {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
          </Button>

          <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Bell className="h-6 w-6" />
          </button>

          {isAuthenticated && user && (
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-2">
                <img
                  className="h-9 w-9 rounded-full object-cover"
                  src={user.avatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)}
                  alt="User avatar"
                />
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium dark:text-white">{user.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{user.jobTitle || user.role}</span>
                </div>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50">
                  <a className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Your Profile</a>
                  <a className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Settings</a>
                  <a className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Sign out</a>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
