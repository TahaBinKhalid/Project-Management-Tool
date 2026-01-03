import React, { useState } from 'react';
import API from '../../services/api';

const ProjectForm = ({ onProjectCreated }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/projects', { title });
      onProjectCreated(res.data); // Update the list in ProjectList.jsx
      setTitle(''); // Reset input
    } catch (err) {
      console.error("Error creating project", err);
      alert("Failed to create project");
    }
  };

  return (
    <div style={{ marginBottom: '20px', padding: '15px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3>Create New Project</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Project Title (e.g., Marketing Campaign)" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required 
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Create
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;