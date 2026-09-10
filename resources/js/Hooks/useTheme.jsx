import { createContext, useContext, useEffect, useState } from 'react';
import { applyTheme, getTheme, setTheme, toggleTheme as toggleStoredTheme } from '@/utils/theme';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(() => getTheme());

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const value = {
        theme,
        isDark: theme === 'dark',
        setTheme: (next) => {
            setTheme(next);
            setThemeState(next);
        },
        toggleTheme: () => {
            const next = toggleStoredTheme();
            setThemeState(next);

            return next;
        },
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }

    return context;
}
