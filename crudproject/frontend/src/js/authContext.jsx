import { createContext, useContext, useState, useEffect, useLayoutEffect } from 'react';
import api from './api.js'

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const response = await api.refresh()

                console.log(response)
                const token = response.accessToken

                api.setToken(token)

                setAccessToken(token)
                setUser(response.user.username)
                console.log("Token successfully set:", accessToken);
            } catch {
                setAccessToken(null)
            } finally {
                setLoading(false);
            }
        }

        api.onTokenRefresh = (newToken, newUser) => {
            setAccessToken(newToken)
            if (newUser) setUser(newUser.username)
        }

        fetchMe();

        return () => { api.onTokenRefresh = null }
    }, [])
    
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