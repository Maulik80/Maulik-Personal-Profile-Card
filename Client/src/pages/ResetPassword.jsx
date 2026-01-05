import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom'; // 1. Import useSearchParams
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import '../styles/App.css';

const ResetPassword = () => {
  // State for form fields
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset Password
  
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  // 2. Get Query Parameters from URL (Magic Link)
  const [searchParams] = useSearchParams();

  // 3. Auto-fill and Auto-advance if link is clicked
  useEffect(() => {
      const emailParam = searchParams.get('email');
      const otpParam = searchParams.get('otp');

      if (emailParam && otpParam) {
          setEmail(emailParam);
          setOtp(otpParam);
          setStep(2); // Skip straight to "Enter New Password"
      }
  }, [searchParams]);

  // --- Handle Sending OTP (Manual Flow) ---
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

  // --- Handle Password Reset (Final Step) ---
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
          // STEP 1: Email Input
          <form onSubmit={handleSendOtp}>
            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                required 
                placeholder="Enter your registered email"
              />
            </div>
            <button type="submit" className="save-btn">Send OTP</button>
          </form>
        ) : (
          // STEP 2: OTP & New Password
          <form onSubmit={handleReset}>
            {/* We hide the OTP field if it was auto-filled to keep UI clean, 
                but keep it editable just in case. */}
            <div className="input-group">
              <label>OTP Code</label>
              <input 
                type="text" 
                onChange={(e) => setOtp(e.target.value)} 
                value={otp} 
                required 
                placeholder="Check your email for code"
              />
            </div>
            
            <div className="input-group">
              <label>New Password</label>
              <input 
                type="password" 
                onChange={(e) => setNewPassword(e.target.value)} 
                value={newPassword} 
                required 
                placeholder="Enter new secure password"
              />
            </div>
            
            <button type="submit" className="save-btn">Reset Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;