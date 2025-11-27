import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';
import type { Tag, CreateTagRequest } from '../types/models';

type TagRow = Database['public']['Tables']['tags']['Row'];
type TagInsert = Database['public']['Tables']['tags']['Insert'];

class TagService {
    /**
     * Get all tags
     */
    async getTags(): Promise<Tag[]> {
        const { data, error } = await supabase
            .from('tags')
            .select('*')
            .order('usage_count', { ascending: false });

        if (error) {
            console.error('Error fetching tags:', error);
            throw error;
        }

        return (data || []).map(this.transformTagRow);
    }

    /**
     * Get tag by ID
     */
    async getTag(id: string): Promise<Tag | null> {
        const { data, error } = await supabase
            .from('tags')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching tag:', error);
            return null;
        }

        if (!data) return null;

        return this.transformTagRow(data);
    }

    /**
     * Get tag by slug
     */
    async getTagBySlug(slug: string): Promise<Tag | null> {
        const { data, error } = await supabase
            .from('tags')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error('Error fetching tag by slug:', error);
            return null;
        }

        if (!data) return null;

        return this.transformTagRow(data);
    }

    /**
     * Search tags by name
     */
    async searchTags(query: string): Promise<Tag[]> {
        const { data, error } = await supabase
            .from('tags')
            .select('*')
            .ilike('name', `%${query}%`)
            .order('usage_count', { ascending: false })
            .limit(10);

        if (error) {
            console.error('Error searching tags:', error);
            throw error;
        }

        return (data || []).map(this.transformTagRow);
    }

    /**
     * Get popular tags
     */
    async getPopularTags(limit: number = 20): Promise<Tag[]> {
        const { data, error } = await supabase
            .from('tags')
            .select('*')
            .order('usage_count', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching popular tags:', error);
            throw error;
        }

        return (data || []).map(this.transformTagRow);
    }

    /**
     * Create a new tag
     */
    async createTag(request: CreateTagRequest): Promise<Tag> {
        const tagData: TagInsert = {
            name: request.name,
            slug: request.slug,
            color: request.color,
            description: request.description,
        };

        const { data, error } = await supabase
            .from('tags')
            .insert(tagData)
            .select()
            .single();

        if (error) {
            console.error('Error creating tag:', error);
            throw error;
        }

        return this.transformTagRow(data);
    }

    /**
     * Create tag if not exists, otherwise return existing
     */
    async getOrCreateTag(name: string, color?: string): Promise<Tag> {
        const slug = this.slugify(name);

        // Try to get existing tag
        const existing = await this.getTagBySlug(slug);
        if (existing) return existing;

        // Create new tag
        return this.createTag({
            name,
            slug,
            color,
        });
    }

    /**
     * Delete a tag
     */
    async deleteTag(id: string): Promise<void> {
        const { error } = await supabase
            .from('tags')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting tag:', error);
            throw error;
        }
    }

    /**
     * Get tags for a link
     */
    async getTagsForLink(linkId: string): Promise<Tag[]> {
        const { data, error } = await supabase
            .from('link_tags')
            .select('tag:tags(*)')
            .eq('link_id', linkId);

        if (error) {
            console.error('Error fetching tags for link:', error);
            throw error;
        }

        return (data || []).map((lt: any) => this.transformTagRow(lt.tag));
    }

    /**
     * Helper: slugify string
     */
    private slugify(text: string): string {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    /**
     * Transform database row to domain model
     */
    private transformTagRow(row: TagRow): Tag {
        return {
            id: row.id,
            name: row.name,
            slug: row.slug,
            color: row.color || undefined,
            description: row.description || undefined,
            usageCount: row.usage_count,
            createdAt: row.created_at,
        };
    }
}

export const tagService = new TagService();
