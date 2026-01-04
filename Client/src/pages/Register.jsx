/* client/src/pages/Register.jsx */
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import '../styles/App.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password });
      
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
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
        <h2>📝 Create Account</h2>
        <form onSubmit={onSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" onChange={(e) => setName(e.target.value)} value={name} required />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
          </div>
          
          <div className="button-group">
            <button type="submit" className="save-btn">Register</button>
          </div>

          <p style={{ marginTop: '15px', textAlign: 'center' }}>
            Already have an account? <Link to="/login" style={{ color: '#0984e3' }}>Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;