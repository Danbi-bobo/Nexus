import axios from 'axios';

// Lark API Base URLs
const LARK_API_BASE = 'https://open.larksuite.com/open-apis/';

// Lark Configuration
const LARK_CONFIG = {
  appId: import.meta.env.VITE_LARK_APP_ID,
  appSecret: import.meta.env.VITE_LARK_APP_SECRET,
  redirectUri: import.meta.env.VITE_LARK_REDIRECT_URI || 'http://localhost:3000/auth/callback',
};

export interface LarkUserInfo {
  user_id: string;
  open_id: string;
  union_id?: string;
  name: string;
  en_name?: string;
  email: string;
  mobile?: string;
  avatar_url?: string;
  employee_no?: string;
  department_ids?: string[];
}

export interface LarkDepartment {
  department_id: string;
  name: string;
  i18n_name?: {
    en_us?: string;
    zh_cn?: string;
  };
  parent_department_id?: string;
  member_count?: number;
  leader_user_id?: string;
}

export interface LarkTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

class LarkService {
  private tenantAccessToken: string | null = null;
  private tokenExpiry: number = 0;

  /**
   * Get Lark OAuth authorization URL
   */
  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: LARK_CONFIG.appId,
      redirect_uri: LARK_CONFIG.redirectUri,
      // state: state || Math.random().toString(36).substring(7),
    });

    return `https://accounts.larksuite.com/open-apis/authen/v1/authorize?${params.toString()}`;
  }

  /**
   * Get tenant access token (for server-to-server API calls)
   */
  private async getTenantAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.tenantAccessToken && Date.now() < this.tokenExpiry) {
      return this.tenantAccessToken;
    }

    try {
      const response = await axios.post(
        `${LARK_API_BASE}/auth/v3/tenant_access_token/internal`,
        {
          app_id: LARK_CONFIG.appId,
          app_secret: LARK_CONFIG.appSecret,
        }
      );

      if (response.data.code === 0) {
        this.tenantAccessToken = response.data.tenant_access_token;
        this.tokenExpiry = Date.now() + (response.data.expire - 60) * 1000; // Refresh 1 min before expiry
        return this.tenantAccessToken;
      }

      throw new Error(`Failed to get tenant access token: ${response.data.msg}`);
    } catch (error) {
      console.error('Error getting tenant access token:', error);
      throw error;
    }
  }

  /**
   * Exchange authorization code for user access token
   */
  async getUserAccessToken(code: string): Promise<LarkTokenResponse> {
    try {
      const response = await axios.post(
        `${LARK_API_BASE}/authen/v1/access_token`,
        {
          grant_type: 'authorization_code',
          code,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.code === 0) {
        return response.data.data;
      }

      throw new Error(`Failed to get user access token: ${response.data.msg}`);
    } catch (error) {
      console.error('Error getting user access token:', error);
      throw error;
    }
  }

  /**
   * Get user info using user access token
   */
  async getUserInfo(userAccessToken: string): Promise<LarkUserInfo> {
    try {
      const response = await axios.get(`${LARK_API_BASE}/authen/v1/user_info`, {
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
        },
      });

      if (response.data.code === 0) {
        return response.data.data;
      }

      throw new Error(`Failed to get user info: ${response.data.msg}`);
    } catch (error) {
      console.error('Error getting user info:', error);
      throw error;
    }
  }

  /**
   * Get detailed user information using tenant access token
   */
  async getUserDetail(userId: string): Promise<any> {
    try {
      const tenantToken = await this.getTenantAccessToken();
      const response = await axios.get(
        `${LARK_API_BASE}/contact/v3/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${tenantToken}`,
          },
          params: {
            user_id_type: 'user_id',
          },
        }
      );

      if (response.data.code === 0) {
        return response.data.data.user;
      }

      throw new Error(`Failed to get user detail: ${response.data.msg}`);
    } catch (error) {
      console.error('Error getting user detail:', error);
      throw error;
    }
  }

  /**
   * Get department information
   */
  async getDepartment(departmentId: string): Promise<LarkDepartment> {
    try {
      const tenantToken = await this.getTenantAccessToken();
      const response = await axios.get(
        `${LARK_API_BASE}/contact/v3/departments/${departmentId}`,
        {
          headers: {
            Authorization: `Bearer ${tenantToken}`,
          },
          params: {
            department_id_type: 'department_id',
          },
        }
      );

      if (response.data.code === 0) {
        return response.data.data.department;
      }

      throw new Error(`Failed to get department: ${response.data.msg}`);
    } catch (error) {
      console.error('Error getting department:', error);
      throw error;
    }
  }

  /**
   * Get all departments (for initial sync)
   */
  async getAllDepartments(): Promise<LarkDepartment[]> {
    try {
      const tenantToken = await this.getTenantAccessToken();
      const departments: LarkDepartment[] = [];
      let pageToken: string | undefined;

      do {
        const response = await axios.get(`${LARK_API_BASE}/contact/v3/departments`, {
          headers: {
            Authorization: `Bearer ${tenantToken}`,
          },
          params: {
            department_id_type: 'department_id',
            page_size: 50,
            page_token: pageToken,
          },
        });

        if (response.data.code === 0) {
          departments.push(...response.data.data.items);
          pageToken = response.data.data.page_token;
        } else {
          throw new Error(`Failed to get departments: ${response.data.msg}`);
        }
      } while (pageToken);

      return departments;
    } catch (error) {
      console.error('Error getting all departments:', error);
      throw error;
    }
  }
}

export const larkService = new LarkService();
