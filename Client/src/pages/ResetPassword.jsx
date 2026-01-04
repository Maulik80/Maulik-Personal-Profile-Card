import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import '../styles/App.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP + New Password
  
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });
      if (data.success) {
        toast.success(data.message);
        setStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { email, otp, newPassword });
      if (data.success) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="app-container light-theme">
      <div className="input-form" style={{ maxWidth: '400px', marginTop: '50px' }}>
        <h2>🔐 Reset Password</h2>
        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
            </div>
            <button type="submit" className="save-btn">Send OTP</button>
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <div className="input-group">
              <label>OTP Code</label>
              <input type="text" onChange={(e) => setOtp(e.target.value)} value={otp} required />
            </div>
            <div className="input-group">
              <label>New Password</label>
              <input type="password" onChange={(e) => setNewPassword(e.target.value)} value={newPassword} required />
            </div>
            <button type="submit" className="save-btn">Reset Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;