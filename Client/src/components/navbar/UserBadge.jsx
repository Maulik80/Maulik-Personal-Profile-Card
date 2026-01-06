import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const UserBadge = () => {
  const { isLoggedin, userData } = useContext(AppContext);
  const navigate = useNavigate();

  if (!isLoggedin) {
    return (
      <button 
        onClick={() => navigate('/login')}
        className="px-5 py-2 text-sm font-bold text-white transition-all duration-300 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:-translate-y-0.5"
      >
        Login
      </button>
    );
  }

  const userInitial = userData?.name ? userData.name[0].toUpperCase() : 'U';

  return (
    <div className="relative cursor-pointer group">
      {/* Glowing Ring Effect */}
      <div className="absolute transition-opacity duration-300 rounded-full -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-70 blur-sm group-hover:opacity-100 animate-pulse"></div>
      
      {/* Badge Content */}
      <div 
        className="relative flex items-center justify-center w-10 h-10 text-lg font-bold text-white border-2 rounded-full bg-slate-900 border-white/20"
        title={userData?.name}
      >
        {userInitial}
      </div>
    </div>
  );
};

export default UserBadge;