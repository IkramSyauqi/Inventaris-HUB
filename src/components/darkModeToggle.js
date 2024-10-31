import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const DarkModeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if (localStorage.theme === 'dark' ||
            (!('theme' in localStorage) &&
                window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            setIsDarkMode(true);
        } else {
            document.documentElement.classList.remove('dark');
            setIsDarkMode(false);
        }
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        }
    };

    return (
        <button
            onClick={toggleDarkMode}
            className="relative inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-500 ease-in-out"
            aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            <div className="relative w-12 h-6 transition-colors duration-500 ease-in-out bg-gray-300 dark:bg-gray-600 rounded-full">
                <div
                    className={`absolute top-1 left-1 w-4 h-4 transition-transform duration-500 ease-in-out bg-white rounded-full shadow-lg
                    ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}
                />
            </div>

            <span className="sr-only">{isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>

            {isDarkMode ? (
                <Moon className="w-5 h-5 text-gray-800 dark:text-gray-200 transform transition-transform duration-500 ease-in-out rotate-0" />
            ) : (
                <Sun className="w-5 h-5 text-gray-800 dark:text-gray-200 transform transition-transform duration-500 ease-in-out rotate-0" />
            )}
        </button>
    );
};

export default DarkModeToggle;
