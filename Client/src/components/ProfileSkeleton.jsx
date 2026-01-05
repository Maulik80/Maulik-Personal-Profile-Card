import React from 'react';
import './ProfileCard.css'; // Reuse existing card styles

const ProfileSkeleton = () => {
  return (
    <div className="profile-card skeleton-wrapper">
      {/* Fake Image */}
      <div className="skeleton-image pulse"></div>
      
      {/* Fake Text Lines */}
      <div className="profile-details">
        <div className="skeleton-text title pulse"></div>
        <div className="skeleton-text subtitle pulse"></div>
        <div className="skeleton-text line pulse"></div>
        <div className="skeleton-text line pulse"></div>
      </div>
      
      {/* Fake Buttons */}
      <div className="card-actions">
        <div className="skeleton-btn pulse"></div>
        <div className="skeleton-btn pulse"></div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
