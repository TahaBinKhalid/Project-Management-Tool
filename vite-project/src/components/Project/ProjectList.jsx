import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import ProjectForm from './ProjectForm'; 

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get('/projects');
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects", err);
      }
    };
    fetchProjects();
  }, []);

  const handleProjectCreated = (newProject) => {
    setProjects((prev) => [...prev, newProject]);
  };

  return (
    <div style={{ padding: '40px' }}>
      <h1>Dashboard</h1>
      
      <ProjectForm onProjectCreated={handleProjectCreated} />

      <div className="project-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {projects.map((project) => (
          <Link to={`/projects/${project._id}`} key={project._id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="project-card" style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}>
              <h3>{project.title}</h3>
              <p>Tasks: {project.tasks?.length || 0}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;