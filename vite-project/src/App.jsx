import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout & UI Components
import Navbar from './components/Layout/Navbar';

// Auth Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Auth/Profile'; 
import ProjectOverview from './components/Task/ProjectOverview';

// Task Components
import TaskBoard from './components/Task/TaskBoard';

function App() {
  // Check if user is logged in by looking for the token in LocalStorage
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navbar is outside Routes so it appears on every page */}
        <Navbar />

        {/* Main Content Area */}
        <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <TaskBoard /> : <Navigate to="/login" />} 
            />
            
<Route 
  path="/overview" 
  element={isAuthenticated ? <ProjectOverview /> : <Navigate to="/login" />} 
/>

            {/* PROFILE ROUTE MOVED INSIDE ROUTES */}
            <Route 
              path="/profile" 
              element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
            />

          

            {/* Default Landing Logic */}
            <Route 
              path="/" 
              element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
            />

            {/* 404 Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;