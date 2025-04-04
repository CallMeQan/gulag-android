import { useState } from 'react'
import LoginPage from '@/pages/LoginPage'
import RunnerPage from '@/pages/RunnerPage'
import ThemeProvider from '@/components/theme-provider';
import './App.css'
function App() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            {isLogin ? <RunnerPage /> : <LoginPage setIsLogin={setIsLogin} />}
        </ThemeProvider>
    )
}

export default App
