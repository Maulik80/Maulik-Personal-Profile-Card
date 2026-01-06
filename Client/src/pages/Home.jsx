import React from 'react'; 
import NavBar from '../components/navbar/NavBar'; 
import ProfileManager from '../components/ProfileManager';

const Home = () => {
  return (
    // ✅ FIX: 
    // 1. Default (Light): bg-gray-50 
    // 2. Dark Mode (dark:): bg-slate-950 + Gradient
    <div className="flex flex-col min-h-screen transition-colors duration-500 bg-gray-50 dark:bg-slate-950 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-slate-900 dark:via-[#0f172a] dark:to-black text-slate-900 dark:text-white">
      
      {/* NavBar */}
      <NavBar />
      
      {/* Main Content */}
      <main className="flex-grow w-full px-4 pt-20">
         <ProfileManager />
      </main>

    </div>
  );
}

export default Home;