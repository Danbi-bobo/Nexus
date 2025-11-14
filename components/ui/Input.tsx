
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, icon, ...props }, ref) => {
    return (
      <div>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <ion-icon name={icon} class="text-gray-400 dark:text-gray-500"></ion-icon>
            </div>
          )}
          <input
            id={id}
            ref={ref}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full ${icon ? 'pl-10' : ''} p-2.5 placeholder-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
            {...props}
          />
        </div>
      </div>
    );
  }
);