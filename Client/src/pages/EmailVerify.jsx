/* client/src/pages/EmailVerify.jsx */
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import '../styles/App.css';

const EmailVerify = () => {
  const [otp, setOtp] = useState('');
  const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContext);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send userId (from context) and OTP to backend
      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { 
        userId: userData._id, // Ensure userData is loaded
        otp 
      });

      if (data.success) {
        alert("Email Verified Successfully!");
        getUserData(); // Refresh verify status
        navigate('/');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="app-container light-theme">
      <div className="input-form" style={{ maxWidth: '400px', marginTop: '50px' }}>
        <h2>📧 Verify Email</h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          Enter the 6-digit code sent to your email address.
        </p>
        <form onSubmit={onSubmit}>
          <div className="input-group">
            <label>One-Time Password (OTP)</label>
            <input 
              type="text" 
              maxLength="6"
              placeholder="123456"
              onChange={(e) => setOtp(e.target.value)} 
              value={otp} 
              style={{ letterSpacing: '5px', textAlign: 'center', fontSize: '1.5rem' }}
              required 
            />
          </div>
          <div className="button-group">
            <button type="submit" className="save-btn">Verify Now</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailVerify;