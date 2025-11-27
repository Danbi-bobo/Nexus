import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';
import type {
    Link,
    CreateLinkRequest,
    UpdateLinkRequest,
    SearchLinksRequest,
    SearchLinksResponse,
} from '../types/models';

type LinkRow = Database['public']['Tables']['links']['Row'];
type LinkInsert = Database['public']['Tables']['links']['Insert'];
type LinkUpdate = Database['public']['Tables']['links']['Update'];

class LinkService {
    /**
     * Get all links with optional filters
     */
    async getLinks(filters?: SearchLinksRequest): Promise<SearchLinksResponse> {
        let query = supabase
            .from('links')
            .select(`
        *,
        category:categories(*),
        owner:profiles!links_owner_id_fkey(*),
        created_by:profiles!links_created_by_fkey(*),
        department:departments(*),
        tags:link_tags(tag:tags(*))
      `, { count: 'exact' });

        // Apply filters
        if (filters?.query) {
            query = query.textSearch('search_vector', filters.query);
        }

        if (filters?.categoryId) {
            query = query.eq('category_id', filters.categoryId);
        }

        if (filters?.departmentId) {
            query = query.eq('department_id', filters.departmentId);
        }

        if (filters?.status) {
            query = query.eq('status', filters.status);
        }

        if (filters?.visibility) {
            query = query.eq('visibility', filters.visibility);
        }

        if (filters?.tagIds && filters.tagIds.length > 0) {
            // Filter by tags using inner join
            query = query.in('id',
                supabase
                    .from('link_tags')
                    .select('link_id')
                    .in('tag_id', filters.tagIds)
            );
        }

        // Sorting
        const sortBy = filters?.sortBy || 'created_at';
        const sortOrder = filters?.sortOrder || 'desc';
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });

        // Pagination
        const limit = filters?.limit || 20;
        const offset = filters?.offset || 0;
        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching links:', error);
            throw error;
        }

        // Transform database rows to domain models
        const links = (data || []).map(this.transformLinkRow);

        return {
            links,
            total: count || 0,
            limit,
            offset,
        };
    }

    /**
     * Get a single link by ID
     */
    async getLink(id: string): Promise<Link | null> {
        const { data, error } = await supabase
            .from('links')
            .select(`
        *,
        category:categories(*),
        owner:profiles!links_owner_id_fkey(*),
        created_by:profiles!links_created_by_fkey(*),
        department:departments(*),
        tags:link_tags(tag:tags(*))
      `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching link:', error);
            throw error;
        }

        if (!data) return null;

        return this.transformLinkRow(data);
    }

    /**
     * Get link by short code
     */
    async getLinkByShortCode(shortCode: string): Promise<Link | null> {
        const { data, error } = await supabase
            .from('links')
            .select(`
        *,
        category:categories(*),
        owner:profiles!links_owner_id_fkey(*),
        created_by:profiles!links_created_by_fkey(*),
        department:departments(*),
        tags:link_tags(tag:tags(*))
      `)
            .eq('short_code', shortCode)
            .single();

        if (error) {
            console.error('Error fetching link by short code:', error);
            return null;
        }

        if (!data) return null;

        return this.transformLinkRow(data);
    }

    /**
     * Create a new link
     */
    async createLink(request: CreateLinkRequest): Promise<Link> {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Get user profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('id, department_id')
            .eq('lark_user_id', user.id)
            .single();

        if (!profile) throw new Error('User profile not found');

        // Prepare link data
        const linkData: LinkInsert = {
            title: request.title,
            url: request.url,
            description: request.description,
            notes: request.notes,
            category_id: request.categoryId,
            department_id: profile.department_id!,
            owner_id: profile.id,
            created_by: profile.id,
            visibility: request.visibility || 'Department',
            metadata: request.metadata || {},
        };

        // Insert link
        const { data: link, error: linkError } = await supabase
            .from('links')
            .insert(linkData)
            .select()
            .single();

        if (linkError) {
            console.error('Error creating link:', linkError);
            throw linkError;
        }

        // Add tags if provided
        if (request.tagIds && request.tagIds.length > 0) {
            const tagLinks = request.tagIds.map(tagId => ({
                link_id: link.id,
                tag_id: tagId,
            }));

            const { error: tagError } = await supabase
                .from('link_tags')
                .insert(tagLinks);

            if (tagError) {
                console.error('Error adding tags:', tagError);
            }
        }

        // Fetch complete link with relations
        return this.getLink(link.id) as Promise<Link>;
    }

    /**
     * Update a link
     */
    async updateLink(id: string, request: UpdateLinkRequest): Promise<Link> {
        const linkData: LinkUpdate = {
            title: request.title,
            url: request.url,
            description: request.description,
            notes: request.notes,
            category_id: request.categoryId,
            visibility: request.visibility,
            status: request.status,
            metadata: request.metadata,
        };

        const { error } = await supabase
            .from('links')
            .update(linkData)
            .eq('id', id);

        if (error) {
            console.error('Error updating link:', error);
            throw error;
        }

        // Update tags if provided
        if (request.tagIds !== undefined) {
            // Remove existing tags
            await supabase
                .from('link_tags')
                .delete()
                .eq('link_id', id);

            // Add new tags
            if (request.tagIds.length > 0) {
                const tagLinks = request.tagIds.map(tagId => ({
                    link_id: id,
                    tag_id: tagId,
                }));

                await supabase
                    .from('link_tags')
                    .insert(tagLinks);
            }
        }

        // Fetch updated link
        return this.getLink(id) as Promise<Link>;
    }

    /**
     * Delete a link
     */
    async deleteLink(id: string): Promise<void> {
        const { error } = await supabase
            .from('links')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting link:', error);
            throw error;
        }
    }

    /**
     * Increment click count
     */
    async incrementClickCount(id: string): Promise<void> {
        const { error } = await supabase.rpc('increment_link_clicks', {
            link_uuid: id,
        });

        if (error) {
            console.error('Error incrementing click count:', error);
            throw error;
        }
    }

    /**
     * Get recent links
     */
    async getRecentLinks(limit: number = 10): Promise<Link[]> {
        const { data, error } = await supabase
            .from('links')
            .select(`
        *,
        category:categories(*),
        owner:profiles!links_owner_id_fkey(*),
        created_by:profiles!links_created_by_fkey(*),
        department:departments(*),
        tags:link_tags(tag:tags(*))
      `)
            .eq('status', 'Active')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching recent links:', error);
            throw error;
        }

        return (data || []).map(this.transformLinkRow);
    }

    /**
     * Get popular links
     */
    async getPopularLinks(limit: number = 10): Promise<Link[]> {
        const { data, error } = await supabase
            .from('links')
            .select(`
        *,
        category:categories(*),
        owner:profiles!links_owner_id_fkey(*),
        created_by:profiles!links_created_by_fkey(*),
        department:departments(*),
        tags:link_tags(tag:tags(*))
      `)
            .eq('status', 'Active')
            .order('click_count', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching popular links:', error);
            throw error;
        }

        return (data || []).map(this.transformLinkRow);
    }

    /**
     * Transform database row to domain model
     */
    private transformLinkRow(row: any): Link {
        return {
            id: row.id,
            title: row.title,
            url: row.url,
            description: row.description,
            notes: row.notes,
            shortCode: row.short_code,
            qrCodeUrl: row.qr_code_url,
            category: row.category,
            categoryId: row.category_id,
            department: row.department,
            departmentId: row.department_id,
            owner: row.owner,
            ownerId: row.owner_id,
            createdBy: row.created_by,
            createdById: row.created_by,
            tags: row.tags?.map((lt: any) => lt.tag) || [],
            visibility: row.visibility,
            status: row.status,
            metadata: row.metadata,
            source: row.source,
            language: row.language,
            clickCount: row.click_count,
            viewCount: row.view_count,
            lastAccessedAt: row.last_accessed_at,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }
}

export const linkService = new LinkService();
