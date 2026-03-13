import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('skillspotter_user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('skillspotter_token'));
    const [loading] = useState(false);

    const loginContext = (userData, authToken) => {
        localStorage.setItem('skillspotter_token', authToken);
        localStorage.setItem('skillspotter_user', JSON.stringify(userData));
        setUser(userData);
        setToken(authToken);
    };

    const logoutContext = () => {
        localStorage.removeItem('skillspotter_token');
        localStorage.removeItem('skillspotter_user');
        setUser(null);
        setToken(null);
    };

    const updateContextUser = (userData) => {
        localStorage.setItem('skillspotter_user', JSON.stringify(userData));
        setUser(userData);
    }

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!token,
            loginContext,
            logoutContext,
            updateContextUser,
            loading
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
