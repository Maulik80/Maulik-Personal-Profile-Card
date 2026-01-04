/* client/src/pages/Home.jsx */
import React, { useState, useEffect, useMemo, useContext } from 'react'; 
import axios from 'axios'; // Phase 9: Import Axios for API calls
import ProfileCard from '../components/ProfileCard';
import ProfileForm from '../components/ProfileForm';
import { AppContext } from '../context/AppContext';
import '../styles/App.css'; 

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{10}$/;

function Home() {
  // Phase 9: Get backendUrl from Context to make API calls
  const { isAccountVerified, isLoggedin, backendUrl } = useContext(AppContext);

  const initialFormState = { 
    name: '', age: '', city: '', bio: '', skills: '', email: '', phone: '', photo: '' 
  };

  const [formData, setFormData] = useState(initialFormState); 
  
  // Phase 9: Initialize as empty array (No more localStorage)
  const [profiles, setProfiles] = useState([]); 
  const [loading, setLoading] = useState(false); // Phase 9: Loading state

  const [theme, setTheme] = useState(() => localStorage.getItem('profile-card-theme') || 'light');
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const CHARACTER_LIMIT = 20;
  const BIO_LIMIT = 150;

  // --- Phase 9: Fetch Data from MongoDB ---
  const getAllProfiles = async () => {
    if (!isLoggedin) return; 
    
    try {
      setLoading(true);
      const { data } = await axios.get(backendUrl + '/api/profiles/get-user-profiles');
      if (data.success) {
        setProfiles(data.profiles);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Fetch Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Phase 9: Fetch on Login / Clear on Logout
  useEffect(() => {
    if (isLoggedin) {
      getAllProfiles();
    } else {
      setProfiles([]); 
    }
  }, [isLoggedin]);

  // Keep Theme Persistence
  useEffect(() => {
    localStorage.setItem('profile-card-theme', theme);
  }, [theme]);

  // --- Form Handlers ---
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) return alert("Upload JPG/PNG.");
      if (file.size > 1024 * 1024) return alert("File under 1MB required.");
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

  // --- Phase 9: Save to Database (Create / Update) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Security Checks
    if (!isLoggedin) return alert("Authentication Required: Please login to save profiles.");
    if (!isAccountVerified) return alert("Access Denied: Please verify your email.");
    if (Object.values(errors).some(err => err) || !formData.name) return alert("Fix errors first.");

    try {
      setLoading(true);
      let apiPath = '/api/profiles/add'; // Default: Create
      
      // If Editing, use Update API
      if (editingId) {
        apiPath = '/api/profiles/update';
        formData.id = editingId; // Ensure ID is sent
      }

      const { data } = await axios.post(backendUrl + apiPath, formData);

      if (data.success) {
        setShowSuccess(true);
        setFormData(initialFormState);
        setEditingId(null);
        getAllProfiles(); // Phase 9: Refresh List from DB
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (profile) => {
    setFormData({
      ...profile,
      id: profile._id // Map MongoDB _id to form id
    });
    setEditingId(profile._id); // Use MongoDB _id for tracking
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Phase 9: Delete from Database ---
  const handleDelete = async (id) => {
    if (window.confirm("Delete this profile permanently?")) {
      try {
        setLoading(true);
        const { data } = await axios.post(backendUrl + '/api/profiles/delete', { id });
        
        if (data.success) {
          getAllProfiles(); // Refresh List
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    if (editingId) { setEditingId(null); setFormData(initialFormState); }
    else if (window.confirm("Clear form inputs?")) {
      setFormData(initialFormState); setErrors({});
    }
  };

  // Logic Helpers
  const completionPercentage = useMemo(() => {
    const fields = Object.values(formData);
    const filledFields = fields.filter(field => field !== '' && field !== null).length;
    return Math.round((filledFields / fields.length) * 100);
  }, [formData]);

  const filteredProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`app-container ${theme}-theme`}> 
      <header className="app-header">
        <h1>👤 Profile Manager Pro</h1>
        <button 
          aria-label="Toggle Dark Mode"
          onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} 
          className="theme-toggle-button"
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </header>

      {/* Phase 9: Loading Spinner Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div> Loading...
        </div>
      )}

      {/* Verification Banner */}
      {isLoggedin && !isAccountVerified && (
        <div className="verification-banner" style={{
          backgroundColor: '#ff9800', color: 'white', padding: '10px', 
          borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold'
        }}>
          ⚠️ Your account is not verified. Check your email to enable saving.
        </div>
      )}

      {showSuccess && <div className="success-banner">✅ Operation Successful!</div>}

      <div className="main-content">
        <section className="form-section">
          {/* Progress Bar */}
          <div className="progress-container">
            <span className="progress-label">Profile Completion: {completionPercentage}%</span>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${completionPercentage}%` }}></div>
            </div>
          </div>

          <ProfileForm 
            formData={formData} 
            editingId={editingId}
            handleChange={handleChange} 
            handlePhotoChange={handlePhotoChange}
            handleSubmit={handleSubmit}
            handleReset={handleReset} 
            errors={errors} 
            charLimit={CHARACTER_LIMIT}
            bioLimit={BIO_LIMIT}
          />
        </section>

        <hr />

        <section className="list-section">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="🔍 Search by name or city..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />
          </div>

          <div className="profiles-grid">
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map((profile) => (
                <ProfileCard 
                  key={profile._id} // Use MongoDB _id as Key
                  profileData={{...profile, id: profile._id}} // Pass ID for actions
                  theme={theme} 
                  onEdit={() => handleEdit(profile)} // Pass profile object
                  onDelete={() => handleDelete(profile._id)} // Pass ID
                />
              ))
            ) : (
              !loading && <p className="empty-msg">No profiles found.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;