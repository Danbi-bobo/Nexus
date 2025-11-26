import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './modules/dashboard/components/Dashboard';
import { LinkExplorer } from './modules/link/components/LinkExplorer';
import { Analytics } from './modules/analytics/components/Analytics';
import { AdminConsole } from './modules/admin/components/AdminConsole';
import { Link } from './types';
import { CURRENT_USER } from './constants';
import CreateLinkModal from './modules/link/components/CreateLinkModal';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [links, setLinks] = useState<Link[]>([]); // This would be populated from an API
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const addLink = (newLink: Omit<Link, 'id' | 'owner' | 'createdAt' | 'lastAccessedAt' | 'clickCount'>) => {
    // In a real app, this would be an API call
    const createdLink: Link = {
      ...newLink,
      id: `l${links.length + 10}`, // mock ID
      owner: CURRENT_USER,
      createdAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      clickCount: 0,
    };
    setLinks(prev => [createdLink, ...prev]);
  };

  return (
    <Router>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header 
            user={CURRENT_USER} 
            onAddLink={() => setIsModalOpen(true)} 
            theme={theme}
            toggleTheme={toggleTheme}
          />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Dashboard onNavigate={() => {}} />} />
              <Route path="/explorer" element={<LinkExplorer />} />
              <Route path="/analytics" element={<Analytics theme={theme} />} />
              <Route path="/admin" element={<AdminConsole />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        <CreateLinkModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onAddLink={addLink} 
        />
      </div>
    </Router>
  );
};

export default App;