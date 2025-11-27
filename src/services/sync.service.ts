import { supabase } from '../lib/supabase';

export interface SyncResult {
  success: boolean;
  profileId?: string;
  departmentId?: string;
  error?: string;
}

class SyncService {
  /**
   * Complete sync process via Edge Function
   * Edge Function handles: token exchange + user info + department sync + profile creation
   */
  async syncUserData(code: string): Promise<SyncResult> {
    try {
      // Call Edge Function - it handles everything server-side
      const { data, error } = await supabase.functions.invoke('lark-oauth-callback', {
        body: { code, redirectUri: 'https://nexus-ashy-eight.vercel.app/auth' },
      });

      if (error) {
        console.error('Edge Function error:', error);
        return {
          success: false,
          error: error.message || 'Failed to sync user data',
        };
      }

      if (!data.success) {
        return {
          success: false,
          error: data.error || 'Authentication failed',
        };
      }

      return {
        success: true,
        profileId: data.profile?.id,
        departmentId: data.profile?.department_id,
      };
    } catch (error) {
      console.error('Error in syncUserData:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get user profile by Lark user ID
   */
  async getProfileByLarkUserId(larkUserId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('lark_user_id', larkUserId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  }
}

export const syncService = new SyncService();