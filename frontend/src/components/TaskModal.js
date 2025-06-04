import React, { useState } from 'react';
import axios from 'axios';
import './TaskModal.css';

export default function TaskModal({ task, onClose }) {
  const [title, setTitle] = useState(task ? task.title : '');
  const [details, setDetails] = useState(task ? task.details : '');
  const [dueDate, setDueDate] = useState(task ? task.due_date : '');

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (task) {
      await axios.put(`http://localhost:5000/api/tasks/${task.id}`, {
        ...task,
        title,
        details,
        due_date: dueDate
      }, { headers: { Authorization: token } });
    } else {
      await axios.post('http://localhost:5000/api/tasks', {
        title,
        details,
        due_date: dueDate
      }, { headers: { Authorization: token } });
    }
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{task ? 'Edit Task' : 'Add Task'}</h2>
        <form onSubmit={handleSubmit}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
          <textarea value={details} onChange={e => setDetails(e.target.value)} placeholder="Details" />
          <input type="date" value={dueDate || ''} onChange={e => setDueDate(e.target.value)} />
          <div className="modal-actions">
            <button type="submit">{task ? 'Update' : 'Add'}</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}