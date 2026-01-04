/* client/src/pages/Login.jsx */
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import '../styles/App.css'; // Reusing your existing styles

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password });
      
      if (data.success) {
        setIsLoggedin(true);
        getUserData(); // Fetch user info
        navigate('/'); // Redirect to Dashboard
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
        <h2>🔐 Login</h2>
        <form onSubmit={onSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
          </div>
          
          <div className="button-group">
            <button type="submit" className="save-btn">Login</button>
          </div>
          
          <p style={{ marginTop: '15px', textAlign: 'center' }}>
            Don't have an account? <Link to="/register" style={{ color: '#0984e3' }}>Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;