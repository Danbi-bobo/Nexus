
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { LinkExplorer } from './components/LinkExplorer';
import { Analytics } from './components/Analytics';
import { AdminConsole } from './components/AdminConsole';
import { Link, User } from './types';
import { CURRENT_USER } from './constants';
import CreateLinkModal from './components/modals/CreateLinkModal';

export type Page = 'Dashboard' | 'Explorer' | 'Analytics' | 'Admin';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
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

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'Explorer':
        return <LinkExplorer />;
      case 'Analytics':
        return <Analytics theme={theme} />;
      case 'Admin':
        return <AdminConsole />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header 
          user={CURRENT_USER} 
          onAddLink={() => setIsModalOpen(true)} 
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
      <CreateLinkModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddLink={addLink} 
      />
    </div>
  );
};

export default App;