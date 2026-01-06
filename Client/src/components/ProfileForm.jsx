import React from 'react';
import { User, Briefcase, MapPin, List, Mail, Phone, Image, X } from 'lucide-react';

function ProfileForm({ formData, editingId, handleChange, handlePhotoChange, handleSubmit, handleReset, errors, charLimit, bioLimit }) {
  return (
    <div className="w-full max-w-4xl mx-auto my-6 overflow-hidden text-left transition-all border border-gray-300 shadow-2xl md:my-10 rounded-2xl md:rounded-3xl bg-white/80 dark:bg-white/10 dark:border-white/20 backdrop-blur-xl"
>
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-300 md:px-8 md:py-6 dark:border-white/10 bg-white/50 dark:bg-white/5">
        <h2 className="text-xl font-bold text-transparent md:text-2xl bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          {editingId ? "📝 Edit Profile" : "✨ Create New Profile"}
        </h2>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 md:text-sm">Fill in the details to generate your cosmic digital card.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6 md:p-8">
        
        {/* Top Section: Photo & Identity */}
        <div className="flex flex-col gap-6 md:gap-8 md:flex-row">
          
          {/* Photo Upload Area */}
          <div className="flex-shrink-0 w-full md:w-1/3">
            <label className="block mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-300 md:text-sm">
              Profile Photo
            </label>
            <div className="relative flex items-center justify-center w-full transition-all border-2 border-dashed h-52 md:h-64 rounded-2xl 
              border-gray-400 bg-gray-50/50 hover:bg-blue-50 hover:border-blue-400 /* Light Mode */
              dark:border-white/20 dark:bg-white/5 dark:hover:bg-blue-500/5 dark:hover:border-blue-500/50 /* Dark Mode */
            ">
              
              {formData.photo ? (
                <div className="relative w-full h-full p-2">
                  <img src={formData.photo} alt="Preview" className="object-cover w-full h-full shadow-lg rounded-xl" />
                  <button 
                    type="button" 
                    onClick={() => handleChange({target: {name: 'photo', value: ''}})}
                    className="absolute p-1.5 text-white transition-transform bg-red-500 rounded-full top-3 right-3 hover:bg-red-600 hover:scale-110 shadow-md"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 pointer-events-none">
                  <Image className="mb-3 opacity-50" size={40} />
                  <span className="text-sm font-medium">Click to Upload</span>
                  <span className="text-xs opacity-60">(JPG/PNG, Max 2MB)</span>
                </div>
              )}
              
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
          </div>

          {/* Main Inputs Grid */}
          <div className="grid grid-cols-1 gap-4 md:gap-5 md:grid-cols-2 grow">
            
            {/* Full Name */}
            <div className="col-span-1 md:col-span-1">
              <label className="flex items-center gap-2 mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                <User size={14} className="text-blue-500 dark:text-blue-400" /> Full Name
              </label>
              <input 
                type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ex. John Doe"
                className={`w-full px-4 py-3 border rounded-xl outline-none transition-all 
                  bg-white dark:bg-white/5 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
                  focus:ring-1 focus:ring-blue-500
                  ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-white/10 focus:border-blue-500 dark:focus:border-blue-500/50'}`}
              />
              {errors.name && <span className="flex items-center gap-1 mt-1 text-xs text-red-500"><X size={10}/> {errors.name}</span>}
            </div>

            {/* Age */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                <span className="text-base">🎂</span> Age
              </label>
              <input 
                type="number" name="age" value={formData.age} onChange={handleChange} placeholder="25"
                className="w-full px-4 py-3 text-gray-800 placeholder-gray-400 transition-all bg-white border border-gray-300 outline-none rounded-xl dark:bg-white/5 dark:border-white/10 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* City */}
            <div className="col-span-1">
              <label className="flex items-center gap-2 mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                <MapPin size={14} className="text-green-500 dark:text-green-400" /> City
              </label>
              <div className="relative">
                <input 
                    type="text" name="city" value={formData.city} onChange={handleChange} maxLength={charLimit} placeholder="New York, USA"
                    className={`w-full px-4 py-3 border rounded-xl outline-none transition-all 
                      bg-white dark:bg-white/5 text-gray-800 dark:text-gray-100 placeholder-gray-400
                      focus:ring-1 focus:ring-blue-500
                      ${errors.city ? 'border-red-500' : 'border-gray-300 dark:border-white/10 focus:border-blue-500'}`}
                />
                <span className="absolute text-xs text-gray-400 right-3 bottom-3">{formData.city.length}/{charLimit}</span>
              </div>
              {errors.city && <span className="text-xs text-red-500">{errors.city}</span>}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                <Mail size={14} className="text-purple-500 dark:text-purple-400" /> Email
              </label>
              <input 
                type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com"
                className="w-full px-4 py-3 text-gray-800 placeholder-gray-400 transition-all bg-white border border-gray-300 outline-none rounded-xl dark:bg-white/5 dark:border-white/10 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                <Phone size={14} className="text-yellow-500 dark:text-yellow-400" /> Phone
              </label>
              <input 
                type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 890"
                className={`w-full px-4 py-3 border rounded-xl outline-none transition-all 
                  bg-white dark:bg-white/5 text-gray-800 dark:text-gray-100 placeholder-gray-400
                  focus:ring-1 focus:ring-blue-500
                  ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-white/10 focus:border-blue-500'}`}
              />
              {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
            </div>

            {/* Skills */}
            <div className="col-span-1 md:col-span-1">
              <label className="flex items-center gap-2 mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                <List size={14} className="text-pink-500 dark:text-pink-400" /> Skills
              </label>
              <input 
                type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Design..."
                className="w-full px-4 py-3 text-gray-800 placeholder-gray-400 transition-all bg-white border border-gray-300 outline-none rounded-xl dark:bg-white/5 dark:border-white/10 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <span className="mt-1 text-[10px] md:text-xs text-gray-400">Comma separated values</span>
            </div>

          </div>
        </div>

        {/* Bio Section */}
        <div className="w-full">
          <label className="flex items-center gap-2 mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
            <Briefcase size={14} className="text-orange-500 dark:text-orange-400" /> Bio / About Me
          </label>
          <div className="relative">
            <textarea 
                name="bio" value={formData.bio} onChange={handleChange} rows="4" maxLength={bioLimit} placeholder="Tell us a little bit about yourself..."
                className="w-full px-4 py-3 text-gray-800 placeholder-gray-400 transition-all bg-white border border-gray-300 outline-none resize-none rounded-xl dark:bg-white/5 dark:border-white/10 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <span className="absolute text-xs text-gray-400 right-3 bottom-3">{formData.bio.length}/{bioLimit}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse gap-3 pt-6 border-t border-gray-300 md:flex-row md:items-center md:justify-end dark:border-white/10">
          <button 
            type="button" onClick={handleReset}
            className="w-full px-6 py-3 text-sm font-semibold text-gray-600 transition-colors bg-transparent border border-gray-300 md:w-auto rounded-xl hover:bg-gray-100 dark:text-gray-300 dark:border-white/10 dark:hover:bg-white/5 dark:hover:text-white"
          >
            {editingId ? "Cancel" : "Reset Form"}
          </button>
          <button 
            type="submit" 
            className="w-full px-8 py-3 text-sm font-bold text-white transition-all shadow-lg md:w-auto rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/25 active:scale-95"
          >
            {editingId ? "Update Profile" : "Create Profile"}
          </button>
        </div>

      </form>
    </div>
  );
}

export default ProfileForm;