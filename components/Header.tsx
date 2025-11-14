
import React, { useState } from 'react';
import { User } from '../types';
import { Button } from './ui/Button';

interface HeaderProps {
  user: User;
  onAddLink: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onAddLink, theme, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex-shrink-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ion-icon name="search-outline" class="text-gray-400"></ion-icon>
            </div>
            <input
              type="search"
              placeholder="Search links, tags, or owners..."
              className="block w-full bg-gray-100 dark:bg-gray-800 border border-transparent rounded-md py-2 pl-10 pr-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-gray-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        
        {/* Actions & User Menu */}
        <div className="flex items-center ml-4 space-x-2 md:space-x-4">
          <Button onClick={onAddLink} variant="primary" size="md" className="hidden sm:inline-flex">
            <ion-icon name="add-outline" class="text-xl -ml-1 mr-2"></ion-icon>
            Add Link
          </Button>
           <Button onClick={onAddLink} variant="primary" size="md" className="sm:hidden p-2">
            <ion-icon name="add-outline" class="text-xl"></ion-icon>
          </Button>
          
          <Button onClick={toggleTheme} variant="ghost" size="md" className="p-2">
            {theme === 'light' ? 
              <ion-icon name="moon-outline" class="text-2xl"></ion-icon> : 
              <ion-icon name="sunny-outline" class="text-2xl"></ion-icon>
            }
          </Button>

          <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-indigo-500">
            <ion-icon name="notifications-outline" class="text-2xl"></ion-icon>
          </button>

          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-2">
              <img className="h-9 w-9 rounded-full" src={user.avatarUrl} alt="User avatar" />
              <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{user.role}</span>
              </div>
            </button>
            {menuOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Your Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Settings</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Sign out</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};