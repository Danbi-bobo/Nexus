import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { larkService } from '../services/lark.service';
import { authService } from '../services/auth.service';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<'lark' | 'email'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLarkLogin = () => {
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('lark_oauth_state', state);
    
    const authUrl = larkService.getAuthorizationUrl(state);
    window.location.href = authUrl;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authService.signIn({ email, password });

      if (!result.success) {
        setError(result.error || 'Đăng nhập thất bại');
        setLoading(false);
        return;
      }

      // Redirect to dashboard
      navigate('/');
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-2xl mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Nexus
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Link Management System
          </p>
        </div>

        {/* Login Method Toggle */}
        <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setLoginMethod('email')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              loginMethod === 'email'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setLoginMethod('lark')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              loginMethod === 'lark'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Lark SSO
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Email Login Form */}
        {loginMethod === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <Input
              id="email"
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />

            <Input
              id="password"
              type="password"
              label="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <div className="flex items-center justify-between text-sm">
              <Link
                to="/forgot-password"
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 text-lg font-semibold"
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Chưa có tài khoản?{' '}
              <Link
                to="/signup"
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-medium"
              >
                Đăng ký ngay
              </Link>
            </div>
          </form>
        )}

        {/* Lark SSO */}
        {loginMethod === 'lark' && (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Đăng nhập với Lark
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Sử dụng tài khoản Lark của tổ chức để đăng nhập
              </p>
            </div>

            <Button
              onClick={handleLarkLogin}
              variant="primary"
              className="w-full py-3 text-lg font-semibold flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
              Đăng nhập với Lark
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Bằng cách đăng nhập, bạn đồng ý với</p>
          <p className="mt-1">
            <a href="#" className="text-indigo-600 hover:underline">Điều khoản sử dụng</a>
            {' và '}
            <a href="#" className="text-indigo-600 hover:underline">Chính sách bảo mật</a>
          </p>
        </div>
      </div>
    </div>
  );
};
