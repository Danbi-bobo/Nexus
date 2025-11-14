
import React from 'react';
import { LinkStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, color = 'gray', className = '' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:ring-blue-700/30',
    green: 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-200 dark:bg-green-900/50 dark:text-green-300 dark:ring-green-700/30',
    yellow: 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:ring-yellow-700/30',
    red: 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-200 dark:bg-red-900/50 dark:text-red-300 dark:ring-red-700/30',
    gray: 'bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200 dark:bg-gray-700/80 dark:text-gray-300 dark:ring-gray-600/50',
  };

  const classes = `inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${colorClasses[color]} ${className}`;

  return <span className={classes}>{children}</span>;
};

export const StatusBadge: React.FC<{ status: LinkStatus }> = ({ status }) => {
  const statusConfig = {
    [LinkStatus.HEALTHY]: { color: 'green', icon: 'checkmark-circle-outline' },
    [LinkStatus.DEAD]: { color: 'red', icon: 'close-circle-outline' },
    [LinkStatus.PENDING]: { color: 'yellow', icon: 'hourglass-outline' },
    [LinkStatus.ARCHIVED]: { color: 'gray', icon: 'archive-outline' },
  } as const;

  const { color, icon } = statusConfig[status];

  return (
    <Badge color={color} className="flex items-center gap-1.5">
       <ion-icon name={icon} class="text-sm"></ion-icon>
      {status}
    </Badge>
  );
};