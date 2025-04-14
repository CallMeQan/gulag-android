import { createContext, useContext, useState, ReactNode } from 'react';

type AuthData = {
    email: string;
    hashed_token: string;
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
        const response = await fakeServerLogin(email, password);
        setUser({ email, hashed_token: response.hashed_token });
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

const fakeServerLogin = async (email: string, password: string) => {
    return new Promise<{ hashed_token: string }>((resolve, reject) => {
        setTimeout(() => {
            if (email === "admin@example.com" && password === "password123") {
                resolve({ hashed_token: btoa(email + ':' + password) });
            } else {
                reject(new Error("Invalid email or password"));
            }
        }, 1000);
    });
};


const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export { AuthProvider, useAuth };
