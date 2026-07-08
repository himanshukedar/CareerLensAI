import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize Auth from Token
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data);
                } catch (err) {
                    const status = err.response?.status;
                    // Only clear token if server explicitly says unauthorized (401)
                    // Do NOT clear on network errors, rate limits (429), or server errors (500)
                    if (status === 401) {
                        console.warn('Token invalid — clearing session.');
                        localStorage.removeItem('token');
                    } else {
                        console.warn('Auth check failed temporarily (status:', status, ') — keeping session.');
                        // Still try to keep user logged in from cached token
                    }
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            toast.success(`Welcome back, ${res.data.user.name}!`);
            return true;
        } catch (err) {
            const msg = err.response?.data?.msg || 'Login failed';
            toast.error(msg);
            return false;
        }
    };

    const signup = async (name, email, password, role = 'student') => {
        try {
            const res = await api.post('/auth/signup', { name, email, password, role });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            toast.success('Account created! Welcome!');
            return true;
        } catch (err) {
            const msg = err.response?.data?.msg || 'Signup failed';
            toast.error(msg);
            return false;
        }
    };

    const logout = () => {
        localStorage.clear(); // Wipe everything for safety
        setUser(null);
        toast.success('Logged out successfully');
        window.location.href = '/login'; // Force redirect to avoid stale view state
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
