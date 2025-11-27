import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AddLinkModal } from '../links/AddLinkModal';
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
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  const handleAddLink = () => {
    setIsAddLinkModalOpen(true);
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

      <AddLinkModal
        isOpen={isAddLinkModalOpen}
        onClose={() => setIsAddLinkModalOpen(false)}
        onSuccess={() => {
          // Optionally refresh data or show notification
          console.log('Link created successfully!');
        }}
      />
    </div>
  );
};
