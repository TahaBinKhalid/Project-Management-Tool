import React from 'react';

const TaskCard = ({ task, innerRef, draggableProps, dragHandleProps }) => {
  return (
    <div 
      className="task-card"
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
  onClick={() => setSelectedTask(task)} 
    >
      <h4 style={{ margin: '0 0 10px 0' }}>{task.title}</h4>
      <p style={{ fontSize: '12px', color: '#666' }}>{task.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <span style={{ 
          fontSize: '10px', 
          background: '#e0e0e0', 
          padding: '2px 6px', 
          borderRadius: '4px' 
        }}>
          {task.assignedTo?.name || 'Unassigned'}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;