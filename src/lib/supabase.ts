import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Database {
  public: {
    Tables: {
      departments: {
        Row: {
          id: string;
          lark_department_id: string;
          lark_parent_department_id: string | null;
          name: string;
          name_en: string | null;
          description: string | null;
          parent_id: string | null;
          member_count: number;
          leader_user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['departments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['departments']['Insert']>;
      };
      profiles: {
        Row: {
          id: string;
          lark_user_id: string;
          lark_open_id: string;
          lark_union_id: string | null;
          email: string;
          full_name: string;
          avatar_url: string | null;
          mobile: string | null;
          employee_no: string | null;
          department_id: string | null;
          department_name: string | null;
          job_title: string | null;
          role: 'Admin' | 'Manager' | 'User' | 'Viewer';
          is_active: boolean;
          created_at: string;
          updated_at: string;
          last_login_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
    };
  };
}
