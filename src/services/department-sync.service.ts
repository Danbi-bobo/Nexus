import { supabase } from '../lib/supabase';

export interface SyncDepartmentsResult {
    success: boolean;
    total?: number;
    summary?: {
        total_found: number;
        synced: number;
        errors: number;
    };
    message?: string;
    error?: string;
}

class DepartmentSyncService {
    /**
     * Manually trigger department sync from Lark
     * This can be called by admin users to refresh department data
     */
    async syncDepartments(): Promise<SyncDepartmentsResult> {
        try {
            console.log('Starting department sync...');

            const { data, error } = await supabase.functions.invoke('sync_departments', {
                body: { "name": "Functions" }
            });

            if (error) {
                console.error('Edge Function error:', error);
                return {
                    success: false,
                    error: error.message || 'Failed to sync departments',
                };
            }

            if (!data || !data.success) {
                return {
                    success: false,
                    error: data?.error || 'Department sync failed',
                };
            }

            console.log('Department sync completed:', data);
            return data;

        } catch (error) {
            console.error('Error in syncDepartments:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Get all departments from database
     */
    async getDepartments() {
        const { data, error } = await supabase
            .from('departments')
            .select('*')
            .order('name');

        if (error) {
            console.error('Error fetching departments:', error);
            return null;
        }

        return data;
    }

    /**
     * Get department by ID
     */
    async getDepartmentById(larkDepartmentId: string) {
        const { data, error } = await supabase
            .from('departments')
            .select('*')
            .eq('lark_department_id', larkDepartmentId)
            .single();

        if (error) {
            console.error('Error fetching department:', error);
            return null;
        }

        return data;
    }

    /**
     * Get department hierarchy (tree structure)
     */
    async getDepartmentTree() {
        const departments = await this.getDepartments();
        if (!departments) return [];

        // Build tree structure
        const deptMap = new Map();
        const rootDepts: any[] = [];

        // First pass: create map
        departments.forEach(dept => {
            deptMap.set(dept.lark_department_id, { ...dept, children: [] });
        });

        // Second pass: build tree
        departments.forEach(dept => {
            const current = deptMap.get(dept.lark_department_id);

            if (dept.lark_parent_department_id) {
                const parent = deptMap.get(dept.lark_parent_department_id);
                if (parent) {
                    parent.children.push(current);
                } else {
                    rootDepts.push(current);
                }
            } else {
                rootDepts.push(current);
            }
        });

        return rootDepts;
    }
}

export const departmentSyncService = new DepartmentSyncService();