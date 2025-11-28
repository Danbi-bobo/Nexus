import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';
import { Link } from '../../../types/models';
import { StatusBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { FileText, CheckSquare, AlertTriangle, TrendingUp } from 'lucide-react';
import { linkService } from '../../../services/link.service';
import { useAuth } from '../../../contexts/AuthContext';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
  <Card className="flex items-center p-4">
    <div className={`p - 3 rounded - full mr - 4 ${color} `}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </Card>
);

const QuickLinkItem: React.FC<{ link: Link }> = ({ link }) => (
  <li className="flex items-center justify-between py-3">
    <div className="truncate">
      <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
        {link.title}
      </a>
      <p className="text-sm text-gray-500 dark:text-gray-500">{link.category?.name || 'Uncategorized'}</p>
    </div>
    <StatusBadge status={link.status} />
  </li>
);

export const Dashboard: React.FC<{ onNavigate: (page: any) => void }> = () => {
  const { user } = useAuth();
  const [recentLinks, setRecentLinks] = useState<Link[]>([]);
  const [popularLinks, setPopularLinks] = useState<Link[]>([]);
  const [totalLinks, setTotalLinks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch recent links
        const recentData = await linkService.getRecentLinks(5);
        setRecentLinks(recentData);

        // Fetch popular links  
        const popularData = await linkService.getPopularLinks(5);
        setPopularLinks(popularData);

        // Fetch total links count (with department filter if user has department)
        const linksData = await linkService.getLinks({
          departmentId: user?.departmentId,
          limit: 1,
        });
        setTotalLinks(linksData.total);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.departmentId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name.split(' ')[0] || 'User'}!</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening in your workspace today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Links" value={totalLinks.toString()} icon={FileText} color="bg-blue-600" />
        <StatCard title="Your Pending Approvals" value="0" icon={CheckSquare} color="bg-yellow-600" />
        <StatCard title="Dead Links Detected" value="0" icon={AlertTriangle} color="bg-red-600" />
        <StatCard title="New Links This Week" value={recentLinks.length.toString()} icon={TrendingUp} color="bg-green-600" />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Most Popular</h2>
          </CardHeader>
          <CardContent>
            {popularLinks.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {popularLinks.map(link => <QuickLinkItem key={link.id} link={link} />)}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No links found</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recently Added</h2>
            <RouterLink to="/explorer">
              <Button variant="ghost" size="sm">View All</Button>
            </RouterLink>
          </CardHeader>
          <CardContent>
            {recentLinks.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentLinks.map(link => <QuickLinkItem key={link.id} link={link} />)}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No links found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};