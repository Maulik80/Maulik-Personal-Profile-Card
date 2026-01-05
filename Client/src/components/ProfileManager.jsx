import React, { useState, useEffect, useMemo, useContext } from 'react'; 
import axios from 'axios'; 
import { toast } from 'react-toastify'; 
import { motion, AnimatePresence } from 'framer-motion'; // 1. Animation Library
import ProfileCard from './ProfileCard';
import ProfileForm from './ProfileForm';
import ProfileSkeleton from './ProfileSkeleton'; // 2. Loading State
import { AppContext } from '../context/AppContext';

const ProfileManager = ({ theme }) => {
  const { isAccountVerified, isLoggedin, backendUrl } = useContext(AppContext);

  const initialFormState = { 
    name: '', age: '', city: '', bio: '', skills: '', email: '', phone: '', photo: '' 
  };

  const [formData, setFormData] = useState(initialFormState); 
  const [profiles, setProfiles] = useState([]); 
  const [loading, setLoading] = useState(false); // Used for Form Actions
  const [fetching, setFetching] = useState(false); // Used for List Loading
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
      
      // Fetch with Page & Limit
      const { data } = await axios.get(`${backendUrl}/api/profiles/get-user-profiles?page=${currentPage}&limit=6`);
      
      if (data.success) {
        if (isRefresh) {
            setProfiles(data.profiles);
            setPage(1); // Reset to page 1
        } else {
            setProfiles(prev => [...prev, ...data.profiles]); // Append data
        }
        // Check if there are more pages
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

  // Initial Load & Load More
  useEffect(() => {
    if (isLoggedin) {
        // Only fetch if it's not a refresh (handled manually) or if page > 1
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
      setLoading(true); // Form loading
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('age', formData.age);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('skills', formData.skills);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      if (editingId) formDataToSend.append('id', editingId);
      if (formData.photo && typeof formData.photo !== 'string') {
          formDataToSend.append('photo', formData.photo);
      }

      let apiPath = editingId ? '/api/profiles/update' : '/api/profiles/add';
      const { data } = await axios.post(backendUrl + apiPath, formDataToSend);

      if (data.success) {
        toast.success(editingId ? "Updated!" : "Created!");
        setFormData(initialFormState);
        setEditingId(null);
        getAllProfiles(true); // Refresh list to see changes
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
    if (window.confirm("Delete permanently?")) {
      try {
        setLoading(true);
        const { data } = await axios.post(backendUrl + '/api/profiles/delete', { id });
        if (data.success) { 
            toast.success("Deleted"); 
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
    else if (window.confirm("Clear form?")) { setFormData(initialFormState); setErrors({}); }
  };

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
    <div className="w-full max-w-6xl mt-8">
       {/* Global Loading Overlay for Form Actions */}
       {loading && (
         <div className="loading-overlay">
           <div className="spinner"></div>
           <p>Processing...</p>
         </div>
       )}

       <div className="main-content">
        {/* Form Section */}
        <section className="form-section">
          <div className="progress-container">
            <span className="progress-label">Profile Completion: {completionPercentage}%</span>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${completionPercentage}%` }}></div>
            </div>
          </div>
          
          <ProfileForm 
            formData={formData} editingId={editingId} handleChange={handleChange} 
            handlePhotoChange={handlePhotoChange} handleSubmit={handleSubmit} 
            handleReset={handleReset} errors={errors} 
            charLimit={CHARACTER_LIMIT} bioLimit={BIO_LIMIT}
          />
        </section>

        <hr />

        {/* List Section */}
        <section className="list-section">
          <div className="search-container">
            <input 
                type="text" placeholder="🔍 Search profiles..." 
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                className="search-bar" 
            />
          </div>

          <div className="profiles-grid">
            {/* 3. Skeleton Loading State (Initial) */}
            {fetching && profiles.length === 0 ? (
                // Show 6 Skeletons
                [...Array(6)].map((_, i) => <ProfileSkeleton key={i} />)
            ) : (
                // 4. Animated List
                <AnimatePresence>
                    {filteredProfiles.map((profile, index) => (
                    <motion.div
                        key={profile._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
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

            {filteredProfiles.length === 0 && !fetching && (
                <p className="empty-msg">No profiles found.</p>
            )}
          </div>

          {/* 5. Load More Button */}
          {hasMore && !searchTerm && (
              <div className="flex justify-center mt-8">
                  <button 
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={fetching}
                    className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {fetching ? 'Loading...' : 'Load More Results'}
                  </button>
              </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfileManager;