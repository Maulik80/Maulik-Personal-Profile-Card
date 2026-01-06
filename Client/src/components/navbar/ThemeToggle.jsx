import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => 
    localStorage.getItem('profile-card-theme') || 'light'
  );

  useEffect(() => {
    // inside useEffect
const root = window.document.documentElement; // Select <html>
if (theme === 'dark') {
  root.classList.add('dark');
} else {
  root.classList.remove('dark');
}
    
    localStorage.setItem('profile-card-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
      className="relative p-2 transition-all duration-300 border border-transparent rounded-full bg-white/5 hover:bg-white/20 hover:border-white/10 group"
    >
      <div className="transition-transform duration-500 transform group-hover:rotate-180">
        {theme === 'light' ? (
          <Moon size={20} className="text-slate-700 dark:text-slate-200" /> 
        ) : (
          <Sun size={20} className="text-yellow-400" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;