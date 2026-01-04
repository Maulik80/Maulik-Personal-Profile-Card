import React, { useState, useRef, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import UserBadge from './UserBadge';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const { isLoggedin, isAccountVerified, userData, logout } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null); // Ref to focus back on trigger after closing
  const navigate = useNavigate();

  const toggleMenu = () => {
    if (isLoggedin) setIsOpen(!isOpen);
  };

  // --- A11y: Handle Escape Key ---
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isOpen && event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus(); // Return focus to avatar
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // --- A11y: Handle Click Outside ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  // --- A11y: Keyboard Support for Trigger ---
  const handleTriggerKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Step 2 & 3: Keyboard Nav & Focus
         - tabIndex="0": Makes div focusable
         - role="button": Tells screen readers this acts like a button
         - aria-expanded: Tells screen readers menu state
      */}
      <div 
        ref={triggerRef}
        onClick={toggleMenu}
        onKeyDown={handleTriggerKeyDown}
        tabIndex={isLoggedin ? "0" : "-1"}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      >
        <UserBadge />
      </div>

      {isLoggedin && isOpen && (
        // Step 1: Mobile Responsive Width (w-72 max-w-[90vw])
        <div 
            className="absolute right-0 mt-3 w-72 max-w-[92vw] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all duration-200 origin-top-right z-50 animate-fade-in-down"
            role="menu"
            aria-orientation="vertical"
        >
          
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{userData?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userData?.email}</p>
          </div>

          {/* Verification Status */}
          <div className="px-5 py-3">
             <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Account Status</p>
             {isAccountVerified ? (
                 <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg border border-green-100 dark:border-green-800">
                    <span aria-hidden="true">✅</span> <span className="text-sm font-medium">Verified</span>
                 </div>
             ) : (
                 <button 
                    onClick={() => navigate('/email-verify')}
                    className="w-full flex items-center gap-2 text-orange-600 bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg border border-orange-100 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/40 text-left transition-colors"
                 >
                    <span aria-hidden="true">⚠️</span> 
                    <div>
                        <span className="text-sm font-medium block">Not Verified</span>
                        <span className="text-[10px] underline">Click to verify</span>
                    </div>
                 </button>
             )}
          </div>

          {/* Actions */}
          <div className="p-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                role="menuitem"
            >
                <span aria-hidden="true">🚪</span> Logout
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default UserMenu;