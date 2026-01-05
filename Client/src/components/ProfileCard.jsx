import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import QRCode from "react-qr-code";
import { toast } from 'react-toastify';
import './ProfileCard.css';

function ProfileCard({ profileData, theme, onEdit, onDelete }) {
  // Destructure with fallbacks. '_id' is for MongoDB, 'id' is legacy.
  const { _id, id, name, age, city, bio, skills, email, phone, photo, views } = profileData;
  const profileId = _id || id;
  
  const [showQR, setShowQR] = useState(false);

  // Generate the public link dynamically
  const shareUrl = `${window.location.origin}/share/${profileId}`;

  // Process skills list
  const skillList = skills ? skills.split(',').map(s => s.trim()).filter(s => s !== "") : [];
  
  // Use Cloudinary URL if available, otherwise Generate Avatar
  const avatarUrl = photo || `https://api.dicebear.com/9.x/initials/svg?seed=${name || 'User'}`;

  // --- 1. Export JSON ---
  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profileData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${name}_profile.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // --- 2. Export PDF ---
  const downloadPDF = () => {
    const element = document.getElementById(`profile-card-${profileId}`);
    
    // Configure PDF options for high quality
    const opt = {
      margin: 0.2,
      filename: `${name}_profile.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Add class to hide buttons during export
    element.classList.add('pdf-export-mode');
    
    html2pdf().set(opt).from(element).save().then(() => {
      element.classList.remove('pdf-export-mode');
    });
  };

  // --- 3. Copy Link ---
  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Public Link Copied!");
  };

  return (
    <div className={`profile-card ${theme}-card relative`} id={`profile-card-${profileId}`}>
      
      {/* 👁️ Views Counter Badge */}
      <div className="absolute top-3 right-3 bg-gray-900/10 dark:bg-white/20 px-2 py-1 rounded text-xs font-bold backdrop-blur-sm shadow-sm">
         👀 {views || 0}
      </div>

      <div className="avatar-container">
        <img src={avatarUrl} alt={`${name}'s avatar`} className="profile-avatar object-cover" />
      </div>

      <div className="card-info">
        <h2 className="text-xl font-bold">{name || "Anonymous"}</h2>
        <p className="location-tag text-sm opacity-80">{city} • {age} years</p>
        
        {bio && <p className="bio-display italic my-2">"{bio}"</p>}

        {skillList.length > 0 && (
          <div className="skills-grid flex flex-wrap gap-1 justify-center my-2">
            {skillList.map((skill, index) => (
              <span key={index} className="skill-pill bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="card-footer mt-2 text-sm opacity-70 space-y-1">
          {email && <div className="flex items-center justify-center gap-1">📧 {email}</div>}
          {phone && <div className="flex items-center justify-center gap-1">📞 {phone}</div>}
        </div>

        {/* ✏️ Action Buttons */}
        <div className="card-actions no-print mt-4 flex justify-center gap-2">
          <button className="edit-btn px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition" onClick={() => onEdit(profileData)}>✏️ Edit</button>
          <button className="delete-btn px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition" onClick={() => onDelete(profileId)}>🗑️ Delete</button>
        </div>

        {/* 📄 Export Buttons */}
        <div className="export-actions no-print mt-2 flex justify-center gap-2">
          <button className="download-btn pdf px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-800 transition" onClick={downloadPDF}>📄 PDF</button>
          <button className="download-btn json px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-800 transition" onClick={downloadJSON}>⚙️ JSON</button>
        </div>

        {/* 🔗 Share & QR Section */}
        <div className="share-section no-print mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button 
                onClick={() => setShowQR(!showQR)}
                className="w-full text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center justify-center gap-2"
            >
                {showQR ? '🔽 Hide Sharing' : '🔗 Share Profile'}
            </button>

            {showQR && (
                <div className="mt-3 flex flex-col items-center bg-white p-3 rounded-lg shadow-inner">
                    <QRCode value={shareUrl} size={100} />
                    <p className="text-[10px] text-gray-500 mt-2 break-all text-center">{shareUrl}</p>
                    <button 
                        onClick={copyLink}
                        className="mt-2 text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200 font-bold transition"
                    >
                        Copy Link
                    </button>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}

export default ProfileCard;