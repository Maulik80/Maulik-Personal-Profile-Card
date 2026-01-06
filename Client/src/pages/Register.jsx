import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { User, Mail, Lock, UserPlus, ArrowRight, Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password });
      
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
        toast.success("Account Created! Welcome aboard. 🌟");
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
    <div className="flex items-center justify-center min-h-screen p-4 transition-colors duration-500 bg-gray-50 dark:bg-slate-900 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-white via-purple-50 to-pink-100 dark:from-slate-900 dark:via-[#0f172a] dark:to-black">
      
      <div className="w-full max-w-md p-8 transition-all border shadow-2xl rounded-3xl bg-white/60 dark:bg-white/10 backdrop-blur-xl border-white/50 dark:border-white/10 hover:shadow-pink-500/10">
        
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full shadow-lg bg-gradient-to-tr from-purple-500 to-pink-500 shadow-purple-500/30">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Create Account</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">Join us and build your digital presence</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Name */}
            <div className="relative group">
              <User className="absolute text-gray-400 dark:text-slate-400 top-3.5 left-4 group-focus-within:text-pink-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Full Name"
                className="w-full py-3 pl-12 pr-4 text-gray-800 transition-all border border-gray-200 outline-none dark:text-white bg-white/50 dark:bg-slate-950/50 dark:border-white/10 rounded-xl focus:border-pink-500 focus:bg-white dark:focus:bg-slate-950/80"
                onChange={(e) => setName(e.target.value)} 
                value={name} 
                required 
              />
            </div>

            {/* Email */}
            <div className="relative group">
              <Mail className="absolute text-gray-400 dark:text-slate-400 top-3.5 left-4 group-focus-within:text-purple-500 transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full py-3 pl-12 pr-4 text-gray-800 transition-all border border-gray-200 outline-none dark:text-white bg-white/50 dark:bg-slate-950/50 dark:border-white/10 rounded-xl focus:border-purple-500 focus:bg-white dark:focus:bg-slate-950/80"
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                required 
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock className="absolute text-gray-400 dark:text-slate-400 top-3.5 left-4 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="Secure Password"
                className="w-full py-3 pl-12 pr-4 text-gray-800 transition-all border border-gray-200 outline-none dark:text-white bg-white/50 dark:bg-slate-950/50 dark:border-white/10 rounded-xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950/80"
                onChange={(e) => setPassword(e.target.value)} 
                value={password} 
                required 
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center justify-center w-full gap-2 py-3.5 font-bold text-white transition-all shadow-lg rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 active:scale-95 shadow-purple-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Get Started <ArrowRight size={18} /></>}
          </button>

          <p className="text-sm text-center text-gray-600 dark:text-slate-400">
            Already have an account? <Link to="/login" className="font-bold text-gray-800 transition-colors dark:text-white hover:text-purple-600 dark:hover:text-purple-400">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;