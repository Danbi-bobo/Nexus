import React, { useState, useEffect } from 'react';
import { Link } from '../../../types/models';
import { Card, CardContent } from '../../../components/ui/Card';
import { StatusBadge, Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Link as LinkIcon, ExternalLink, LayoutGrid, List } from 'lucide-react';
import { linkService } from '../../../services/link.service';

type ViewMode = 'card' | 'table';

const LinkCard: React.FC<{ link: Link }> = ({ link }) => (
  <Card className="flex flex-col h-full hover:border-indigo-500 transition-all">
    <CardContent className="flex-grow">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{link.title}</h3>
        <StatusBadge status={link.status} />
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{link.description || 'No description'}</p>

      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 text-sm truncate flex items-center hover:underline">
        <LinkIcon className="w-4 h-4 mr-1" />
        {link.url}
      </a>
    </CardContent>
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <img src={link.owner?.avatarUrl || 'https://ui-avatars.com/api/?name=User'} alt={link.owner?.name || 'User'} className="w-6 h-6 rounded-full mr-2" />
          <span className="text-xs text-gray-500 dark:text-gray-400">{link.owner?.name || 'Unknown'}</span>
        </div>
        <Badge>{link.visibility}</Badge>
      </div>
      <div className="flex flex-wrap gap-1">
        {link.tags?.slice(0, 3).map(tag => <Badge key={tag.id} className="text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30">{tag.name}</Badge>)}
      </div>
    </div>
  </Card>
);

const LinkTableRow: React.FC<{ link: Link }> = ({ link }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
    <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{link.title}</td>
    <td className="p-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"><StatusBadge status={link.status} /></td>
    <td className="p-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{link.owner?.name || 'Unknown'}</td>
    <td className="p-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{link.createdAt ? new Date(link.createdAt).toLocaleDateString() : 'N/A'}</td>
    <td className="p-4 whitespace-nowrap text-right text-sm font-medium">
      <a href={link.url} target="_blank" rel="noopener noreferrer">
        <Button variant="ghost" size="sm"><ExternalLink className="w-4 h-4" /></Button>
      </a>
    </td>
  </tr>
)

export const LinkExplorer: React.FC = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    query: '',
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setIsLoading(true);
      const data = await linkService.getLinks({
        status: filters.status ? filters.status as any : undefined,
        query: filters.query || undefined,
        limit: 50,
      });
      setLinks(data.links);
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilters = () => {
    fetchLinks();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Link Explorer</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Browse, search and filter all links in the repository.</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 p-1 rounded-lg">
          <Button variant={viewMode === 'card' ? 'secondary' : 'ghost'} onClick={() => setViewMode('card')} className="p-2">
            <LayoutGrid className="w-5 h-5" />
          </Button>
          <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} onClick={() => setViewMode('table')} className="p-2">
            <List className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Dead">Dead</option>
            <option value="Archived">Archived</option>
          </select>
          <input
            type="text"
            placeholder="Search links..."
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <Button variant="primary" onClick={handleApplyFilters} className="col-span-2 md:col-span-2 lg:col-span-3">Apply Filters</Button>
        </div>
      </Card>

      {/* Content */}
      {links.length === 0 ? (
        <Card className="p-8">
          <p className="text-center text-gray-500 dark:text-gray-400">No links found. Try adjusting your filters or add a new link.</p>
        </Card>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {links.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
      ) : (
        <Card>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Owner</th>
                <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                <th scope="col" className="relative p-4"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {links.map(link => <LinkTableRow key={link.id} link={link} />)}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};