import { supabase } from '../lib/supabase';

export interface UserProfile {
    userId: string;
    name: string;
    email: string;
    avatarUrl?: string;
    jobTitle?: string;
    departmentId?: string; // UUID from departments table
    departmentName?: string;
    departmentLarkId?: string; // TEXT Lark department ID
}

/**
 * Get current authenticated user and their profile from database
 * @throws Error if user is not authenticated or profile not found
 */
export async function getCurrentUserProfile(): Promise<UserProfile> {
    // Get authenticated user from Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error('User not authenticated');
    }

    // Fetch user profile - need to join with departments using TEXT field
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw new Error('User profile not found');
    }

    // If user has department_id (Lark ID), lookup the department UUID
    let departmentUuid: string | undefined;
    let departmentName: string | undefined;

    if (profile.department_id) {
        const { data: dept } = await supabase
            .from('departments')
            .select('id, name')
            .eq('open_department_id', profile.department_id)
            .single();

        if (dept) {
            departmentUuid = dept.id;
            departmentName = dept.name;
        }
    }

    // Map to UserProfile interface
    return {
        userId: profile.id,
        name: profile.name,
        email: profile.email || '',
        avatarUrl: profile.avatar_url || undefined,
        jobTitle: profile.job_title || undefined,
        departmentId: departmentUuid,
        departmentName: departmentName,
        departmentLarkId: profile.department_id || undefined,
    };
}

/**
 * Get current user's department UUID  
 * @returns Department UUID or null if user has no department
 */
export async function getCurrentUserDepartmentId(): Promise<string | null> {
    try {
        const profile = await getCurrentUserProfile();
        return profile.departmentId || null;
    } catch (error) {
        console.error('Error getting user department:', error);
        return null;
    }
}
