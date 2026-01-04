import React from 'react';
import { useNavigate } from 'react-router-dom';

// Import the sub-components (currently placeholders)
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import UserBadge from './UserBadge'; // We might need this inside UserMenu later, but let's stick to the plan

const NavBar = () => {
  const navigate = useNavigate();

  return (
    // <header>: The semantic wrapper for introduction content
    <header className="w-full absolute top-0 z-50 px-4 sm:px-10 py-5">
      
      {/* <nav>: Semantic tag for navigation links */}
     <nav className="flex justify-between items-center max-w-7xl mx-auto px-2 sm:px-0">
        
        {/* LEFT SIDE: Brand Identity */}
        <div 
          className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
          onClick={() => navigate('/')}
        >
          {/* Simple Text Logo with Gradient */}
          <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            BioStack
          </span>
        </div>

        {/* RIGHT SIDE: Action Container */}
        <div className="flex items-center gap-3 sm:gap-4 bg-white/10 backdrop-blur-sm p-1 rounded-full border border-gray-200/20 shadow-sm">
          
          {/* Slot 1: Theme Toggle */}
          <ThemeToggle />

          {/* Slot 2: User Menu (Dropdown) */}
          <UserMenu />
          
        </div>

      </nav>
    </header>
  );
};

export default NavBar;