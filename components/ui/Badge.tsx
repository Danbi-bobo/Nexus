
import React from 'react';
import { LinkStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, color = 'gray', className = '' }) => {
  const colorClasses = {
    blue: 'bg-blue-900/50 text-blue-300 ring-1 ring-inset ring-blue-700/30',
    green: 'bg-green-900/50 text-green-300 ring-1 ring-inset ring-green-700/30',
    yellow: 'bg-yellow-900/50 text-yellow-300 ring-1 ring-inset ring-yellow-700/30',
    red: 'bg-red-900/50 text-red-300 ring-1 ring-inset ring-red-700/30',
    gray: 'bg-gray-700/80 text-gray-300 ring-1 ring-inset ring-gray-600/50',
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
