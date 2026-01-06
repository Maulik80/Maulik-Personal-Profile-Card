import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { ShieldCheck, Loader2 } from 'lucide-react';

const EmailVerify = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { backendUrl, userData, getUserData } = useContext(AppContext);
  const navigate = useNavigate();

  // Redirect if OTP input is filled (Simple auto-submit UX)
  useEffect(() => {
      if(otp.length === 6) {
          onSubmit();
      }
  }, [otp]);

  const onSubmit = async (e) => {
    if(e) e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { 
        userId: userData?._id, 
        otp 
      });

      if (data.success) {
        toast.success("Email Verified! 🎉");
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-900">
      <div className="w-full max-w-md p-10 text-center transition-all border shadow-2xl bg-white/10 backdrop-blur-xl rounded-3xl border-white/10">
        
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full shadow-lg bg-gradient-to-tr from-green-400 to-emerald-600 shadow-green-500/20">
            <ShieldCheck className="w-10 h-10 text-white" />
        </div>

        <h2 className="mb-2 text-2xl font-bold text-white">Verify Your Email</h2>
        <p className="mb-8 text-sm text-slate-400">Enter the 6-digit code sent to your email.</p>

        <form onSubmit={onSubmit}>
            <input 
              type="text" 
              maxLength="6"
              placeholder="0 0 0 0 0 0"
              onChange={(e) => setOtp(e.target.value)} 
              value={otp} 
              className="w-full py-4 text-3xl font-bold text-center text-white tracking-[1rem] transition-all border outline-none bg-slate-950/50 border-white/10 rounded-2xl focus:border-green-500/50 focus:bg-slate-950/80 focus:shadow-[0_0_20px_rgba(34,197,94,0.2)] placeholder-slate-700"
              required 
            />
            
            <button 
                type="submit" 
                disabled={loading}
                className="flex items-center justify-center w-full gap-2 py-4 mt-8 font-bold text-white transition-all shadow-lg rounded-xl bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {loading ? <Loader2 className="animate-spin" /> : 'Verify Now'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerify;