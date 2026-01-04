import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const UserBadge = () => {
  const { isLoggedin, userData } = useContext(AppContext);
  const navigate = useNavigate();

  // 1. Guest View: If not logged in, show Login Button
  if (!isLoggedin) {
    return (
      <button 
        onClick={() => navigate('/login')}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-md"
      >
        Login
      </button>
    );
  }

  // 2. User View: If logged in, show Initials Avatar
  // Get the first letter of the name (e.g., "Maulik" -> "M")
  const userInitial = userData?.name ? userData.name[0].toUpperCase() : 'U';

  return (
    <div 
      className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md border-2 border-white cursor-pointer hover:scale-105 transition-transform"
      title={userData?.name || "User"}
    >
      {userInitial}
    </div>
  );
};

export default UserBadge;