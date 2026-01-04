import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  // 1. Initialize State from LocalStorage
  const [theme, setTheme] = useState(() => 
    localStorage.getItem('profile-card-theme') || 'light'
  );

  // 2. Effect: Apply theme to Body & Save to LocalStorage
  useEffect(() => {
    // Apply class to the <body> tag so it affects the whole app globally
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    localStorage.setItem('profile-card-theme', theme);
  }, [theme]);

  // 3. Toggle Function
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode" // Accessibility requirement
      className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      {theme === 'light' ? (
        // Moon Icon (for Light Mode)
        <span className="text-xl">🌙</span>
      ) : (
        // Sun Icon (for Dark Mode)
        <span className="text-xl">☀️</span>
      )}
    </button>
  );
};

export default ThemeToggle;