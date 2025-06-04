import React from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

export default function TaskList({ tasks, onEdit, onChange }) {
  return (
    <div className="tasklist">
      {tasks.length === 0 && <div>No tasks yet.</div>}
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} onEdit={onEdit} onChange={onChange} />
      ))}
    </div>
  );
}