import { getHostnameAndPort } from '@/lib/utils';
import { fetch } from '@tauri-apps/plugin-http';
import { createContext, useContext, useState, ReactNode } from 'react';

type AuthData = {
    user_id: string;
    hashed_timestamp: string;
};

type AuthContextType = {
    user: AuthData | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthData | null>(null);

    const login = async (email: string, password: string) => {
        const response = await login_logic(email, password);
        console.log(response);
        setUser({ user_id: response.user_id, hashed_timestamp: response.hashed_timestamp });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

const login_logic = async (email: string, password: string) => {
    const url = `http://${getHostnameAndPort()}/auth/mobile_check`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ email, password }).toString(),
        });

        if (response.status !== 200) {
            throw new Error('Login failed');
        }
        console.log("Server responded:", response);
        return response.json();
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};



const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export { AuthProvider, useAuth };
