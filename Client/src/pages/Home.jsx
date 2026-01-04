import React from 'react'; 
import NavBar from '../components/navbar/NavBar'; 
// import Header from '../components/Header';
import ProfileManager from '../components/ProfileManager';
import '../styles/App.css'; 

const Home = () => {
  // ❌ REMOVED: const [theme, setTheme]...
  // ❌ REMOVED: useEffect for localStorage...
  // ❌ REMOVED: const toggleTheme...

  return (
    // Note: We removed the dynamic `${theme}-theme` class from here 
    // because ThemeToggle.jsx now applies it to the <body> tag.
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center">
      
      {/* NavBar handles the theme toggle internally now */}
      <NavBar />
      
      {/* <Header /> */}

      {/* ProfileManager handles its own logic */}
      <ProfileManager />

    </div>
  );
}

export default Home;