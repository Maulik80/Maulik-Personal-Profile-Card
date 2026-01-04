/* src/components/ProfileForm.jsx */
import React from 'react';

function ProfileForm({ formData, editingId, handleChange, handlePhotoChange, handleSubmit, handleReset, errors, charLimit, bioLimit }) {
  return (
    <div className={`input-form horizontal-form ${editingId ? 'editing-highlight' : ''}`}>
      <h2>{editingId ? "📝 Edit Profile" : "👤 Professional Details"}</h2>
      
      <form onSubmit={handleSubmit} className="form-grid-container">
        
        {/* Top Section: Photo & Identity */}
        <div className="form-section-header">
          <div className="input-group photo-upload-horizontal">
            <label>Profile Photo:</label>
            <div className="photo-input-container">
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="file-input" />
              {formData.photo && (
                <div className="form-photo-preview">
                  <img src={formData.photo} alt="Preview" />
                  <button type="button" onClick={() => handleChange({target: {name: 'photo', value: ''}})}>Remove</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Horizontal Grid for Main Inputs */}
        <div className="main-form-grid">
          <div className="input-group">
            <label>Full Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className={errors.name ? 'error-border' : ''} />
            <div className="input-helper"><span className="error-text">{errors.name}</span><span className="char-counter">{formData.name.length}/{charLimit}</span></div>
          </div>

          <div className="input-group">
            <label>Age:</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} className={errors.age ? 'error-border' : ''} />
            <div className="input-helper"><span className="error-text">{errors.age}</span></div>
          </div>

          <div className="input-group">
            <label>City:</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} className={errors.city ? 'error-border' : ''} />
            <div className="input-helper"><span className="error-text">{errors.city}</span><span className="char-counter">{formData.city.length}/{charLimit}</span></div>
          </div>

          <div className="input-group">
            <label>Email Address:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? 'error-border' : ''} />
            <div className="input-helper"><span className="error-text">{errors.email}</span></div>
          </div>

          <div className="input-group">
            <label>Phone Number:</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={errors.phone ? 'error-border' : ''} />
            <div className="input-helper"><span className="error-text">{errors.phone}</span></div>
          </div>

          <div className="input-group">
            <label>Key Skills:</label>
            <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node, CSS..." />
            <div className="input-helper"><span className="char-counter">Comma separated</span></div>
          </div>
        </div>

        {/* Full-Width Bio Section */}
        <div className="input-group full-width">
          <label>Bio / About Me:</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Briefly describe yourself..." />
          <div className="input-helper"><span className="char-counter">{formData.bio.length}/{bioLimit}</span></div>
        </div>

        {/* Explicit Save Actions */}
        <div className="button-group horizontal-buttons">
          <button type="submit" className="save-btn">
            {editingId ? "Update Profile" : "Save Profile"}
          </button>
          <button type="button" className="reset-btn" onClick={handleReset}>
            {editingId ? "Cancel Edit" : "Reset All"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileForm;