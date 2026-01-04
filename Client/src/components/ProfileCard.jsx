/* src/components/ProfileCard.jsx */
import React from 'react';
import html2pdf from 'html2pdf.js';
import './ProfileCard.css';

function ProfileCard({ profileData, theme, onEdit, onDelete }) {
  const { id, name, age, city, bio, skills, email, phone, photo } = profileData;

  const skillList = skills ? skills.split(',').map(s => s.trim()).filter(s => s !== "") : [];
  const avatarUrl = photo || `https://api.dicebear.com/9.x/initials/svg?seed=${name || 'placeholder'}`;

  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profileData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${name}_profile.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const downloadPDF = () => {
    const element = document.getElementById(`profile-card-${id}`);
    
    // Logic: Force a specific export style for clean PDF
    const opt = {
      margin: 0.5,
      filename: `${name}_profile.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Add a temporary class to fix colors for PDF export
    element.classList.add('pdf-export-mode');
    
    html2pdf().set(opt).from(element).save().then(() => {
      element.classList.remove('pdf-export-mode');
    });
  };

  return (
    <div className={`profile-card ${theme}-card`} id={`profile-card-${id}`}>
      <div className="avatar-container">
        <img src={avatarUrl} alt={`${name}'s avatar`} className="profile-avatar" />
      </div>

      <div className="card-info">
        <h2>{name || "Anonymous"}</h2>
        <p className="location-tag">{city} • {age} years</p>
        {bio && <p className="bio-display">"{bio}"</p>}

        {skillList.length > 0 && (
          <div className="skills-grid">
            {skillList.map((skill, index) => (
              <span key={index} className="skill-pill">{skill}</span>
            ))}
          </div>
        )}

        <div className="card-footer">
          {email && <small>📧 {email}</small>}
          {phone && <small>📞 {phone}</small>}
        </div>

        <div className="card-actions no-print">
          <button className="edit-btn" aria-label="Edit Profile" onClick={() => onEdit(profileData)}>✏️ Edit</button>
          <button className="delete-btn" aria-label="Delete Profile" onClick={() => onDelete(id)}>🗑️ Delete</button>
        </div>

        <div className="export-actions no-print">
          <button className="download-btn pdf" onClick={downloadPDF}>📄 PDF</button>
          <button className="download-btn json" onClick={downloadJSON}>⚙️ JSON</button>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;