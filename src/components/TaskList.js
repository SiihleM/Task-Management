import React from 'react';
import TaskComments from './TaskComments';

const statusOptions = ['incomplete', 'in progress', 'complete'];

function TaskList({ tasks, updateTask, deleteTask, currentUser, setEditingTask, addComment }) {
  const handleStatusChange = (task, e) => {
    updateTask({ ...task, status: e.target.value });
  };

  const isOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today && dueDate !== '';
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'in progress':
        return 'inprogress';
      case 'complete':
        return 'complete';
      case 'incomplete':
      default:
        return 'incomplete';
    }
  };

  return (
    <div>
      {tasks.length === 0 ? (
        <p>No tasks to display.</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="task" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '15px', borderRadius: '8px' }}>
            <h3>{task.title}</h3>
            <p>Due Date: {task.dueDate}</p>
            <span className={`status ${getStatusClass(task.status)}`}>
              <select value={task.status} onChange={(e) => handleStatusChange(task, e)}>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </span>
            <div style={{ marginTop: '10px' }}>
              <TaskComments
                comments={task.comments || []}
                addComment={(comment) => addComment(task.id, comment)}
              />
            </div>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button onClick={() => setEditingTask(task)} title="Edit" style={{ cursor: 'pointer' }}>
                Edit
              </button>
              <button onClick={() => deleteTask(task.id)} title="Delete" style={{ cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskList;
