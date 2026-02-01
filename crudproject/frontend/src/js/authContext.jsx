import { createContext, useContext, useState, useEffect, useLayoutEffect } from 'react';
import api from './api.js'

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useLayoutEffect(() => {
        const fetchMe = async () => {
            try {
                const response = await api.refresh()
                setAccessToken(response.accessToken)
                
                setUser(response.user.username)
            } catch {
                setAccessToken(null)
            } finally {
                setLoading(false);
            }
        }
        fetchMe();
    }, [])

    useEffect(() => {
        if (accessToken) {
            console.log("Token successfully set:", accessToken);
        }
    }, [accessToken]);

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, setUser, user, loading }}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};