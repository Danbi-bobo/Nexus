// Database types generated from Supabase schema
// Run: npx supabase gen types typescript --project-id <project-id> > src/types/database.types.ts

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            departments: {
                Row: {
                    id: string
                    lark_department_id: string
                    lark_parent_department_id: string | null
                    name: string
                    name_en: string | null
                    description: string | null
                    parent_id: string | null
                    member_count: number
                    leader_user_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    lark_department_id: string
                    lark_parent_department_id?: string | null
                    name: string
                    name_en?: string | null
                    description?: string | null
                    parent_id?: string | null
                    member_count?: number
                    leader_user_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    lark_department_id?: string
                    lark_parent_department_id?: string | null
                    name?: string
                    name_en?: string | null
                    description?: string | null
                    parent_id?: string | null
                    member_count?: number
                    leader_user_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    lark_user_id: string
                    lark_open_id: string
                    lark_union_id: string | null
                    email: string
                    full_name: string
                    avatar_url: string | null
                    mobile: string | null
                    employee_no: string | null
                    department_id: string | null
                    department_name: string | null
                    job_title: string | null
                    role: 'Admin' | 'Manager' | 'User' | 'Viewer'
                    is_active: boolean
                    created_at: string
                    updated_at: string
                    last_login_at: string | null
                }
                Insert: {
                    id?: string
                    lark_user_id: string
                    lark_open_id: string
                    lark_union_id?: string | null
                    email: string
                    full_name: string
                    avatar_url?: string | null
                    mobile?: string | null
                    employee_no?: string | null
                    department_id?: string | null
                    department_name?: string | null
                    job_title?: string | null
                    role?: 'Admin' | 'Manager' | 'User' | 'Viewer'
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                    last_login_at?: string | null
                }
                Update: {
                    id?: string
                    lark_user_id?: string
                    lark_open_id?: string
                    lark_union_id?: string | null
                    email?: string
                    full_name?: string
                    avatar_url?: string | null
                    mobile?: string | null
                    employee_no?: string | null
                    department_id?: string | null
                    department_name?: string | null
                    job_title?: string | null
                    role?: 'Admin' | 'Manager' | 'User' | 'Viewer'
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                    last_login_at?: string | null
                }
            }
            categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    icon: string | null
                    color: string | null
                    parent_id: string | null
                    department_id: string | null
                    visibility: 'Public' | 'Department' | 'Private'
                    link_count: number
                    sort_order: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    icon?: string | null
                    color?: string | null
                    parent_id?: string | null
                    department_id?: string | null
                    visibility?: 'Public' | 'Department' | 'Private'
                    link_count?: number
                    sort_order?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    icon?: string | null
                    color?: string | null
                    parent_id?: string | null
                    department_id?: string | null
                    visibility?: 'Public' | 'Department' | 'Private'
                    link_count?: number
                    sort_order?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            tags: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    color: string | null
                    description: string | null
                    usage_count: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    color?: string | null
                    description?: string | null
                    usage_count?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    color?: string | null
                    description?: string | null
                    usage_count?: number
                    created_at?: string
                }
            }
            links: {
                Row: {
                    id: string
                    title: string
                    url: string
                    description: string | null
                    notes: string | null
                    short_code: string | null
                    qr_code_url: string | null
                    category_id: string | null
                    department_id: string
                    owner_id: string
                    created_by: string
                    visibility: 'Public' | 'Department' | 'Team' | 'Private'
                    status: 'Active' | 'Pending' | 'Dead' | 'Archived'
                    metadata: Json
                    source: string | null
                    language: string
                    click_count: number
                    view_count: number
                    last_accessed_at: string | null
                    search_vector: unknown
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    url: string
                    description?: string | null
                    notes?: string | null
                    short_code?: string | null
                    qr_code_url?: string | null
                    category_id?: string | null
                    department_id: string
                    owner_id: string
                    created_by: string
                    visibility?: 'Public' | 'Department' | 'Team' | 'Private'
                    status?: 'Active' | 'Pending' | 'Dead' | 'Archived'
                    metadata?: Json
                    source?: string | null
                    language?: string
                    click_count?: number
                    view_count?: number
                    last_accessed_at?: string | null
                    search_vector?: unknown
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    url?: string
                    description?: string | null
                    notes?: string | null
                    short_code?: string | null
                    qr_code_url?: string | null
                    category_id?: string | null
                    department_id?: string
                    owner_id?: string
                    created_by?: string
                    visibility?: 'Public' | 'Department' | 'Team' | 'Private'
                    status?: 'Active' | 'Pending' | 'Dead' | 'Archived'
                    metadata?: Json
                    source?: string | null
                    language?: string
                    click_count?: number
                    view_count?: number
                    last_accessed_at?: string | null
                    search_vector?: unknown
                    created_at?: string
                    updated_at?: string
                }
            }
            link_tags: {
                Row: {
                    link_id: string
                    tag_id: string
                    created_at: string
                }
                Insert: {
                    link_id: string
                    tag_id: string
                    created_at?: string
                }
                Update: {
                    link_id?: string
                    tag_id?: string
                    created_at?: string
                }
            }
            audit_logs: {
                Row: {
                    id: string
                    user_id: string | null
                    action: string
                    resource_type: string
                    resource_id: string | null
                    details: Json | null
                    ip_address: string | null
                    user_agent: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    action: string
                    resource_type: string
                    resource_id?: string | null
                    details?: Json | null
                    ip_address?: string | null
                    user_agent?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    action?: string
                    resource_type?: string
                    resource_id?: string | null
                    details?: Json | null
                    ip_address?: string | null
                    user_agent?: string | null
                    created_at?: string
                }
            }
        }
        Functions: {
            upsert_department: {
                Args: {
                    p_lark_department_id: string
                    p_name: string
                    p_name_en?: string
                    p_description?: string
                    p_lark_parent_department_id?: string
                    p_member_count?: number
                    p_leader_user_id?: string
                }
                Returns: string
            }
            upsert_profile: {
                Args: {
                    p_lark_user_id: string
                    p_lark_open_id: string
                    p_lark_union_id: string
                    p_email: string
                    p_full_name: string
                    p_avatar_url?: string
                    p_mobile?: string
                    p_employee_no?: string
                    p_lark_department_id?: string
                    p_department_name?: string
                    p_job_title?: string
                    p_role?: string
                }
                Returns: string
            }
            increment_link_clicks: {
                Args: {
                    link_uuid: string
                }
                Returns: void
            }
        }
    }
}
