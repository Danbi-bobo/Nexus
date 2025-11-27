import React from 'react';
import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      {/* Icon */}
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {icon || <FileQuestion className="w-10 h-10 text-gray-400" />}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-gray-500 text-center max-w-md mb-6">
          {description}
        </p>
      )}

      {/* Action button */}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
