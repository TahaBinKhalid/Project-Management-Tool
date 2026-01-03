import React, { useState } from 'react';
import API from '../../services/api';

const Profile = () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const [formData, setFormData] = useState({
    name: storedUser?.name || '',
    email: storedUser?.email || '',
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await API.put('/auth/profile', {
        ...formData,
        userId: storedUser.id
      });
      
      const updatedUser = { ...storedUser, name: res.data.name, email: res.data.email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setMessage('Profile updated successfully!');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setMessage('Error updating profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={profileContainerStyle}>
     
      <div style={headerCardStyle}>
        <div style={avatarContainerStyle}>
          <div style={avatarStyle}>
            {formData.name.charAt(0).toUpperCase()}
          </div>
          <div style={userInfoStyle}>
            <h1 style={welcomeTitleStyle}>Welcome back,</h1>
            <h2 style={userNameStyle}>{formData.name || 'User'}</h2>
            <p style={userEmailStyle}>{formData.email || 'user@example.com'}</p>
          </div>
        </div>
        
        <div style={statsContainerStyle}>
          <div style={statItemStyle}>
            <div style={statNumberStyle}>🎯</div>
            <div style={statLabelStyle}>Active Tasks</div>
          </div>
          <div style={statItemStyle}>
            <div style={statNumberStyle}>📅</div>
            <div style={statLabelStyle}>Member Since</div>
          </div>
          <div style={statItemStyle}>
            <div style={statNumberStyle}>✅</div>
            <div style={statLabelStyle}>Projects</div>
          </div>
        </div>
      </div>

      <div style={formCardStyle}>
        <div style={formHeaderStyle}>
          <div style={formIconStyle}>⚙️</div>
          <div>
            <h2 style={formTitleStyle}>Profile Settings</h2>
            <p style={formSubtitleStyle}>Update your personal information</p>
          </div>
        </div>

        {message && (
          <div style={{
            ...messageStyle,
            background: message.includes('Error') ? '#fee2e2' : '#dcfce7',
            color: message.includes('Error') ? '#991b1b' : '#166534',
            border: `1px solid ${message.includes('Error') ? '#fecaca' : '#bbf7d0'}`
          }}>
            <span style={{ fontSize: '18px', marginRight: '8px' }}>
              {message.includes('Error') ? '❌' : '✅'}
            </span>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
        
          <div style={fieldGroupStyle}>
            <div style={fieldHeaderStyle}>
              <label style={labelStyle}>
                <span style={labelIconStyle}>👤</span>
                Full Name
              </label>
              <span style={helperTextStyle}>This will be displayed across all projects</span>
            </div>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={inputStyle}
              placeholder="Enter your full name"
            />
          </div>

          <div style={fieldGroupStyle}>
            <div style={fieldHeaderStyle}>
              <label style={labelStyle}>
                <span style={labelIconStyle}>📧</span>
                Email Address
              </label>
              <span style={helperTextStyle}>We'll send notifications to this email</span>
            </div>
            <input 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={inputStyle}
              placeholder="Enter your email address"
            />
          </div>

          <div style={buttonGroupStyle}>
            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{
                ...submitButtonStyle,
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? (
                <>
                  <span style={{ marginRight: '8px' }}>⏳</span>
                  Updating...
                </>
              ) : (
                <>
                  <span style={{ marginRight: '8px' }}>✨</span>
                  Update Profile
                </>
              )}
            </button>
            
            <button 
              type="button" 
              onClick={() => setFormData({
                name: storedUser?.name || '',
                email: storedUser?.email || '',
              })}
              style={resetButtonStyle}
            >
              <span style={{ marginRight: '8px' }}>↻</span>
              Reset Changes
            </button>
          </div>
        </form>

        <div style={infoCardStyle}>
          <div style={infoIconStyle}>💡</div>
          <div>
            <h4 style={infoTitleStyle}>Profile Tips</h4>
            <ul style={tipListStyle}>
              <li>Keep your name professional for team recognition</li>
              <li>Use a valid email for notifications and password recovery</li>
              <li>Changes are reflected across all your projects</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const profileContainerStyle = {
  maxWidth: '900px',
  margin: '40px auto',
  padding: '0 20px',
  fontFamily: 'Inter, system-ui, sans-serif'
};

const headerCardStyle = {
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  borderRadius: '24px',
  padding: '40px',
  color: 'white',
  marginBottom: '30px',
  boxShadow: '0 20px 40px rgba(99, 102, 241, 0.25)'
};

const avatarContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
  marginBottom: '30px'
};

const avatarStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '20px',
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '32px',
  fontWeight: 'bold',
  color: 'white',
  border: '3px solid rgba(255, 255, 255, 0.3)'
};

const userInfoStyle = {
  flex: 1
};

const welcomeTitleStyle = {
  fontSize: '1rem',
  fontWeight: '600',
  margin: '0 0 5px 0',
  opacity: 0.9,
  letterSpacing: '0.5px'
};

const userNameStyle = {
  fontSize: '2rem',
  fontWeight: '800',
  margin: '0 0 8px 0',
  letterSpacing: '-0.5px'
};

const userEmailStyle = {
  fontSize: '1rem',
  opacity: 0.8,
  margin: 0,
  fontWeight: '400'
};

const statsContainerStyle = {
  display: 'flex',
  gap: '30px',
  paddingTop: '25px',
  borderTop: '1px solid rgba(255, 255, 255, 0.2)'
};

const statItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px'
};

const statNumberStyle = {
  fontSize: '32px',
  opacity: 0.9
};

const statLabelStyle = {
  fontSize: '0.9rem',
  opacity: 0.8,
  fontWeight: '500'
};

const formCardStyle = {
  background: 'white',
  borderRadius: '20px',
  padding: '40px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
  border: '1px solid #e2e8f0'
};

const formHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  marginBottom: '30px'
};

const formIconStyle = {
  width: '60px',
  height: '60px',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '28px'
};

const formTitleStyle = {
  fontSize: '1.8rem',
  fontWeight: '700',
  margin: '0 0 5px 0',
  color: '#1e293b'
};

const formSubtitleStyle = {
  fontSize: '1rem',
  color: '#64748b',
  margin: 0,
  fontWeight: '400'
};

const messageStyle = {
  padding: '16px 20px',
  borderRadius: '12px',
  marginBottom: '30px',
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.95rem',
  fontWeight: '500'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '28px'
};

const fieldGroupStyle = {
  marginBottom: '10px'
};

const fieldHeaderStyle = {
  marginBottom: '12px'
};

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '15px',
  fontWeight: '600',
  color: '#1e293b',
  marginBottom: '6px'
};

const labelIconStyle = {
  fontSize: '18px'
};

const helperTextStyle = {
  fontSize: '13px',
  color: '#64748b',
  marginLeft: '28px'
};

const inputStyle = {
  width: '100%',
  padding: '16px 20px',
  borderRadius: '12px',
  border: '2px solid #e2e8f0',
  fontSize: '16px',
  color: '#1e293b',
  background: '#f8fafc',
  outline: 'none',
  transition: 'all 0.2s ease'
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '15px',
  marginTop: '10px',
  flexWrap: 'wrap'
};

const submitButtonStyle = {
  padding: '16px 32px',
  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '200px',
  transition: 'all 0.2s ease'
};

const resetButtonStyle = {
  padding: '16px 32px',
  background: '#f1f5f9',
  color: '#64748b',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '180px',
  transition: 'all 0.2s ease'
};

const infoCardStyle = {
  marginTop: '40px',
  padding: '24px',
  background: '#f8fafc',
  borderRadius: '16px',
  border: '1px solid #e2e8f0',
  display: 'flex',
  gap: '20px',
  alignItems: 'flex-start'
};

const infoIconStyle = {
  fontSize: '28px',
  color: '#6366f1',
  marginTop: '2px'
};

const infoTitleStyle = {
  fontSize: '1.1rem',
  fontWeight: '600',
  margin: '0 0 10px 0',
  color: '#1e293b'
};

const tipListStyle = {
  margin: 0,
  paddingLeft: '20px',
  color: '#475569',
  fontSize: '0.9rem',
  lineHeight: '1.6'
};

// Add focus styles
const enhancedInputStyle = {
  ...inputStyle,
  ':focus': {
    borderColor: '#6366f1',
    background: 'white',
    boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)'
  }
};

// Add hover styles
const enhancedSubmitButtonStyle = {
  ...submitButtonStyle,
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)'
  }
};

const enhancedResetButtonStyle = {
  ...resetButtonStyle,
  ':hover': {
    background: '#e2e8f0'
  }
};

export default Profile;