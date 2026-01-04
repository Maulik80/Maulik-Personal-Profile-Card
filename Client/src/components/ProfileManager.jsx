import React, { useState, useEffect, useMemo, useContext } from 'react'; 
import axios from 'axios'; 
import { toast } from 'react-toastify'; 
import ProfileCard from './ProfileCard';
import ProfileForm from './ProfileForm';
import { AppContext } from '../context/AppContext';

// Move logic here
const ProfileManager = ({ theme }) => {
  const { isAccountVerified, isLoggedin, backendUrl } = useContext(AppContext);

  const initialFormState = { 
    name: '', age: '', city: '', bio: '', skills: '', email: '', phone: '', photo: '' 
  };

  const [formData, setFormData] = useState(initialFormState); 
  const [profiles, setProfiles] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const CHARACTER_LIMIT = 20;
  const BIO_LIMIT = 150;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_REGEX = /^[0-9]{10}$/;

  // --- API Functions (Moved from Home.jsx) ---
  const getAllProfiles = async () => {
    if (!isLoggedin) return; 
    try {
      setLoading(true);
      const { data } = await axios.get(backendUrl + '/api/profiles/get-user-profiles');
      if (data.success) setProfiles(data.profiles);
      else toast.error(data.message);
    } catch (error) {
      toast.error("Failed to fetch profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedin) getAllProfiles();
    else setProfiles([]); 
  }, [isLoggedin]);

  // --- Handlers ---
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) return toast.warning("Upload JPG/PNG.");
      if (file.size > 1024 * 1024) return toast.warning("File under 1MB required.");
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, photo: reader.result }));
      reader.readAsDataURL(file);
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
      let apiPath = editingId ? '/api/profiles/update' : '/api/profiles/add';
      if (editingId) formData.id = editingId;

      const { data } = await axios.post(backendUrl + apiPath, formData);
      if (data.success) {
        toast.success(editingId ? "Updated!" : "Created!");
        setFormData(initialFormState);
        setEditingId(null);
        getAllProfiles();
      } else toast.error(data.message);
    } catch (error) { toast.error(error.message); } finally { setLoading(false); }
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
        if (data.success) { toast.success("Deleted"); getAllProfiles(); }
        else toast.error(data.message);
      } catch (error) { toast.error(error.message); } finally { setLoading(false); }
    }
  };

  const handleReset = () => {
    if (editingId) { setEditingId(null); setFormData(initialFormState); }
    else if (window.confirm("Clear form?")) { setFormData(initialFormState); setErrors({}); }
  };

  const completionPercentage = useMemo(() => {
    const fields = Object.values(formData);
    const filled = fields.filter(f => f !== '' && f !== null).length;
    return Math.round((filled / fields.length) * 100);
  }, [formData]);

  const filteredProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mt-8">
       {/* Loading Spinner */}
       {loading && <div className="loading-overlay"><div className="spinner"></div>Loading...</div>}

       <div className="main-content">
        <section className="form-section">
          <div className="progress-container">
            <span className="progress-label">Completion: {completionPercentage}%</span>
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
        <section className="list-section">
          <div className="search-container">
            <input type="text" placeholder="🔍 Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-bar" />
          </div>
          <div className="profiles-grid">
            {filteredProfiles.map((profile) => (
              <ProfileCard key={profile._id} profileData={{...profile, id: profile._id}} theme={theme} onEdit={() => handleEdit(profile)} onDelete={() => handleDelete(profile._id)} />
            ))}
            {filteredProfiles.length === 0 && !loading && <p className="empty-msg">No profiles found.</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileManager;