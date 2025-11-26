import { supabase } from '../lib/supabase';
import { larkService, LarkUserInfo, LarkDepartment } from './lark.service';

export interface SyncResult {
  success: boolean;
  profileId?: string;
  departmentId?: string;
  error?: string;
}

class SyncService {
  /**
   * Sync department from Lark to Supabase
   */
  async syncDepartment(larkDepartment: LarkDepartment): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('upsert_department', {
        p_lark_department_id: larkDepartment.department_id,
        p_name: larkDepartment.name,
        p_name_en: larkDepartment.i18n_name?.en_us || null,
        p_description: null,
        p_lark_parent_department_id: larkDepartment.parent_department_id || null,
        p_member_count: larkDepartment.member_count || 0,
        p_leader_user_id: larkDepartment.leader_user_id || null,
      });

      if (error) {
        console.error('Error syncing department:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in syncDepartment:', error);
      return null;
    }
  }

  /**
   * Sync user profile from Lark to Supabase
   */
  async syncProfile(
    larkUserInfo: LarkUserInfo,
    userDetail: any,
    departmentId?: string
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('upsert_profile', {
        p_lark_user_id: larkUserInfo.user_id,
        p_lark_open_id: larkUserInfo.open_id,
        p_lark_union_id: larkUserInfo.union_id || null,
        p_email: larkUserInfo.email,
        p_full_name: larkUserInfo.name,
        p_avatar_url: larkUserInfo.avatar_url || userDetail?.avatar?.avatar_origin || null,
        p_mobile: larkUserInfo.mobile || userDetail?.mobile || null,
        p_employee_no: larkUserInfo.employee_no || userDetail?.employee_no || null,
        p_lark_department_id: larkUserInfo.department_ids?.[0] || null,
        p_department_name: userDetail?.department_name || null,
        p_job_title: userDetail?.job_title || null,
        p_role: 'User', // Default role, can be updated later
      });

      if (error) {
        console.error('Error syncing profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in syncProfile:', error);
      return null;
    }
  }

  /**
   * Complete sync process: departments + user profile
   */
  async syncUserData(code: string): Promise<SyncResult> {
    try {
      // Step 1: Get user access token
      const tokenResponse = await larkService.getUserAccessToken(code);
      
      // Step 2: Get user info
      const userInfo = await larkService.getUserInfo(tokenResponse.access_token);
      
      // Step 3: Get detailed user info
      const userDetail = await larkService.getUserDetail(userInfo.user_id);
      
      // Step 4: Sync user's department(s)
      let departmentId: string | null = null;
      if (userInfo.department_ids && userInfo.department_ids.length > 0) {
        const primaryDepartmentId = userInfo.department_ids[0];
        const department = await larkService.getDepartment(primaryDepartmentId);
        departmentId = await this.syncDepartment(department);
      }
      
      // Step 5: Sync user profile
      const profileId = await this.syncProfile(userInfo, userDetail, departmentId || undefined);
      
      if (!profileId) {
        return {
          success: false,
          error: 'Failed to sync user profile',
        };
      }

      return {
        success: true,
        profileId,
        departmentId: departmentId || undefined,
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
   * Sync all departments (for initial setup or periodic refresh)
   */
  async syncAllDepartments(): Promise<number> {
    try {
      const departments = await larkService.getAllDepartments();
      let syncedCount = 0;

      for (const department of departments) {
        const result = await this.syncDepartment(department);
        if (result) {
          syncedCount++;
        }
      }

      return syncedCount;
    } catch (error) {
      console.error('Error syncing all departments:', error);
      return 0;
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
