import { useState, useEffect } from 'react';

/**
 * Dark Mode Toggle Component - Elsa Coiffure Style
 * Toggles between light and dark themes
 */
const DarkModeToggle = ({ className = '' }) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check if user has a theme preference in localStorage
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
        setIsDark(shouldBeDark);

        if (shouldBeDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);

        if (newIsDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <button
            onClick={toggleDarkMode}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isDark
                    ? 'bg-maroon-dark'
                    : 'bg-primary/20'
                } ${className}`}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <div
                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center ${isDark
                        ? 'translate-x-7 bg-primary'
                        : 'translate-x-0 bg-white'
                    }`}
            >
                <span className={`material-symbols-outlined text-sm ${isDark ? 'text-white' : 'text-primary'}`}>
                    {isDark ? 'dark_mode' : 'light_mode'}
                </span>
            </div>
        </button>
    );
};

export default DarkModeToggle;
