import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { User, UserRole } from '../../types';

// Mock user for now, or get from context/store
const MOCK_USER: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  role: UserRole.ADMIN,
  avatarUrl: 'https://ui-avatars.com/api/?name=Alex+Johnson',
  departmentId: 'dept_1',
  team: 'Engineering'
};

export const MainLayout: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    // In a real app, you'd apply class to html/body here
    document.documentElement.classList.toggle('dark');
  };

  const handleAddLink = () => {
    console.log('Add link clicked');
    // Open modal logic here
  };

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${theme}`}>
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={MOCK_USER} 
          onAddLink={handleAddLink}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
