import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  const navLinkStyle = (path) => ({
    color: 'white',
    textDecoration: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    background: location.pathname === path ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
    fontWeight: '500',
    transition: '0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px'
  });

  return (
    <nav style={{ 
      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      padding: '0 40px',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 2000,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      fontFamily: '"Inter", sans-serif'
    }}>
      {/* --- Logo --- */}
      <Link to="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}>🚀</span>
        <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800' }}>TaskFlow</h2>
      </Link>

      {/* --- Desktop Menu --- */}
      <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {token ? (
          <>
            <Link to="/dashboard" style={navLinkStyle('/dashboard')}>📊 Board</Link>
            <Link to="/overview" style={navLinkStyle('/overview')}>📈 Stats</Link>
            <Link to="/profile" style={navLinkStyle('/profile')}>👤 Profile</Link>
            
            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.3)', margin: '0 10px' }} />
            
            {/* User Avatar Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '13px', fontWeight: '500' }}>{user?.name}</span>
            </div>

            <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/login" style={navLinkStyle('/login')}>Login</Link>
            <Link to="/register" style={{ ...navLinkStyle('/register'), background: 'white', color: '#4f46e5' }}>Join Free</Link>
          </div>
        )}
      </div>

      {/* --- Mobile Toggle --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ display: 'none', background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}
        className="mobile-toggle"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* --- Mobile Menu Overlay --- */}
      {isOpen && (
        <div style={{
          position: 'absolute', top: '70px', left: 0, width: '100%', 
          background: '#4f46e5', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px',
          boxShadow: '0 10px 10px rgba(0,0,0,0.1)', zIndex: 1999
        }}>
           {token ? (
             <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} style={navLinkStyle('/dashboard')}>📊 Board</Link>
                <Link to="/overview" onClick={() => setIsOpen(false)} style={navLinkStyle('/overview')}>📈 Stats</Link>
                <Link to="/profile" onClick={() => setIsOpen(false)} style={navLinkStyle('/profile')}>👤 Profile</Link>
                <button onClick={handleLogout} style={{ ...logoutBtnStyle, width: '100%', marginTop: '10px' }}>Logout</button>
             </>
           ) : (
             <>
                <Link to="/login" onClick={() => setIsOpen(false)} style={navLinkStyle('/login')}>Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} style={{ ...navLinkStyle('/register'), background: 'white', color: '#4f46e5' }}>Join Free</Link>
             </>
           )}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

const logoutBtnStyle = {
  background: '#ef4444', 
  color: 'white', 
  border: 'none', 
  padding: '8px 16px', 
  borderRadius: '8px', 
  fontWeight: '600', 
  cursor: 'pointer',
  fontSize: '13px'
};

export default Navbar;