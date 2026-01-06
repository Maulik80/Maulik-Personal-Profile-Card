import React, { useState, useEffect, useMemo, useContext } from 'react'; 
import axios from 'axios'; 
import { toast } from 'react-toastify'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { RefreshCw, Search, Sparkles } from 'lucide-react'; // ✅ Modern Icons
import ProfileCard from './ProfileCard';
import ProfileForm from './ProfileForm';
import ProfileSkeleton from './ProfileSkeleton'; 
import { AppContext } from '../context/AppContext';

const ProfileManager = ({ theme }) => {
  const { isAccountVerified, isLoggedin, backendUrl } = useContext(AppContext);

  const initialFormState = { 
    name: '', age: '', city: '', bio: '', skills: '', email: '', phone: '', photo: '' 
  };

  const [formData, setFormData] = useState(initialFormState); 
  const [profiles, setProfiles] = useState([]); 
  const [loading, setLoading] = useState(false); // Form Action Loading
  const [fetching, setFetching] = useState(false); // List Fetch Loading
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- Pagination State ---
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const CHARACTER_LIMIT = 20;
  const BIO_LIMIT = 150;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_REGEX = /^[0-9]{10}$/;

  // --- 1. Fetch Profiles (Paginated) ---
  const getAllProfiles = async (isRefresh = false) => {
    if (!isLoggedin) return; 
    
    try {
      setFetching(true);
      const currentPage = isRefresh ? 1 : page;
      
      const { data } = await axios.get(`${backendUrl}/api/profiles/get-user-profiles?page=${currentPage}&limit=6`);
      
      if (data.success) {
        if (isRefresh) {
            setProfiles(data.profiles);
            setPage(1); 
        } else {
            setProfiles(prev => [...prev, ...data.profiles]); 
        }
        setHasMore(data.currentPage < data.totalPages);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch profiles");
    } finally {
      setFetching(false);
    }
  };

  // Initial Load & Pagination Trigger
  useEffect(() => {
    if (isLoggedin) {
        if(page > 1) getAllProfiles(false);
        else getAllProfiles(true);
    } else {
        setProfiles([]); 
    }
  }, [isLoggedin, page]);

  // --- 2. Handlers ---
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) return toast.warning("Upload JPG/PNG.");
      if (file.size > 2 * 1024 * 1024) return toast.warning("File size must be under 2MB.");
      setFormData(prev => ({ ...prev, photo: file }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target; 
    if (name === 'bio' && value.length > BIO_LIMIT) return;
    if ((name === 'name' || name === 'city') && value.length > CHARACTER_LIMIT) return;
    setFormData(prev => ({ ...prev, [name]: value }));

    let errorMsg = '';
    if (name === 'name' && value.length > 0 && value.length < 3) errorMsg = 'Min 3 chars.';
    else if (name === 'age' && value !== '' && (value < 1 || value > 100)) errorMsg = 'Age 1-100.';
    else if (name === 'email' && value !== '' && !EMAIL_REGEX.test(value)) errorMsg = 'Invalid Email.';
    else if (name === 'phone' && value !== '' && !PHONE_REGEX.test(value)) errorMsg = '10 digits required.';
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedin) return toast.error("Login required.");
    if (!isAccountVerified) return toast.error("Verify email first.");
    if (Object.values(errors).some(err => err) || !formData.name) return toast.warning("Fix errors.");

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
          if(key === 'photo' && typeof formData[key] === 'string') return; // Skip URL string photo
          formDataToSend.append(key, formData[key]);
      });
      if (editingId) formDataToSend.append('id', editingId);

      let apiPath = editingId ? '/api/profiles/update' : '/api/profiles/add';
      const { data } = await axios.post(backendUrl + apiPath, formDataToSend);

      if (data.success) {
        toast.success(editingId ? "Profile Updated! 🚀" : "Profile Created! ✨");
        setFormData(initialFormState);
        setEditingId(null);
        getAllProfiles(true); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (profile) => {
    setFormData({ ...profile, id: profile._id });
    setEditingId(profile._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      try {
        setLoading(true);
        const { data } = await axios.post(backendUrl + '/api/profiles/delete', { id });
        if (data.success) { 
            toast.success("Profile Deleted"); 
            getAllProfiles(true); 
        } else {
            toast.error(data.message);
        }
      } catch (error) { 
        toast.error(error.message); 
      } finally { 
        setLoading(false); 
      }
    }
  };

  const handleReset = () => {
    if (editingId) { setEditingId(null); setFormData(initialFormState); }
    else if (window.confirm("Clear all form data?")) { setFormData(initialFormState); setErrors({}); }
  };

  // --- 3. Computed Values ---
  const completionPercentage = useMemo(() => {
    const fields = ['name', 'age', 'city', 'bio', 'skills', 'email', 'phone', 'photo'];
    const filled = fields.filter(field => formData[field] && formData[field] !== '').length;
    return Math.round((filled / fields.length) * 100);
  }, [formData]);

  const filteredProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen pt-24 pb-12">
       
       {/* 🌀 Global Loading Overlay */}
       {loading && (
         <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
           <RefreshCw className="mb-4 text-blue-400 animate-spin w-14 h-14" />
           <p className="text-lg font-bold text-white animate-pulse">Processing...</p>
         </div>
       )}

       <div className="container max-w-6xl px-4 mx-auto">
        
        {/* 📝 Form Section */}
        <section className="mb-16 animate-fade-in">
          
          {/* Progress Bar */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="flex justify-between mb-2 text-sm font-semibold text-gray-400">
               <span className="flex items-center gap-2"><Sparkles size={14} className="text-yellow-400"/> Profile Strength</span>
               <span className="text-white">{completionPercentage}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
               <div 
                 className="h-full transition-all duration-700 shadow-[0_0_10px_rgba(59,130,246,0.5)] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" 
                 style={{ width: `${completionPercentage}%` }}
               />
            </div>
          </div>
          
          <ProfileForm 
            formData={formData} editingId={editingId} handleChange={handleChange} 
            handlePhotoChange={handlePhotoChange} handleSubmit={handleSubmit} 
            handleReset={handleReset} errors={errors} 
            charLimit={CHARACTER_LIMIT} bioLimit={BIO_LIMIT}
          />
        </section>

        {/* 🗂️ Collection Section */}
        <section>
          {/* Header & Search */}
          <div className="flex flex-col items-center justify-between gap-6 mb-10 md:flex-row">
             <h2 className="text-3xl font-bold text-white drop-shadow-md">
               My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Collection</span>
             </h2>
             
             <div className="relative w-full md:w-72 group">
                <Search className="absolute text-gray-400 transition-colors transform -translate-y-1/2 left-4 top-1/2 group-focus-within:text-blue-400" size={18} />
                <input 
                    type="text" placeholder="Search profiles..." 
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                    className="w-full py-3 pl-12 pr-4 text-white transition-all border outline-none bg-white/5 border-white/10 rounded-2xl focus:bg-white/10 focus:border-blue-500/50 focus:shadow-lg backdrop-blur-sm" 
                />
             </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Loading Skeletons */}
            {fetching && profiles.length === 0 ? (
                [...Array(6)].map((_, i) => <ProfileSkeleton key={i} />)
            ) : (
                <AnimatePresence mode="popLayout">
                    {filteredProfiles.map((profile, index) => (
                    <motion.div
                        key={profile._id || profile.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                        <ProfileCard 
                            profileData={{...profile, id: profile._id}} 
                            theme={theme} 
                            onEdit={() => handleEdit(profile)} 
                            onDelete={() => handleDelete(profile._id)} 
                        />
                    </motion.div>
                    ))}
                </AnimatePresence>
            )}

            {/* Empty State */}
            {filteredProfiles.length === 0 && !fetching && (
                <div className="py-20 text-center col-span-full opacity-60">
                   <p className="text-xl text-gray-300">No profiles found matching your search. 🔍</p>
                </div>
            )}
          </div>

          {/* Load More Button */}
          {hasMore && !searchTerm && profiles.length > 0 && (
              <div className="flex justify-center mt-12 mb-8">
                  <button 
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={fetching}
                    className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-white transition-all border rounded-full shadow-lg bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md border-white/10"
                  >
                    {fetching ? <RefreshCw className="animate-spin" size={18} /> : null}
                    {fetching ? 'Loading...' : 'Load More Profiles'}
                  </button>
              </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfileManager;