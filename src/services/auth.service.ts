import { supabase } from '../lib/supabase';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  departmentId?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

class AuthService {
  /**
   * Sign up with email and password
   */
  async signUp(data: SignUpData) {
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned from signup');

      // 2. Create profile directly
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          lark_user_id: authData.user.id,
          lark_open_id: authData.user.id,
          lark_union_id: null,
          email: data.email,
          full_name: data.fullName,
          avatar_url: null,
          mobile: null,
          employee_no: null,
          department_id: data.departmentId || null,
          department_name: null,
          job_title: null,
          role: 'User',
          is_active: true,
        })
        .select()
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Continue anyway - user can still login
      }

      // 3. Auto login after signup
      if (profile) {
        localStorage.setItem('user_profile_id', profile.id);
      }

      return {
        success: true,
        user: authData.user,
        session: authData.session,
        profile,
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Signup failed',
      };
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(data: SignInData) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      if (!authData.user) throw new Error('No user returned from signin');

      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', data.email)
        .single();

      // Update last login
      if (profile) {
        await supabase
          .from('profiles')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', profile.id);

        // Store profile ID in localStorage
        localStorage.setItem('user_profile_id', profile.id);
      }

      return {
        success: true,
        user: authData.user,
        session: authData.session,
        profile,
      };
    } catch (error) {
      console.error('Signin error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Signin failed',
      };
    }
  }

  /**
   * Sign out
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear local storage
      localStorage.removeItem('user_profile_id');

      return { success: true };
    } catch (error) {
      console.error('Signout error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Signout failed',
      };
    }
  }

  /**
   * Get current session
   */
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  /**
   * Reset password
   */
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${import.meta.env.VITE_LARK_REDIRECT_URI}/reset-password`,
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Reset password failed',
      };
    }
  }

  /**
   * Update password
   */
  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Update password error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Update password failed',
      };
    }
  }
}

export const authService = new AuthService();
