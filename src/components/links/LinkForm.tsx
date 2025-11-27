import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TagSelector } from '../ui/TagSelector';
import { CategorySelector } from '../ui/CategorySelector';
import type { CreateLinkRequest, Tag } from '../../types/models';

const linkSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề tối đa 200 ký tự'),
  url: z.string().url('URL không hợp lệ'),
  description: z.string().max(1000, 'Mô tả tối đa 1000 ký tự').optional(),
  notes: z.string().max(2000, 'Ghi chú tối đa 2000 ký tự').optional(),
  categoryId: z.string().uuid().optional(),
  visibility: z.enum(['Public', 'Department', 'Team', 'Private']).optional(),
});

type LinkFormData = z.infer<typeof linkSchema>;

interface LinkFormProps {
  initialData?: Partial<CreateLinkRequest>;
  onSubmit: (data: CreateLinkRequest) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export const LinkForm: React.FC<LinkFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Tạo Link',
}) => {
  const [selectedTags, setSelectedTags] = React.useState<Tag[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: initialData?.title || '',
      url: initialData?.url || '',
      description: initialData?.description || '',
      notes: initialData?.notes || '',
      categoryId: initialData?.categoryId,
      visibility: initialData?.visibility || 'Department',
    },
  });

  const categoryId = watch('categoryId');
  const visibility = watch('visibility');

  const handleFormSubmit = async (data: LinkFormData) => {
    await onSubmit({
      ...data,
      tagIds: selectedTags.map(t => t.id),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Tiêu đề <span className="text-red-500">*</span>
        </label>
        <input
          {...register('title')}
          type="text"
          id="title"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          placeholder="Nhập tiêu đề link..."
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* URL */}
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
          URL <span className="text-red-500">*</span>
        </label>
        <input
          {...register('url')}
          type="url"
          id="url"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          placeholder="https://example.com"
        />
        {errors.url && (
          <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Mô tả
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
          placeholder="Mô tả ngắn gọn về link này..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Ghi chú
        </label>
        <textarea
          {...register('notes')}
          id="notes"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
          placeholder="Ghi chú chi tiết, hướng dẫn sử dụng..."
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Danh mục
        </label>
        <CategorySelector
          selectedCategoryId={categoryId}
          onCategoryChange={(id) => setValue('categoryId', id)}
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <TagSelector
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
        />
      </div>

      {/* Visibility */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quyền truy cập
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'Public', label: 'Công khai', icon: '🌐', desc: 'Mọi người đều xem được' },
            { value: 'Department', label: 'Phòng ban', icon: '🏢', desc: 'Chỉ phòng ban của bạn' },
            { value: 'Team', label: 'Nhóm', icon: '👥', desc: 'Chỉ nhóm của bạn' },
            { value: 'Private', label: 'Riêng tư', icon: '🔒', desc: 'Chỉ mình bạn' },
          ].map((option) => (
            <label
              key={option.value}
              className={`
                relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all
                ${visibility === option.value 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <input
                {...register('visibility')}
                type="radio"
                value={option.value}
                className="sr-only"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{option.icon}</span>
                  <span className="font-medium text-gray-900">{option.label}</span>
                </div>
                <p className="text-xs text-gray-500">{option.desc}</p>
              </div>
              {visibility === option.value && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Hủy
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Đang xử lý...' : submitLabel}
        </button>
      </div>
    </form>
  );
};
