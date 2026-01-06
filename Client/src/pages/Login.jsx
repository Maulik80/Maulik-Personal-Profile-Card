import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { Mail, Lock, LogIn, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // ⏳ Loading State
  
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password });
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
        toast.success("Welcome back! 🚀");
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 transition-colors duration-500 bg-gray-50 dark:bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-blue-50 to-blue-100 dark:from-slate-900 dark:via-[#0f172a] dark:to-black">
      
      <div className="w-full max-w-md p-8 transition-all border shadow-2xl rounded-3xl bg-white/60 dark:bg-white/10 backdrop-blur-xl border-white/50 dark:border-white/10 hover:shadow-blue-500/10">
        
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full shadow-lg bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-blue-500/30">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute text-gray-400 dark:text-slate-400 top-3.5 left-4 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full py-3 pl-12 pr-4 text-gray-800 dark:text-white transition-all border outline-none bg-white/50 dark:bg-slate-950/50 border-gray-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950/80 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                required 
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute text-gray-400 dark:text-slate-400 top-3.5 left-4 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="Password"
                className="w-full py-3 pl-12 pr-4 text-gray-800 dark:text-white transition-all border outline-none bg-white/50 dark:bg-slate-950/50 border-gray-200 dark:border-white/10 rounded-xl focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950/80 focus:shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                onChange={(e) => setPassword(e.target.value)} 
                value={password} 
                required 
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Link to="/reset-password" class="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">Forgot Password?</Link>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center justify-center w-full gap-2 py-3.5 font-bold text-white transition-all shadow-lg rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={18} /></>}
          </button>

          <p className="text-sm text-center text-gray-600 dark:text-slate-400">
            Don't have an account? <Link to="/register" className="font-bold text-gray-800 transition-colors dark:text-white hover:text-blue-600 dark:hover:text-blue-400">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;