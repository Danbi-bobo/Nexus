import React, { useState, useEffect } from 'react';
import { ChevronDown, Folder } from 'lucide-react';
import { categoryService } from '../../services/category.service';
import type { Category } from '../../types/models';

interface CategorySelectorProps {
  selectedCategoryId?: string;
  onCategoryChange: (categoryId: string | undefined) => void;
  departmentId?: string;
  placeholder?: string;
  className?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategoryId,
  onCategoryChange,
  departmentId,
  placeholder = 'Chọn danh mục...',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const data = await categoryService.getCategories(departmentId);
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [departmentId]);

  const handleSelect = (categoryId: string) => {
    onCategoryChange(categoryId === selectedCategoryId ? undefined : categoryId);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          {selectedCategory ? (
            <>
              <span className="text-2xl">{selectedCategory.icon || '📁'}</span>
              <span className="text-gray-900">{selectedCategory.name}</span>
            </>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-20">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Đang tải...
            </div>
          ) : categories.length > 0 ? (
            <div className="py-1">
              {/* Clear selection option */}
              {selectedCategoryId && (
                <button
                  onClick={() => {
                    onCategoryChange(undefined);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-500 border-b border-gray-100"
                >
                  Xóa lựa chọn
                </button>
              )}

              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleSelect(category.id)}
                  className={`
                    w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3
                    ${category.id === selectedCategoryId ? 'bg-indigo-50 text-indigo-700' : 'text-gray-900'}
                  `}
                >
                  <span className="text-2xl">{category.icon || '📁'}</span>
                  <div className="flex-1">
                    <div className="font-medium">{category.name}</div>
                    {category.description && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {category.description}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {category.linkCount} links
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              Chưa có danh mục nào
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
