import { createContext, useContext, useState, useEffect, useLayoutEffect } from 'react';
import api from './api.js'

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);

    console.log("Token successfully set : ", accessToken);  

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const response = await api.refresh()
                setAccessToken(response.data.accessToken)
                setUser(response.data.user)
            } catch {
                setAccessToken(null)
            }
        }

        fetchMe();
    }, [])

    useLayoutEffect(() => {

    })

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken }}>
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