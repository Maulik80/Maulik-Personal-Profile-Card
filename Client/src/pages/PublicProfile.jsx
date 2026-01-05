import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProfileCard from '../components/ProfileCard'; // Reuse your card!

const PublicProfile = () => {
  const { id } = useParams(); // Get ID from URL
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the backend URL from environment
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Loading Profile...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      {profile && (
        <>
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">My Digital Card</h1>
            <p className="text-gray-500">👀 Viewed {profile.views} times</p>
          </div>
          
          {/* Reuse the Card Component in "Read Only" mode */}
          <div className="pointer-events-none"> 
             {/* Note: We disable interactions since it's just for viewing */}
             <ProfileCard profileData={profile} theme="light" />
          </div>

          <button 
            onClick={() => window.open('https://your-website.com', '_blank')}
            className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition"
          >
            Create Your Own Card 🚀
          </button>
        </>
      )}
    </div>
  );
};

export default PublicProfile;