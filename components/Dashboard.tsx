
import React from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { LINKS, CURRENT_USER, DEPARTMENTS } from '../constants';
import { Link } from '../types';
import { StatusBadge } from './ui/Badge';
import { Page } from '../App';
import { Button } from './ui/Button';

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <Card className="flex items-center p-4">
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      <ion-icon name={icon} class="text-2xl text-white"></ion-icon>
    </div>
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </Card>
);

const QuickLinkItem: React.FC<{ link: Link }> = ({ link }) => (
  <li className="flex items-center justify-between py-3">
    <div className="truncate">
      <p className="font-medium text-indigo-400 hover:underline cursor-pointer">{link.title}</p>
      <p className="text-sm text-gray-500">{link.category}</p>
    </div>
    <StatusBadge status={link.status} />
  </li>
);

export const Dashboard: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
  const departmentLinks = LINKS.filter(l => l.departmentId === CURRENT_USER.departmentId);
  const recentLinks = [...LINKS].sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()).slice(0, 5);
  const popularLinks = [...departmentLinks].sort((a, b) => b.clickCount - a.clickCount).slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Welcome back, {CURRENT_USER.name.split(' ')[0]}!</h1>
        <p className="text-gray-400 mt-1">Here's what's happening in your workspace today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Links in Department" value={departmentLinks.length.toString()} icon="file-tray-full-outline" color="bg-blue-600" />
        <StatCard title="Your Pending Approvals" value="3" icon="checkbox-outline" color="bg-yellow-600" />
        <StatCard title="Dead Links Detected" value={LINKS.filter(l => l.status === 'Dead').length.toString()} icon="warning-outline" color="bg-red-600" />
        <StatCard title="New Links This Week" value="12" icon="trending-up-outline" color="bg-green-600" />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-white">Most Popular in {DEPARTMENTS.find(d => d.id === CURRENT_USER.departmentId)?.name}</h2>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-700">
              {popularLinks.map(link => <QuickLinkItem key={link.id} link={link} />)}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Recently Accessed</h2>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('Explorer')}>View All</Button>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-700">
              {recentLinks.map(link => <QuickLinkItem key={link.id} link={link} />)}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
