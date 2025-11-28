import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Đang xử lý đăng nhập...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        console.log('OAuth callback received:', { hasCode: !!code, hasState: !!state });

        const savedState = sessionStorage.getItem('lark_oauth_state');
        if (!state || state !== savedState) {
          throw new Error('Invalid state parameter - possible CSRF attack');
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        sessionStorage.removeItem('lark_oauth_state');
        setMessage('Đang xác thực với Lark...');

        console.log('Calling Edge Function with code...');
        const { data, error } = await supabase.functions.invoke('lark-oauth-callback', {
          body: {
            code,
            redirectUri: 'https://nexus-ashy-eight.vercel.app/auth'
          },
        });

        if (error) {
          console.error('Edge Function error:', error);
          throw error;
        }

        console.log('Edge Function response:', { success: data?.success });

        if (!data.success) {
          throw new Error(data.error || 'Authentication failed');
        }

        setMessage('Đăng nhập thành công! Đang chuyển hướng...');
        setStatus('success');

        // Use auth context to save session
        if (data.profile?.id) {
          login({
            id: data.profile.id,
            name: data.profile.name,
            avatarUrl: data.profile.avatar_url,
            role: data.profile.role ?? "User",
            email: data.profile.email,
            departmentId: data.profile.department_id,
            departmentName: data.profile.department_name,
            jobTitle: data.profile.job_title,
          });
        }

        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);

      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage(
          error instanceof Error
            ? `Lỗi: ${error.message}`
            : 'Đã xảy ra lỗi trong quá trình đăng nhập'
        );

        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full mx-4">
        <div className="text-center">
          {status === 'loading' && (
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-6">
              <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}

          {status === 'success' && (
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}

          {status === 'error' && (
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {status === 'loading' && 'Đang xử lý...'}
            {status === 'success' && 'Thành công!'}
            {status === 'error' && 'Có lỗi xảy ra'}
          </h2>

          <p className="text-gray-600 dark:text-gray-400">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};