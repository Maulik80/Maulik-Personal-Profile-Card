import React, { useState, useRef, useEffect, useContext } from 'react';
import { LogOut, CheckCircle, AlertTriangle } from 'lucide-react'; // ✅ Import Icons
import { AppContext } from '../../context/AppContext';
import UserBadge from './UserBadge';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const { isLoggedin, isAccountVerified, userData, logout } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    if (isLoggedin) setIsOpen(!isOpen);
  };

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

  return (
    <div className="relative" ref={menuRef}>
      <div 
        ref={triggerRef}
        onClick={toggleMenu}
        role="button"
        className="rounded-full focus:outline-none"
      >
        <UserBadge />
      </div>

      {isLoggedin && isOpen && (
        <div 
            className="absolute right-0 z-50 mt-4 overflow-hidden origin-top-right border shadow-2xl w-72 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 animate-fade-in-down"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <p className="text-sm font-bold text-gray-900 truncate dark:text-white">{userData?.name}</p>
            <p className="text-xs text-gray-500 truncate dark:text-gray-400">{userData?.email}</p>
          </div>

          {/* Verification Status */}
          <div className="px-5 py-3">
             {isAccountVerified ? (
                 <div className="flex items-center gap-2 p-2 text-green-600 border rounded-lg bg-green-500/10 border-green-500/20">
                    <CheckCircle size={16} /> <span className="text-sm font-medium">Verified Account</span>
                 </div>
             ) : (
                 <button 
                    onClick={() => navigate('/email-verify')}
                    className="flex items-center w-full gap-2 p-2 text-orange-600 transition-colors border rounded-lg bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20"
                 >
                    <AlertTriangle size={16} /> 
                    <span className="text-sm font-medium">Verify Now</span>
                 </button>
             )}
          </div>

          {/* Logout Button */}
          <div className="p-2 border-t border-gray-200/50 dark:border-gray-700/50">
            <button 
                onClick={handleLogout}
                className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white transition-all shadow-md bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 rounded-xl hover:shadow-lg"
            >
                <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;