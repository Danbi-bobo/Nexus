// Simplified Lark Service - Frontend Only
// All API calls moved to Edge Function for security

const LARK_CONFIG = {
  appId: import.meta.env.VITE_LARK_APP_ID,
  redirectUri: import.meta.env.VITE_LARK_REDIRECT_URI,
};

class LarkService {
  /**
   * Get Lark OAuth authorization URL
   */
  getAuthorizationUrl(state: string): string {
    const authUrl = new URL("https://accounts.larksuite.com/open-apis/authen/v1/authorize");
    authUrl.searchParams.append("client_id", LARK_CONFIG.appId);
    authUrl.searchParams.append("redirect_uri", LARK_CONFIG.redirectUri);
    authUrl.searchParams.append("state", state);
    
    // Request necessary scopes
    const scopes = [
      "contact:contact.base:readonly",
      "contact:user.base:readonly",
      "contact:user.department:readonly",
      "contact:user.employee:readonly",
      "offline_access",
    ];
    authUrl.searchParams.append("scope", scopes.join(" "));

    return authUrl.toString();
  }
}

export const larkService = new LarkService();