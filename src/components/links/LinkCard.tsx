import React from 'react';
import { ExternalLink, Copy, Edit, Trash2, Eye, MousePointerClick } from 'lucide-react';
import type { Link } from '../../types/models';
import { linkService } from '../../services/link.service';

interface LinkCardProps {
  link: Link;
  onEdit?: (link: Link) => void;
  onDelete?: (link: Link) => void;
  showActions?: boolean;
  className?: string;
}

export const LinkCard: React.FC<LinkCardProps> = ({
  link,
  onEdit,
  onDelete,
  showActions = true,
  className = '',
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleCopyShortUrl = async () => {
    if (!link.shortCode) return;
    
    const shortUrl = `${window.location.origin}/s/${link.shortCode}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleClick = async () => {
    // Increment click count
    try {
      await linkService.incrementClickCount(link.id);
    } catch (error) {
      console.error('Failed to increment click count:', error);
    }

    // Open link
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Dead': return 'bg-red-100 text-red-700';
      case 'Archived': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'Public': return '🌐';
      case 'Department': return '🏢';
      case 'Team': return '👥';
      case 'Private': return '🔒';
      default: return '📄';
    }
  };

  return (
    <div
      className={`
        group relative bg-white rounded-xl border-2 border-gray-200 
        hover:border-indigo-300 hover:shadow-lg transition-all duration-200
        ${className}
      `}
    >
      {/* Card content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate group-hover:text-indigo-600 transition-colors">
              {link.title}
            </h3>
            
            {/* Category badge */}
            {link.category && (
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                <span>{link.category.icon || '📁'}</span>
                <span>{link.category.name}</span>
              </div>
            )}
          </div>

          {/* Status badge */}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(link.status)}`}>
            {link.status}
          </span>
        </div>

        {/* Description */}
        {link.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {link.description}
          </p>
        )}

        {/* URL */}
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{link.url}</span>
        </div>

        {/* Tags */}
        {link.tags && link.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {link.tags.map(tag => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: tag.color ? `${tag.color}20` : '#E0E7FF',
                  color: tag.color || '#4F46E5',
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MousePointerClick className="w-3.5 h-3.5" />
              <span>{link.clickCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{link.viewCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{getVisibilityIcon(link.visibility)}</span>
              <span className="capitalize">{link.visibility}</span>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center gap-1">
              <button
                onClick={handleClick}
                className="p-2 hover:bg-indigo-50 rounded-lg transition-colors text-indigo-600"
                title="Mở link"
              >
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={handleCopyUrl}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                title={copied ? 'Đã copy!' : 'Copy URL'}
              >
                <Copy className={`w-4 h-4 ${copied ? 'text-green-600' : ''}`} />
              </button>

              {link.shortCode && (
                <button
                  onClick={handleCopyShortUrl}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 text-xs font-mono"
                  title="Copy short URL"
                >
                  /s/{link.shortCode}
                </button>
              )}

              {onEdit && (
                <button
                  onClick={() => onEdit(link)}
                  className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                  title="Chỉnh sửa"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}

              {onDelete && (
                <button
                  onClick={() => onDelete(link)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 pointer-events-none transition-all duration-200" />
    </div>
  );
};
