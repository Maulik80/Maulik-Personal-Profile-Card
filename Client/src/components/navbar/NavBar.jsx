import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 z-50 w-full px-4 py-4 transition-all duration-300 sm:px-8">
      
      {/* Glassmorphism Container */}
      <nav className="flex items-center justify-between px-6 py-3 mx-auto border shadow-lg max-w-7xl rounded-2xl bg-white/10 dark:bg-black/20 backdrop-blur-md border-white/20">
        
        {/* LEFT: Brand Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <span className="text-2xl font-extrabold text-transparent transition-all duration-300 bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 drop-shadow-sm group-hover:from-blue-400 group-hover:to-pink-400">
            BioStack
          </span>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="w-px h-6 mx-1 bg-white/20"></div> {/* Vertical Divider */}
          <UserMenu />
        </div>

      </nav>
    </header>
  );
};

export default NavBar;