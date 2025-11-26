import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './modules/dashboard/components/Dashboard';
import { LinkExplorer } from './modules/link/components/LinkExplorer';
import { Analytics } from './modules/analytics/components/Analytics';
import { AdminConsole } from './modules/admin/components/AdminConsole';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { AuthCallback } from './pages/AuthCallback';
import { Link } from './types';
import { CURRENT_USER } from './constants';
import CreateLinkModal from './modules/link/components/CreateLinkModal';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('user_profile_id');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [links, setLinks] = useState<Link[]>([]);
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
    const link: Link = {
      ...newLink,
      id: Math.random().toString(36).substring(7),
      owner: CURRENT_USER,
      createdAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      clickCount: 0,
    };
    setLinks([...links, link]);
    setIsModalOpen(false);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                <Sidebar />
                <div className="flex flex-1 flex-col overflow-hidden">
                  <Header 
                    theme={theme} 
                    toggleTheme={toggleTheme} 
                    onAddLink={() => setIsModalOpen(true)} 
                  />
                  <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <Routes>
                      <Route path="/" element={<Dashboard onNavigate={() => {}} />} />
                      <Route path="/explorer" element={<LinkExplorer />} />
                      <Route path="/analytics" element={<Analytics theme={theme} />} />
                      <Route path="/admin" element={<AdminConsole />} />
                    </Routes>
                  </main>
                </div>

                {/* Create Link Modal */}
                <CreateLinkModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onAddLink={addLink}
                />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;