import React, { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { tagService } from '../../services/tag.service';
import type { Tag } from '../../types/models';

interface TagSelectorProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  placeholder?: string;
  className?: string;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onTagsChange,
  placeholder = 'Thêm tags...',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch tag suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        // Show popular tags if no search query
        const popular = await tagService.getPopularTags(10);
        setSuggestions(popular.filter(tag => 
          !selectedTags.find(t => t.id === tag.id)
        ));
        return;
      }

      setIsLoading(true);
      try {
        const results = await tagService.searchTags(searchQuery);
        setSuggestions(results.filter(tag => 
          !selectedTags.find(t => t.id === tag.id)
        ));
      } catch (error) {
        console.error('Error searching tags:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchSuggestions();
    }
  }, [searchQuery, isOpen, selectedTags]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddTag = (tag: Tag) => {
    if (!selectedTags.find(t => t.id === tag.id)) {
      onTagsChange([...selectedTags, tag]);
    }
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(t => t.id !== tagId));
  };

  const handleCreateNewTag = async () => {
    if (!searchQuery.trim()) return;

    try {
      const newTag = await tagService.getOrCreateTag(searchQuery.trim());
      handleAddTag(newTag);
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleAddTag(suggestions[0]);
      } else {
        handleCreateNewTag();
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map(tag => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: tag.color ? `${tag.color}20` : '#E0E7FF',
              color: tag.color || '#4F46E5',
            }}
          >
            {tag.name}
            <button
              onClick={() => handleRemoveTag(tag.id)}
              className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
              aria-label={`Remove ${tag.name}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
        />

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto z-20">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                Đang tìm kiếm...
              </div>
            ) : suggestions.length > 0 ? (
              <div className="py-1">
                {suggestions.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleAddTag(tag)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between group"
                  >
                    <span
                      className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-sm"
                      style={{
                        backgroundColor: tag.color ? `${tag.color}20` : '#E0E7FF',
                        color: tag.color || '#4F46E5',
                      }}
                    >
                      {tag.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {tag.usageCount} links
                    </span>
                  </button>
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <button
                onClick={handleCreateNewTag}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 text-indigo-600"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo tag mới: "{searchQuery}"</span>
              </button>
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                Nhập để tìm kiếm hoặc tạo tag mới
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
