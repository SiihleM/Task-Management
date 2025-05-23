import React, { useState } from 'react';

const priorityColors = {
  high: '#E94E4E',
  medium: '#F5A623',
  low: '#4CAF50',
};

const statusColors = {
  'in progress': '#F5A623',
  incomplete: '#E94E4E',
  completed: '#4CAF50',
};

function TaskDetails({ task, onClose }) {
  const [category, setCategory] = useState(task.category || '');
  const [label, setLabel] = useState(task.label || '');
  const [description, setDescription] = useState(task.description || '');
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');
  const [comments, setComments] = useState(task.comments || []);
  const [newComment, setNewComment] = useState('');

  const addSubtask = () => {
    if (newSubtask.trim() === '') return;
    setSubtasks([...subtasks, { id: Date.now(), title: newSubtask, completed: false }]);
    setNewSubtask('');
  };

  const toggleSubtask = (id) => {
    setSubtasks(
      subtasks.map((st) =>
        st.id === id ? { ...st, completed: !st.completed } : st
      )
    );
  };

  const addComment = () => {
    if (newComment.trim() === '') return;
    setComments([...comments, { id: Date.now(), text: newComment }]);
    setNewComment('');
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="task-details-overlay" style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
    }}>
      <div className="task-details-container" style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        width: '480px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px',
        boxSizing: 'border-box',
        position: 'relative',
      }}>
        <button onClick={onClose} aria-label="Close" style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: '#999',
        }}>
          &times;
        </button>
        <h2 style={{ marginTop: 0, marginBottom: '8px' }}>
          {task.title}
          <span style={{
            backgroundColor: priorityColors[task.urgency] || '#ccc',
            color: '#fff',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '12px',
            marginLeft: '8px',
          }}>
            {task.urgency.charAt(0).toUpperCase() + task.urgency.slice(1)} Priority
          </span>
          <span style={{
            backgroundColor: statusColors[task.status] || '#ccc',
            color: '#fff',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '12px',
            marginLeft: '8px',
          }}>
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
        </h2>

        <div style={{ marginBottom: '16px' }}>
          <strong>Assignee:</strong> {task.assignedTo || '-'}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <strong>Start Date:</strong> {formatDateTime(task.startDate)}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <strong>Due Date:</strong> {formatDateTime(task.dueDate)}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <strong>Category:</strong>{' '}
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Add Category"
            style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <strong>Label:</strong>{' '}
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Add Label"
            style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <strong>Description:</strong>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            rows={4}
            style={{ width: '100%', padding: '6px', boxSizing: 'border-box', marginTop: '4px' }}
          />
          <button style={{ marginTop: '8px', float: 'left' }}>Attach</button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <strong>Subtasks:</strong>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {subtasks.map((st) => (
              <li key={st.id} style={{ marginBottom: '6px' }}>
                <label style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => toggleSubtask(st.id)}
                    style={{ marginRight: '8px' }}
                  />
                  {st.title}
                </label>
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            placeholder="Add subtask"
            style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }}
          />
          <button onClick={addSubtask} style={{ marginTop: '8px' }}>Add Subtask</button>
        </div>

        <div>
          <strong>Comments:</strong>
          <ul style={{ listStyle: 'none', paddingLeft: 0, maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '6px', padding: '8px' }}>
            {comments.map((c) => (
              <li key={c.id} style={{ marginBottom: '8px' }}>{c.text}</li>
            ))}
          </ul>
          <div style={{ display: 'flex', marginTop: '8px' }}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add comment"
              style={{ flexGrow: 1, padding: '6px', boxSizing: 'border-box' }}
            />
            <button onClick={addComment} style={{ marginLeft: '8px' }}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
