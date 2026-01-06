import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProfileCard from '../components/ProfileCard';
import { Loader2, ArrowLeft } from 'lucide-react';

const PublicProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/profiles/public/${id}`);
        if (data.success) {
          setProfile(data.profile);
        } else {
          setError("Profile not found");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchPublicProfile();
  }, [id, backendUrl]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-slate-900">
        <Loader2 className="w-10 h-10 mb-4 text-blue-500 animate-spin" />
        <p className="animate-pulse">Loading Digital Card...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-slate-900">
        <h1 className="mb-2 text-4xl">😕</h1>
        <p className="text-xl font-bold text-red-400">{error}</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-950 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black">
      {profile && (
        <div className="w-full max-w-md animate-fade-in-up">
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Digital Profile
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
                👀 Viewed {profile.views} times
            </p>
          </div>
          
          {/* Read-Only Card */}
          <div className="pointer-events-auto"> 
             <ProfileCard 
                profileData={profile} 
                theme="dark" // Force dark theme for public view
                onEdit={() => {}} // Disable actions
                onDelete={() => {}} 
             />
          </div>

          <div className="mt-10 text-center">
            <button 
                onClick={() => window.open(window.location.origin, '_self')}
                className="flex items-center gap-2 px-6 py-3 mx-auto text-sm font-bold text-white transition-all border rounded-full shadow-lg bg-white/10 hover:bg-white/20 backdrop-blur-md border-white/10 hover:scale-105"
            >
                <ArrowLeft size={16} /> Create Your Own Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicProfile;