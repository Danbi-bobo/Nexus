import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const LARK_APP_ID = import.meta.env.VITE_LARK_APP_ID;
const REDIRECT_URI = import.meta.env.VITE_LARK_REDIRECT_URI;

export default function LarkLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle OAuth callback
  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const state = params.get("state");

      if (!code) return;

      setLoading(true);
      
      try {
        // Verify state to prevent CSRF
        const savedState = sessionStorage.getItem("lark_oauth_state");
        if (state !== savedState) {
          throw new Error("Invalid state parameter");
        }

        // Call Edge Function to exchange code and create session
        const { data, error: functionError } = await supabase.functions.invoke(
          "lark-oauth-callback",
          {
            body: { 
                code,
                redirectUri: 'https://nexus-ashy-eight.vercel.app/auth'
             },
          }
        );

        if (functionError) {
          throw functionError;
        }

        if (!data.success) {
          throw new Error(data.error || "Failed to authenticate");
        }

        // Supabase session is now created by Edge Function
        // Just store profile ID for quick access
        if (data.profile?.id) {
          localStorage.setItem("user_profile_id", data.profile.id);
        }

        // Clear OAuth state
        sessionStorage.removeItem("lark_oauth_state");

        // Navigate to dashboard
        navigate("/dashboard");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Authentication failed");
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate]);

  // Initiate OAuth flow
  const handleLogin = () => {
    // Generate state for CSRF protection
    const state = crypto.randomUUID();
    sessionStorage.setItem("lark_oauth_state", state);

    // Build authorization URL
    const authUrl = new URL("https://accounts.larksuite.com/open-apis/authen/v1/authorize");
    authUrl.searchParams.append("client_id", LARK_APP_ID);
    authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
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

    // Redirect to Lark authorization page
    window.location.href = authUrl.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Đăng nhập</h2>
          <p className="mt-2 text-gray-600">
            Sử dụng tài khoản Lark của bạn để tiếp tục
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
          Đăng nhập bằng Lark
        </button>

        <p className="text-xs text-center text-gray-500">
          Bằng cách đăng nhập, bạn đồng ý với điều khoản sử dụng
        </p>
      </div>
    </div>
  );
}