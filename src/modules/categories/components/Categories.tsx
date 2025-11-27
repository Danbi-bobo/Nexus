import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderTree } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { categoryService } from '../../../services/category.service';
import { AddCategoryModal } from '../components/AddCategoryModal';
import type { Category } from '../../../types/models';

interface CategoryCardProps {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onEdit, onDelete }) => {
    return (
        <Card className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                    <div className="text-3xl">{category.icon || '📁'}</div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                        {category.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{category.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>{category.linkCount} links</span>
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{category.visibility}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(category)}
                        className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(category.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </Card>
    );
};

export const Categories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'tree'>('grid');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setIsLoading(true);
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            await categoryService.deleteCategory(id);
            loadCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category');
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsAddModalOpen(true);
    };

    const handleModalClose = () => {
        setIsAddModalOpen(false);
        setEditingCategory(null);
    };

    const handleSuccess = () => {
        loadCategories();
        handleModalClose();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Organize your links by project, department, system, or topic
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setViewMode(viewMode === 'grid' ? 'tree' : 'grid')}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
                    >
                        <FolderTree className="w-4 h-4" />
                        {viewMode === 'grid' ? 'Tree View' : 'Grid View'}
                    </button>
                    <Button onClick={() => setIsAddModalOpen(true)} variant="primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Category
                    </Button>
                </div>
            </div>

            {categories.length === 0 ? (
                <Card className="p-12 text-center">
                    <div className="text-6xl mb-4">📁</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No categories yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Create your first category to start organizing links
                    </p>
                    <Button onClick={() => setIsAddModalOpen(true)} variant="primary">
                        Create Category
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map(category => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            <AddCategoryModal
                isOpen={isAddModalOpen}
                onClose={handleModalClose}
                onSuccess={handleSuccess}
                editingCategory={editingCategory}
            />
        </div>
    );
};
