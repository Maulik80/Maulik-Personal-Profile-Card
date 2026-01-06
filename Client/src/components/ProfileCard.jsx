import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import QRCode from "react-qr-code";
import { toast } from 'react-toastify';
import { Edit2, Trash2, FileDown, Code, Share2, Eye, Mail, Phone, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

function ProfileCard({ profileData, onEdit, onDelete }) {
  // Destructure with safe defaults
  const { _id, id, name, age, city, bio, skills, email, phone, photo, views } = profileData;
  const profileId = _id || id;
  
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/share/${profileId}`;
  const skillList = skills ? skills.split(',').map(s => s.trim()).filter(s => s !== "") : [];
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
    
    // Hide buttons for cleaner PDF
    element.classList.add('pdf-mode');
    
    const opt = {
      margin: 0.2,
      filename: `${name}_profile.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      element.classList.remove('pdf-mode');
    });
  };

  // --- 3. Copy Link ---
  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Public Link Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      id={`profile-card-${profileId}`}
      className="relative w-full max-w-[380px] mx-auto p-8 text-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl rounded-3xl overflow-hidden
      bg-white/70 border border-white/50 shadow-xl backdrop-blur-xl
      dark:bg-white/5 dark:border-white/10 dark:text-white dark:shadow-purple-500/10"
    >
      
      {/* 👁️ Views Counter Badge */}
      <div className="absolute flex items-center gap-1 px-3 py-1 text-xs font-bold text-gray-600 border rounded-full shadow-sm top-4 right-4 bg-white/50 backdrop-blur-md border-white/40 dark:text-gray-300 dark:bg-white/10 dark:border-white/20">
         <Eye size={14} /> {views || 0}
      </div>

      {/* 🌌 Cosmic Avatar Section */}
      <div className="relative w-32 h-32 mx-auto mb-6 group">
        {/* Animated Glow Ring */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur opacity-75 animate-[spin_4s_linear_infinite]"></div>
        
        {/* Avatar Image */}
        <img 
          src={avatarUrl} 
          alt={`${name}'s avatar`} 
          className="relative object-cover w-full h-full bg-gray-100 border-4 border-white rounded-full shadow-lg dark:border-slate-800 dark:bg-slate-700" 
        />
      </div>

      <div className="relative z-10">
        <h2 className="mb-1 text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          {name || "Anonymous"}
        </h2>
        <p className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          {city} • {age} years
        </p>
        
        {bio && (
          <div className="relative p-4 my-4 border border-blue-100 rounded-xl bg-blue-50/50 dark:bg-white/5 dark:border-white/10">
             <p className="text-sm italic text-gray-600 dark:text-gray-300">"{bio}"</p>
          </div>
        )}

        {/* Skills */}
        {skillList.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 my-4">
            {skillList.map((skill, index) => (
              <span key={index} className="px-3 py-1 text-xs font-bold text-blue-700 bg-blue-100 border border-blue-200 rounded-full dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-500/30">
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Contact Info */}
        <div className="mt-4 space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
          {email && <div className="flex items-center justify-center gap-2 transition-colors cursor-pointer hover:text-blue-500"><Mail size={14} /> {email}</div>}
          {phone && <div className="flex items-center justify-center gap-2 transition-colors cursor-pointer hover:text-blue-500"><Phone size={14} /> {phone}</div>}
        </div>

        {/* ✏️ Action Buttons */}
        <div className="flex justify-center gap-3 mt-6 no-print">
          <button 
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white transition-all shadow-lg rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/25 active:scale-95" 
            onClick={() => onEdit(profileData)}
          >
            <Edit2 size={16} /> Edit
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white transition-all shadow-lg rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 hover:shadow-red-500/25 active:scale-95" 
            onClick={() => onDelete(profileId)}
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>

        {/* 📄 Export Buttons */}
        <div className="flex justify-center gap-3 mt-3 no-print">
          <button 
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 transition-all bg-white border border-gray-200 shadow-sm rounded-xl hover:bg-gray-50 hover:border-gray-300 dark:bg-white/10 dark:text-gray-200 dark:border-white/10 dark:hover:bg-white/20" 
            onClick={downloadPDF}
          >
            <FileDown size={14} /> PDF
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 transition-all bg-white border border-gray-200 shadow-sm rounded-xl hover:bg-gray-50 hover:border-gray-300 dark:bg-white/10 dark:text-gray-200 dark:border-white/10 dark:hover:bg-white/20" 
            onClick={downloadJSON}
          >
            <Code size={14} /> JSON
          </button>
        </div>

        {/* 🔗 Share & QR Section */}
        <div className="pt-4 mt-6 border-t border-gray-200 dark:border-white/10 no-print">
            <button 
                onClick={() => setShowQR(!showQR)}
                className="flex items-center justify-center w-full gap-2 text-sm font-semibold text-indigo-500 transition-colors hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
                {showQR ? <ChevronUp size={16} /> : <Share2 size={16} />}
                {showQR ? 'Hide Sharing' : 'Share Profile'}
            </button>

            {showQR && (
                <div className="flex flex-col items-center p-4 mt-4 bg-white border border-gray-100 shadow-2xl rounded-2xl animate-fade-in-down dark:bg-slate-800 dark:border-slate-700">
                    <div className="p-2 bg-white rounded-xl">
                      <QRCode value={shareUrl} size={120} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-3 break-all text-center font-mono">{shareUrl}</p>
                    <button 
                        onClick={copyLink}
                        className="flex items-center gap-2 px-4 py-1.5 mt-3 text-xs font-bold text-white transition bg-indigo-600 rounded-full shadow-lg hover:bg-indigo-700 active:scale-95"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? "Copied!" : "Copy Link"}
                    </button>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}

export default ProfileCard;