import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { KeyRound, Mail, Lock, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
      const emailParam = searchParams.get('email');
      const otpParam = searchParams.get('otp');
      if (emailParam && otpParam) {
          setEmail(emailParam);
          setOtp(otpParam);
          setStep(2);
      }
  }, [searchParams]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
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
    } finally {
        setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
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
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 transition-colors duration-500 bg-gray-50 dark:bg-slate-900">
      <div className="w-full max-w-md p-8 transition-all border shadow-2xl rounded-3xl bg-white/60 dark:bg-white/10 backdrop-blur-xl border-white/50 dark:border-white/10">
        
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full shadow-lg bg-gradient-to-tr from-yellow-400 to-orange-500 shadow-orange-500/30">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
            {step === 1 ? "Enter email to receive a reset code" : "Create a new secure password"}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="relative group">
              <Mail className="absolute text-gray-400 dark:text-slate-400 top-3.5 left-4 group-focus-within:text-orange-500 transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="Registered Email"
                className="w-full py-3 pl-12 pr-4 text-gray-800 transition-all border border-gray-200 outline-none dark:text-white bg-white/50 dark:bg-slate-950/50 dark:border-white/10 rounded-xl focus:border-orange-500 focus:bg-white dark:focus:bg-slate-950/80"
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                required 
              />
            </div>
            <button 
                type="submit" 
                disabled={loading}
                className="flex items-center justify-center w-full gap-2 py-3.5 font-bold text-white transition-all shadow-lg rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 active:scale-95 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Send Code <ArrowRight size={18} /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-4">
                <div className="relative group">
                    <CheckCircle className="absolute text-gray-400 dark:text-slate-400 top-3.5 left-4" size={20} />
                    <input 
                        type="text" 
                        placeholder="OTP Code"
                        className="w-full py-3 pl-12 pr-4 text-gray-800 transition-all border border-gray-200 outline-none dark:text-white bg-white/50 dark:bg-slate-950/50 dark:border-white/10 rounded-xl focus:border-green-500"
                        onChange={(e) => setOtp(e.target.value)} 
                        value={otp} 
                        required 
                    />
                </div>
                <div className="relative group">
                    <Lock className="absolute text-gray-400 dark:text-slate-400 top-3.5 left-4 group-focus-within:text-green-500" size={20} />
                    <input 
                        type="password" 
                        placeholder="New Password"
                        className="w-full py-3 pl-12 pr-4 text-gray-800 transition-all border border-gray-200 outline-none dark:text-white bg-white/50 dark:bg-slate-950/50 dark:border-white/10 rounded-xl focus:border-green-500"
                        onChange={(e) => setNewPassword(e.target.value)} 
                        value={newPassword} 
                        required 
                    />
                </div>
            </div>
            <button 
                type="submit" 
                disabled={loading}
                className="flex items-center justify-center w-full gap-2 py-3.5 font-bold text-white transition-all shadow-lg rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 active:scale-95 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;