import React from 'react';
import axios from 'axios';
import './TaskItem.css';

export default function TaskItem({ task, onEdit, onChange }) {
  const token = localStorage.getItem('token');

  const handleComplete = async () => {
    await axios.put(`http://localhost:5000/api/tasks/${task.id}`, {
      ...task,
      completed: !task.completed
    }, { headers: { Authorization: token } });
    onChange();
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this task?')) {
      await axios.delete(`http://localhost:5000/api/tasks/${task.id}`, {
        headers: { Authorization: token }
      });
      onChange();
    }
  };

  return (
    <div className={`task-item-card ${task.completed ? 'completed' : ''}`}>
      <div>
        <h3>{task.title}</h3>
        <p>{task.details}</p>
        <small>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}</small>
      </div>
      <div className="task-actions">
        <button onClick={handleComplete}>{task.completed ? 'Undo' : 'Complete'}</button>
        <button onClick={() => onEdit(task)}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}