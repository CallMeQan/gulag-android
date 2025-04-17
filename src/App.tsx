import LoginPage from '@/pages/LoginPage';
import RunnerPage from '@/pages/RunnerPage';
import ThemeProvider from '@/components/theme-provider';
import { useAuth } from "@/components/AuthContext";
import './App.css';

function App() {
    const { user } = useAuth();

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            {user ? <RunnerPage /> : <LoginPage />}
        </ThemeProvider>
    );
}

export default App;
