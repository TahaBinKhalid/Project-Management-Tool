import React, { useState } from 'react';
import API from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    
    try {
      const response = await API.post('/auth/register', formData);
      
      console.log("Registration success:", response.data);
      alert("Registration successful! Please login.");
      navigate('/login');
    } catch (err) {
      const serverMessage = err.response?.data?.message || "Registration failed. Please try again.";
      console.error("Full Error Object:", err.response);
      alert("Server Error: " + serverMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { 
    width: '100%', 
    marginBottom: '15px', 
    padding: '10px', 
    borderRadius: '4px', 
    border: '1px solid #ddd',
    boxSizing: 'border-box' 
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" placeholder="Full Name" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
          style={inputStyle} required 
        />
        <input 
          type="email" placeholder="Email Address" 
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
          style={inputStyle} required 
        />
        <input 
          type="password" placeholder="Password (min 6 characters)" 
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
          style={inputStyle} required 
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: loading ? '#ccc' : '#007bff', 
            color: 'white', 
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Processing...' : 'Register'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;