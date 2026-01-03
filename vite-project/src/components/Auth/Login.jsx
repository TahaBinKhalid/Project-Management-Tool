import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', formData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      navigate('/dashboard');
      
      window.location.reload(); 
    } catch (err) {
      alert(err.response?.data?.message || "Login failed. Check credentials.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '30px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email</label>
          <input 
            type="email" 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password</label>
          <input 
            type="password" 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;