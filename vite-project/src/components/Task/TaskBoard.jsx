import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { io } from 'socket.io-client';
import API from '../../services/api';
import TaskForm from './TaskForm';
import EmojiPicker from 'emoji-picker-react'; // You'll need to install this package

const socket = io('http://localhost:5000');

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [commentInput, setCommentInput] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState({});

  const projectId = "69551fc9a9b5d07916c76504"; 
  const currentUser = JSON.parse(localStorage.getItem('user'))?.name || 'Anonymous';

  useEffect(() => {
    fetchTasks();
    socket.emit('joinProject', projectId);
    socket.on('taskUpdated', (updatedTask) => {
      setTasks(prev => {
        const index = prev.findIndex(t => t._id === updatedTask._id);
        if (index !== -1) {
          const newTasks = [...prev];
          newTasks[index] = updatedTask;
          return newTasks;
        }
        return [...prev, updatedTask];
      });
    });
    return () => { socket.off('taskUpdated'); };
  }, [projectId]);

  useEffect(() => {
    if (selectedTask) {
      setEditForm({
        title: selectedTask.title,
        description: selectedTask.description,
        priority: selectedTask.priority,
        status: selectedTask.status
      });
    }
  }, [selectedTask]);

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/project/${projectId}`);
      setTasks(res.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;
    const newStatus = destination.droppableId;
    setTasks(tasks.map(t => t._id === draggableId ? { ...t, status: newStatus } : t));
    try { await API.put(`/tasks/${draggableId}`, { status: newStatus }); }
    catch (err) { fetchTasks(); }
  };

  const handleAddComment = async (taskId, fromSidePanel = false) => {
    const commentText = fromSidePanel ? commentInput['sidePanel'] : commentInput[taskId];
    if (!commentText) return;
    
    try {
      const res = await API.post(`/tasks/${taskId}/comments`, {
        text: commentText,
        userName: currentUser
      });
      
      // Update tasks in both board and side panel
      setTasks(tasks.map(t => t._id === taskId ? res.data : t));
      
      // Clear input
      if (fromSidePanel) {
        setCommentInput({ ...commentInput, 'sidePanel': '' });
      } else {
        setCommentInput({ ...commentInput, [taskId]: '' });
      }
      
      // Close emoji picker if open
      setShowEmojiPicker({});
    } catch (err) { console.error(err); }
  };

  const handleEditTask = async () => {
    if (!selectedTask) return;
    
    try {
      const res = await API.put(`/tasks/${selectedTask._id}`, editForm);
      setTasks(tasks.map(t => t._id === selectedTask._id ? res.data : t));
      setSelectedTask(res.data);
      setIsEditing(false);
    } catch (err) { console.error(err); }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await API.delete(`/tasks/${selectedTask._id}`);
        setTasks(tasks.filter(t => t._id !== selectedTask._id));
        setSelectedTask(null);
      } catch (err) { console.error(err); }
    }
  };

  const addEmojiToComment = (emojiData, taskId, fromSidePanel = false) => {
    const inputKey = fromSidePanel ? 'sidePanel' : taskId;
    const currentText = commentInput[inputKey] || '';
    setCommentInput({
      ...commentInput,
      [inputKey]: currentText + emojiData.emoji
    });
    setShowEmojiPicker({});
  };

  const getStatusStyle = (s) => {
    const map = {
      'To Do': { color: '#3b82f6', bg: '#eff6ff', icon: '📋' },
      'In Progress': { color: '#f59e0b', bg: '#fffbeb', icon: '⚡' },
      'Done': { color: '#10b981', bg: '#f0fdf4', icon: '✅' }
    };
    return map[s] || { color: '#64748b', bg: '#f8fafc', icon: '📝' };
  };

  const getPriorityStyle = (p) => {
    const map = {
      'High': { color: '#ef4444', bg: '#fee2e2' },
      'Medium': { color: '#f59e0b', bg: '#fef3c7' },
      'Low': { color: '#10b981', bg: '#dcfce7' }
    };
    return map[p] || { color: '#64748b', bg: '#f1f5f9' };
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: '#64748b',
    marginTop: '20px',
    marginBottom: '8px',
    textTransform: 'uppercase'
  };

  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}><div className="spinner"></div><p style={{ marginTop: '15px', color: '#64748b' }}>Loading Board...</p></div>
    </div>
  );

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh', fontFamily: '"Inter", sans-serif', color: '#1e293b' }}>
      
      {/* --- STICKY HEADER --- */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #e2e8f0', padding: '15px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#4f46e5' }}>🎯 TaskFlow</h1>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <input 
              placeholder="Search tasks..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', width: '250px' }}
            />
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#64748b' }}>👤 {currentUser}</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px' }}>
        
        {/* --- ADD TASK SECTION --- */}
        <div style={{ marginBottom: '40px' }}>
          <TaskForm projectId={projectId} onTaskAdded={(t) => setTasks([...tasks, t])} />
        </div>

        {/* --- KANBAN BOARD --- */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', alignItems: 'start' }}>
            {['To Do', 'In Progress', 'Done'].map(col => {
              const style = getStatusStyle(col);
              return (
                <Droppable droppableId={col} key={col}>
                  {(provided, snapshot) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} 
                      style={{ background: '#e5e7eb', borderRadius: '16px', padding: '15px', minHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5px 15px' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', color: style.color, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{style.icon}</span> {col.toUpperCase()}
                        </h3>
                        <span style={{ background: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                          {filteredTasks.filter(t => t.status === col).length}
                        </span>
                      </div>

                      {/* --- SCROLLABLE TASK AREA --- */}
                      <div style={{ flex: 1 }}>
                        {filteredTasks.filter(t => t.status === col).map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided, snap) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                style={{ 
                                  ...provided.draggableProps.style, 
                                  padding: '16px', marginBottom: '12px', background: 'white', borderRadius: '12px',
                                  boxShadow: snap.isDragging ? '0 15px 30px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.02)',
                                  border: snap.isDragging ? `2px solid ${style.color}` : 'none'
                                }}
                                onClick={() => setSelectedTask(task)}
                              >
                                
                                <span style={{ 
                                  fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px',
                                  color: getPriorityStyle(task.priority).color, 
                                  background: getPriorityStyle(task.priority).bg, 
                                  padding: '4px 8px', borderRadius: '6px', textTransform: 'uppercase'
                                }}>
                                  {task.priority}
                                </span>

                                <h4 style={{ margin: '12px 0 6px 0', fontSize: '15px', fontWeight: 600 }}>{task.title}</h4>
                                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px', lineHeight: '1.4' }}>{task.description}</p>

                                {/* Comments List */}
                                {task.comments?.length > 0 && (
                                  <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '8px', marginBottom: '12px' }}>
                                    {task.comments.slice(-2).map((c, i) => ( // Show last 2 comments
                                      <div key={i} style={{ fontSize: '11px', marginBottom: '4px', borderBottom: i === 0 && task.comments.length > 1 ? '1px solid #e2e8f0' : 'none', paddingBottom: '2px' }}>
                                        <span style={{ fontWeight: 600 }}>{c.userName}:</span> {c.text}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Compact Input Field with Emoji */}
                                <div style={{ display: 'flex', gap: '6px', position: 'relative' }}>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowEmojiPicker({ [task._id]: true });
                                    }}
                                    style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0 8px', cursor: 'pointer', fontSize: '14px' }}
                                  >
                                    😊
                                  </button>
                                  {showEmojiPicker[task._id] && (
                                    <div style={{ position: 'absolute', bottom: '40px', left: '0', zIndex: 1000 }}>
                                      <EmojiPicker
                                        onEmojiClick={(emojiData) => addEmojiToComment(emojiData, task._id)}
                                        width={300}
                                        height={350}
                                      />
                                    </div>
                                  )}
                                  <input 
                                    placeholder="Add comment..."
                                    value={commentInput[task._id] || ''}
                                    onChange={(e) => setCommentInput({...commentInput, [task._id]: e.target.value})}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{ flex: 1, fontSize: '12px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none' }}
                                  />
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddComment(task._id);
                                    }} 
                                    style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', padding: '0 10px', cursor: 'pointer', fontSize: '12px' }}
                                  >
                                    Send
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
          
        </DragDropContext>
        
        {/* --- SLIDE-OUT PANEL --- */}
        {selectedTask && (
          <div style={{
            position: 'fixed', top: 0, right: 0, width: '450px', height: '100vh',
            background: 'white', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
            zIndex: 3000, padding: '30px', transition: '0.3s ease-in-out',
            display: 'flex', flexDirection: 'column', overflowY: 'auto'
          }}>
            {/* Header with actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <button 
                onClick={() => setSelectedTask(null)}
                style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
              >✕</button>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  style={{ padding: '6px 12px', background: '#e0e7ff', color: '#4f46e5', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                >
                  {isEditing ? 'Cancel Edit' : '✏️ Edit'}
                </button>
                <button 
                  onClick={handleDeleteTask}
                  style={{ padding: '6px 12px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              {isEditing ? (
                // EDIT MODE
                <div>
                  <label style={labelStyle}>Title</label>
                  <input
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '15px' }}
                  />
                  
                  <label style={labelStyle}>Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', minHeight: '100px', marginBottom: '15px' }}
                  />
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label style={labelStyle}>Priority</label>
                      <select
                        value={editForm.priority}
                        onChange={(e) => setEditForm({...editForm, priority: e.target.value})}
                        style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    
                    <div>
                      <label style={labelStyle}>Status</label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                        style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleEditTask}
                    style={{ width: '100%', padding: '12px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '20px', fontWeight: 600 }}
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                // VIEW MODE
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: getStatusStyle(selectedTask.status).color, textTransform: 'uppercase' }}>
                    {selectedTask.status}
                  </span>
                  <h2 style={{ fontSize: '24px', margin: '10px 0 20px 0' }}>{selectedTask.title}</h2>
                  
                  <label style={labelStyle}>Description</label>
                  <div style={{ 
                    background: '#f8fafc', 
                    padding: '15px', 
                    borderRadius: '8px', 
                    marginBottom: '20px',
                    lineHeight: '1.6'
                  }}>
                    {selectedTask.description || "No description provided."}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                    <div>
                      <label style={labelStyle}>Priority</label>
                      <div style={{ 
                        display: 'inline-block', 
                        padding: '6px 12px', 
                        borderRadius: '20px', 
                        fontSize: '13px',
                        fontWeight: 600,
                        color: getPriorityStyle(selectedTask.priority).color,
                        background: getPriorityStyle(selectedTask.priority).bg
                      }}>
                        {selectedTask.priority}
                      </div>
                    </div>
                    
                    <div>
                      <label style={labelStyle}>Created</label>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>
                        {new Date(selectedTask.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Comments Section in Side Panel */}
                  <label style={labelStyle}>Comments ({selectedTask.comments?.length || 0})</label>
                  
                  {/* Add Comment in Side Panel */}
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', position: 'relative' }}>
                    <button 
                      onClick={() => setShowEmojiPicker({ sidePanel: true })}
                      style={{ 
                        background: 'none', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '6px', 
                        padding: '0 12px', 
                        cursor: 'pointer', 
                        fontSize: '16px',
                        height: '40px'
                      }}
                    >
                      😊
                    </button>
                    {showEmojiPicker.sidePanel && (
                      <div style={{ position: 'absolute', bottom: '45px', left: '0', zIndex: 1000 }}>
                        <EmojiPicker
                          onEmojiClick={(emojiData) => addEmojiToComment(emojiData, null, true)}
                          width={300}
                          height={350}
                        />
                      </div>
                    )}
                    <input 
                      placeholder="Add a comment..."
                      value={commentInput['sidePanel'] || ''}
                      onChange={(e) => setCommentInput({...commentInput, 'sidePanel': e.target.value})}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(selectedTask._id, true)}
                      style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                    />
                    <button 
                      onClick={() => handleAddComment(selectedTask._id, true)}
                      style={{ 
                        background: '#4f46e5', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '6px', 
                        padding: '0 20px', 
                        cursor: 'pointer',
                        fontWeight: 500
                      }}
                    >
                      Send
                    </button>
                  </div>

                  {/* Comments List */}
                  <div style={{ maxHeight: '300px', overflowY: 'auto', background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                    {selectedTask.comments?.length > 0 ? (
                      selectedTask.comments.map((c, i) => (
                        <div key={i} style={{ 
                          marginBottom: '15px', 
                          padding: '12px',
                          background: i % 2 === 0 ? 'white' : 'transparent',
                          borderRadius: '8px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}>{c.userName}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                              {new Date(c.createdAt || Date.now()).toLocaleDateString()}
                            </div>
                          </div>
                          <div style={{ fontSize: '14px', color: '#334155', lineHeight: '1.5' }}>
                            {c.text}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
                        No comments yet. Start the conversation!
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Backdrop to close panel when clicking outside */}
        {selectedTask && (
          <div 
            onClick={() => setSelectedTask(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 2999 }} 
          />
        )}

        {/* --- MODERN FOOTER --- */}
        <footer style={{ 
          marginTop: '50px', 
          padding: '30px 40px', 
          borderTop: '1px solid #e2e8f0', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          color: '#94a3b8',
          fontSize: '13px'
        }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>© 2026 TaskFlow Pro</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></span>
              System Online
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Project ID: <code style={{ background: '#f1f5f9', padding: '2px 5px', borderRadius: '4px' }}>{projectId.substring(0,8)}...</code></span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#4f46e5'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
              Documentation
            </span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#4f46e5'} onMouseOut={(e) => e.target.style.color = '#94a3b8'}>
              Support
            </span>
          </div>
        </footer>
      </div>

      <style>{`
        .spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #4f46e5; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        input:focus, textarea:focus, select:focus { border-color: #4f46e5 !important; box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1); }
      `}</style>
    </div>
  );
};

export default TaskBoard;