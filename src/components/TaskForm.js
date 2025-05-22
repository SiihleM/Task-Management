import React, { useState, useEffect } from 'react';

const urgencyLevels = ['high', 'medium', 'low'];

function TaskForm({ addTask, currentUser, editingTask, updateTask, cancelEdit, preFillDate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setDueDate(editingTask.dueDate);
      setPriority(['high', 'medium', 'low'].includes(editingTask.urgency) ? editingTask.urgency : 'medium');
    } else if (preFillDate) {
      setTitle('');
      setDescription('');
      setDueDate(preFillDate);
      setPriority('medium');
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
    }
  }, [editingTask, preFillDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !dueDate) {
      setError('Please provide at least a title and due date.');
      return;
    }
    setError('');
    const taskData = {
      title,
      description,
      dueDate,
      urgency: priority,
      assignedTo: currentUser,
      status: 'incomplete',
    };
    if (editingTask) {
      updateTask({ ...taskData, id: editingTask.id });
    } else {
      addTask(taskData);
    }
    if (!editingTask) {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
    }
  };

  return (
    <section className="create-task-form">
      <h2>{editingTask ? 'Edit Task' : 'Add Task'}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="task-name">Task name*</label>
        <input
          type="text"
          id="task-name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. L3 Assessment"
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add task description"
          rows={4}
        />

        <label htmlFor="due-date">Due date*</label>
        <input
          type="datetime-local"
          id="due-date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          {urgencyLevels.map((level) => (
            <option key={level} value={level}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </option>
          ))}
        </select>

        <button type="submit">{editingTask ? 'Update Task' : 'Submit'}</button>
        {editingTask && (
          <button type="button" onClick={cancelEdit} style={{ marginLeft: '10px' }}>
            Cancel
          </button>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </section>
  );
}

export default TaskForm;
