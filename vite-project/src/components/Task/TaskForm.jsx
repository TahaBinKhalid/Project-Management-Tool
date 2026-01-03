import React, { useState, useEffect } from 'react';
import API from '../../services/api';

const TaskForm = ({ projectId, onTaskAdded }) => {
  const [users, setUsers] = useState([]);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    assignedTo: [],
    dueDate: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setFetchingUsers(true);
        const res = await API.get('/users');
        if (res.data) {
          setUsers(res.data);
          console.log("Users loaded successfully:", res.data);
        }
      } catch (err) {
        console.error("CRITICAL ERROR: Could not fetch users.");
      } finally {
        setFetchingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const toggleUserSelection = (userId) => {
    setFormData(prev => {
      const isAlreadySelected = prev.assignedTo.includes(userId);
      const updatedSelection = isAlreadySelected
        ? prev.assignedTo.filter(id => id !== userId) 
        : [...prev.assignedTo, userId]; 
      return { ...prev, assignedTo: updatedSelection };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        project: projectId,
        
        assignedTo: formData.assignedTo.length > 0 ? formData.assignedTo : [],
        dueDate: formData.dueDate || null
      };

      const res = await API.post('/tasks', payload);
      onTaskAdded(res.data);

      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        assignedTo: [], 
        dueDate: ''
      });
    } catch (err) {
      console.error("Error creating task:", err.response?.data || err.message);
      alert("Submission failed. Check console for details.");
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
       
        <div style={rowStyle}>
          <input
            type="text"
            placeholder="What needs to be done? *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            style={inputStyle}
            required
          />
          <select 
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            style={{ ...inputStyle, width: '130px', cursor: 'pointer' }}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>
            Assign to Team Members: {fetchingUsers && "(Loading...)"}
          </label>
          <div style={badgeContainerStyle}>
            {users.map(user => {
              const isSelected = formData.assignedTo.includes(user._id);
              return (
                <div 
                  key={user._id} 
                  onClick={() => toggleUserSelection(user._id)}
                  style={{
                    ...badgeStyle,
                    background: isSelected ? '#4f46e5' : '#f1f5f9',
                    color: isSelected ? 'white' : '#475569',
                    border: isSelected ? '1px solid #4f46e5' : '1px solid #e2e8f0'
                  }}
                >
                  {isSelected ? '✓ ' : '+ '} {user.name || user.username}
                </div>
              );
            })}
            {!fetchingUsers && users.length === 0 && (
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>No users found.</p>
            )}
          </div>
        </div>

        <div style={rowStyle}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', color: '#64748b' }}>Due Date</label>
            <input
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              style={inputStyle}
            />
          </div>
        </div>

   
        <textarea
          placeholder="Add a more detailed description... (optional)"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" style={buttonStyle}>
            ➕ Create Group Task
          </button>
        </div>
      </form>
    </div>
  );
};

const containerStyle = { 
  maxWidth: '800px', 
  margin: '0 auto', 
  background: 'white', 
  padding: '24px', 
  borderRadius: '16px', 
  border: '1px solid #e2e8f0', 
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
};

const rowStyle = { display: 'flex', gap: '12px' };

const inputStyle = { 
  flex: 1, 
  padding: '10px 14px', 
  borderRadius: '8px', 
  border: '1px solid #e2e8f0', 
  fontSize: '14px', 
  outline: 'none', 
  background: '#f8fafc', 
  fontFamily: 'inherit' 
};

const badgeContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  padding: '10px',
  background: '#f8fafc',
  borderRadius: '8px',
  border: '1px dashed #e2e8f0'
};

const badgeStyle = {
  padding: '6px 14px',
  borderRadius: '20px',
  fontSize: '13px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  userSelect: 'none',
  fontWeight: '500'
};

const buttonStyle = { 
  padding: '10px 24px', 
  background: '#4f46e5', 
  color: 'white', 
  border: 'none', 
  borderRadius: '8px', 
  fontWeight: '600', 
  cursor: 'pointer',
  transition: 'background 0.2s'
};

export default TaskForm;