import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

// User profile interface
export interface UserProfile {
    id: string;
    name: string;
    email?: string;
    avatarUrl?: string;
    role: string;
    departmentId?: string;
    departmentName?: string;
    jobTitle?: string;
}

// Auth state interface
interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: UserProfile | null;
}

// Auth context interface
interface AuthContextType extends AuthState {
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
interface AuthProviderProps {
    children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        isLoading: true,
        user: null,
    });

    // Fetch user profile from database
    const fetchUserProfile = async (authUser: User): Promise<void> => {
        try {
            // Fetch profile from database
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (profileError) {
                console.error('Profile fetch error:', profileError);
                throw profileError;
            }

            // If user has department_id (Lark ID),lookup the department UUID
            let departmentUuid: string | undefined;
            let departmentName: string | undefined;

            if (profile.department_id) {
                const { data: dept } = await supabase
                    .from('departments')
                    .select('id, name')
                    .eq('open_department_id', profile.department_id)
                    .single();

                if (dept) {
                    departmentUuid = dept.id;
                    departmentName = dept.name;
                }
            }

            // Update auth state with profile
            setAuthState({
                isAuthenticated: true,
                isLoading: false,
                user: {
                    id: profile.id,
                    name: profile.name,
                    email: profile.email || authUser.email,
                    avatarUrl: profile.avatar_url || undefined,
                    role: 'User', // TODO: Get from profile or determine based on permissions
                    departmentId: departmentUuid,
                    departmentName: departmentName,
                    jobTitle: profile.job_title || undefined,
                },
            });
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setAuthState({
                isAuthenticated: false,
                isLoading: false,
                user: null,
            });
        }
    };

    // Initialize auth state and listen for changes
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                fetchUserProfile(session.user);
            } else {
                setAuthState({
                    isAuthenticated: false,
                    isLoading: false,
                    user: null,
                });
            }
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state change:', event);

                if (session?.user) {
                    await fetchUserProfile(session.user);
                } else {
                    setAuthState({
                        isAuthenticated: false,
                        isLoading: false,
                        user: null,
                    });
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Logout method
    const logout = async () => {
        await supabase.auth.signOut();
        setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
        });
        console.log('User logged out');
    };

    // Refresh profile method
    const refreshProfile = async () => {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
            await fetchUserProfile(authUser);
        }
    };

    const value: AuthContextType = {
        ...authState,
        logout,
        refreshProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// useAuth hook
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
