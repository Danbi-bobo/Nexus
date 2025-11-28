import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';
import type {
    Category,
    CreateCategoryRequest,
    UpdateCategoryRequest,
} from '../types/models';

type CategoryRow = Database['public']['Tables']['categories']['Row'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

class CategoryService {
    /**
     * Get all categories
     */
    async getCategories(departmentId?: string): Promise<Category[]> {
        let query = supabase
            .from('categories')
            .select('*')
            .order('sort_order', { ascending: true });

        if (departmentId) {
            query = query.eq('department_id', departmentId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }

        return (data || []).map(this.transformCategoryRow);
    }

    /**
     * Get category by ID
     */
    async getCategory(id: string): Promise<Category | null> {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching category:', error);
            return null;
        }

        if (!data) return null;

        return this.transformCategoryRow(data);
    }

    /**
     * Get category by slug
     */
    async getCategoryBySlug(slug: string, departmentId?: string): Promise<Category | null> {
        let query = supabase
            .from('categories')
            .select('*')
            .eq('slug', slug);

        if (departmentId) {
            query = query.eq('department_id', departmentId);
        }

        const { data, error } = await query.single();

        if (error) {
            console.error('Error fetching category by slug:', error);
            return null;
        }

        if (!data) return null;

        return this.transformCategoryRow(data);
    }

    /**
     * Get hierarchical categories (tree structure)
     */
    async getCategoryTree(departmentId?: string): Promise<Category[]> {
        const categories = await this.getCategories(departmentId);

        // Build tree structure
        const categoryMap = new Map<string, Category & { children?: Category[] }>();
        const rootCategories: (Category & { children?: Category[] })[] = [];

        // First pass: create map
        categories.forEach(cat => {
            categoryMap.set(cat.id, { ...cat, children: [] });
        });

        // Second pass: build tree
        categories.forEach(cat => {
            const category = categoryMap.get(cat.id)!;
            if (cat.parentId) {
                const parent = categoryMap.get(cat.parentId);
                if (parent) {
                    parent.children!.push(category);
                } else {
                    rootCategories.push(category);
                }
            } else {
                rootCategories.push(category);
            }
        });

        return rootCategories;
    }

    /**
     * Create a new category
     */
    async createCategory(request: CreateCategoryRequest): Promise<Category> {
        // Get current user from localStorage (Lark SSO)
        const userProfileStr = localStorage.getItem('userProfile');
        if (!userProfileStr) {
            throw new Error('User not authenticated');
        }

        const userProfile = JSON.parse(userProfileStr);
        const departmentId = userProfile.department_id;

        if (!departmentId) {
            throw new Error('User department not found');
        }

        const categoryData: CategoryInsert = {
            name: request.name,
            slug: request.slug,
            description: request.description,
            icon: request.icon,
            color: request.color,
            parent_id: request.parentId,
            department_id: departmentId,
            visibility: request.visibility || 'Department',
            sort_order: request.sortOrder || 0,
        };

        const { data, error } = await supabase
            .from('categories')
            .insert(categoryData)
            .select()
            .single();

        if (error) {
            console.error('Error creating category:', error);
            throw error;
        }

        return this.transformCategoryRow(data);
    }

    /**
     * Update a category
     */
    async updateCategory(id: string, request: UpdateCategoryRequest): Promise<Category> {
        const categoryData: CategoryUpdate = {
            name: request.name,
            slug: request.slug,
            description: request.description,
            icon: request.icon,
            color: request.color,
            parent_id: request.parentId,
            visibility: request.visibility,
            sort_order: request.sortOrder,
        };

        const { data, error } = await supabase
            .from('categories')
            .update(categoryData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating category:', error);
            throw error;
        }

        return this.transformCategoryRow(data);
    }

    /**
     * Delete a category
     */
    async deleteCategory(id: string): Promise<void> {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }

    /**
     * Reorder categories
     */
    async reorderCategories(categoryIds: string[]): Promise<void> {
        const updates = categoryIds.map((id, index) => ({
            id,
            sort_order: index,
        }));

        for (const update of updates) {
            await supabase
                .from('categories')
                .update({ sort_order: update.sort_order })
                .eq('id', update.id);
        }
    }

    /**
     * Transform database row to domain model
     */
    private transformCategoryRow(row: CategoryRow): Category {
        return {
            id: row.id,
            name: row.name,
            slug: row.slug,
            description: row.description || undefined,
            icon: row.icon || undefined,
            color: row.color || undefined,
            parentId: row.parent_id || undefined,
            departmentId: row.department_id || undefined,
            visibility: row.visibility,
            linkCount: row.link_count,
            sortOrder: row.sort_order,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }
}

export const categoryService = new CategoryService();
