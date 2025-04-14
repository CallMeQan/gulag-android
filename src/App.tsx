import LoginPage from '@/pages/LoginPage'
import RunnerPage from '@/pages/RunnerPage'
import ThemeProvider from '@/components/theme-provider';
import { AuthProvider, useAuth } from "@/components/AuthContext";
import './App.css'

function AppWrapper() {
    return (
        <AuthProvider>
            <App />
        </AuthProvider>
    );
}

function App() {
    const { user } = useAuth(); // use context instead of isLogin

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            {user ? <RunnerPage /> : <LoginPage />}
        </ThemeProvider>
    );
}

export default AppWrapper
