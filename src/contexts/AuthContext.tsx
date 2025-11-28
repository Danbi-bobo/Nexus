import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    login: (profile: UserProfile) => void;
    logout: () => void;
    updateProfile: (profile: Partial<UserProfile>) => void;
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

    // Restore session from localStorage on mount
    useEffect(() => {
        const restoreSession = () => {
            try {
                const userProfileData = localStorage.getItem('user_profile');
                if (userProfileData) {
                    const user = JSON.parse(userProfileData) as UserProfile;
                    setAuthState({
                        isAuthenticated: true,
                        isLoading: false,
                        user,
                    });
                    console.log('Session restored:', user);
                } else {
                    setAuthState({
                        isAuthenticated: false,
                        isLoading: false,
                        user: null,
                    });
                }
            } catch (error) {
                console.error('Error restoring session:', error);
                setAuthState({
                    isAuthenticated: false,
                    isLoading: false,
                    user: null,
                });
            }
        };

        restoreSession();
    }, []);

    // Login method
    const login = (profile: UserProfile) => {
        localStorage.setItem('user_profile', JSON.stringify(profile));
        setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user: profile,
        });
        console.log('User logged in:', profile);
    };

    // Logout method
    const logout = () => {
        localStorage.removeItem('user_profile');
        setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
        });
        console.log('User logged out');
    };

    // Update profile method
    const updateProfile = (profileUpdate: Partial<UserProfile>) => {
        if (authState.user) {
            const updatedUser = { ...authState.user, ...profileUpdate };
            localStorage.setItem('user_profile', JSON.stringify(updatedUser));
            setAuthState({
                ...authState,
                user: updatedUser,
            });
            console.log('Profile updated:', updatedUser);
        }
    };

    const value: AuthContextType = {
        ...authState,
        login,
        logout,
        updateProfile,
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
