import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { CategorySelector } from '../ui/CategorySelector';
import { TagSelector } from '../ui/TagSelector';
import { linkService } from '../../services/link.service';
import type { Tag } from '../../types/models';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddLinkModal: React.FC<AddLinkModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    notes: '',
    categoryId: undefined as string | undefined,
    visibility: 'Department' as 'Public' | 'Department' | 'Team' | 'Private',
  });
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim() || !formData.url.trim()) {
      setError('Title and URL are required');
      return;
    }

    setIsSubmitting(true);

    try {
      await linkService.createLink({
        title: formData.title,
        url: formData.url,
        description: formData.description || undefined,
        notes: formData.notes || undefined,
        categoryId: formData.categoryId,
        tagIds: selectedTags.map(t => t.id),
        visibility: formData.visibility,
      });

      // Reset form
      setFormData({
        title: '',
        url: '',
        description: '',
        notes: '',
        categoryId: undefined,
        visibility: 'Department',
      });
      setSelectedTags([]);

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error creating link:', err);
      setError(err instanceof Error ? err.message : 'Failed to create link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Link">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter link title"
            required
          />
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            URL <span className="text-red-500">*</span>
          </label>
          <Input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://example.com"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of the link"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes (Internal)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Internal notes (not visible to others)"
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <CategorySelector
            selectedCategoryId={formData.categoryId}
            onCategoryChange={(categoryId) => setFormData({ ...formData, categoryId })}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags
          </label>
          <TagSelector
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
          />
        </div>

        {/* Visibility */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Visibility
          </label>
          <select
            value={formData.visibility}
            onChange={(e) => setFormData({ ...formData, visibility: e.target.value as any })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
          >
            <option value="Public">Public - Everyone can see</option>
            <option value="Department">Department - Only department members</option>
            <option value="Team">Team - Only team members</option>
            <option value="Private">Private - Only me</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Link'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
