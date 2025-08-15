import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../services/user";
import { login as loginApi } from "../services/auth";
import { axiosInstance } from "../services/api";

export const AuthContext = createContext();
const logoutUrl = import.meta.env.VITE_AUTH_LOGOUT;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // function to fetch user profile and set auth state
    const fetchUserProfile = async () => {
        try {
            const profileData = await getUserDetails();
            setUser(profileData);
            setIsAuthenticated(true);
            return profileData;
        } catch (error) {
            if (error.response?.status !== 401 && error.response?.status !== 403) {
                console.error('Failed to fetch profile:', error);
            }
            setUser(null);
            setIsAuthenticated(false);
            return null;
        }
    };

    // On app mount, check if already authenticated (via cookie)
    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log('Checking auth'); // Debug log
                await fetchUserProfile();
            } catch (e) {
                console.error('checkAuth error:', e); // Catch unexpected errors
            } finally {
                setIsLoading(false);
                console.log('isLoading set to false'); // Debug log
            }
        };
        checkAuth();
    }, []);


    const login = async (credentials) => {
        try {
            await loginApi(credentials);
            const profile = await fetchUserProfile();
            if (profile) {
                if (profile.roles?.includes('ADMIN') || profile.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/user-profile');
                }
            } else {
                throw new Error('Profile fetch failed after login');
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    // Logout function: Call logout API, clear state, navigate to login
    const logout = async () => {
        try {
            await axiosInstance.post(logoutUrl);
            setUser(null);
            setIsAuthenticated(false);
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, fetchUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
}