
import React, { Fragment } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-900/80 transition-opacity" onClick={onClose}></div>

      <div className="relative w-full max-w-lg transform rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
        <div className="flex items-start justify-between p-4 border-b border-gray-200 dark:border-gray-700 rounded-t">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white" id="modal-title">
            {title}
          </h3>
          <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" onClick={onClose}>
            <ion-icon name="close-outline" class="text-2xl"></ion-icon>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {children}
        </div>
        
        {footer && (
          <div className="flex items-center p-6 space-x-2 border-t border-gray-200 dark:border-gray-700 rounded-b">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};