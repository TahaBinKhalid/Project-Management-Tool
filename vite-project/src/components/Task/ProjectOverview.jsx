import React, { useState, useEffect } from 'react';
import API from '../../services/api';

const ProjectOverview = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const projectId = "69551fc9a9b5d07916c76504"; // Use your project ID

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get(`/tasks/project/${projectId}`);
        setTasks(res.data || []);
      } catch (err) {
        console.error("Error fetching stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Analyzing Project...</div>;

  // Calculations
  const total = tasks.length;
  const todo = tasks.filter(t => t.status === 'To Do').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const done = tasks.filter(t => t.status === 'Done').length;
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  const statCards = [
    { label: 'Total Tasks', value: total, color: '#3b82f6', icon: '📝' },
    { label: 'To Do', value: todo, color: '#64748b', icon: '⏳' },
    { label: 'In Progress', value: inProgress, color: '#f59e0b', icon: '⚡' },
    { label: 'Completed', value: done, color: '#10b981', icon: '✅' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#1e293b', marginBottom: '30px' }}>Project Overview</h1>

      {/* Progress Section */}
      <div style={{ background: 'white', padding: '30px', borderRadius: '15px', marginBottom: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontWeight: 'bold', color: '#475569' }}>Overall Completion</span>
          <span style={{ fontWeight: 'bold', color: '#10b981', fontSize: '20px' }}>{completionRate}%</span>
        </div>
        <div style={{ width: '100%', height: '15px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${completionRate}%`, height: '100%', background: '#10b981', transition: 'width 1s ease-in-out' }}></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {statCards.map((stat, index) => (
          <div key={index} style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderTop: `5px solid ${stat.color}` }}>
            <div style={{ fontSize: '30px', marginBottom: '10px' }}>{stat.icon}</div>
            <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>{stat.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b' }}>{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectOverview;