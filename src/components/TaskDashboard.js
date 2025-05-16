import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import CalendarView from './CalendarView';
import Settings from './Settings';

const initialTasks = [
  {
    id: 1,
    title: 'Complete project proposal',
    description: 'Finish writing the project proposal document',
    status: 'in progress',
    urgency: 'high',
    assignedTo: 'user1@example.com',
    dueDate: '2024-06-10',
  },
  {
    id: 2,
    title: 'Review team feedback',
    description: 'Analyze feedback from QA team',
    status: 'incomplete',
    urgency: 'medium',
    assignedTo: 'user2@example.com',
    dueDate: '2024-06-12',
  },
];

import TaskComments from './TaskComments';
import Notifications from './Notifications';

function TaskDashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });
  const [filterUser, setFilterUser] = useState('all');
  const [view, setView] = useState('list'); // 'list', 'calendar', 'create', 'settings'
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [preFillDate, setPreFillDate] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Add comment to task
  const addCommentToTask = (taskId, comment) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, comments: [...(task.comments || []), comment] }
          : task
      )
    );
  };

  // Check for upcoming due tasks and add notifications
  useEffect(() => {
    const now = new Date();
    const upcomingTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      const diffTime = dueDate.getTime() - now.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);
      return diffDays >= 0 && diffDays <= 2; // due within 2 days
    });
    const newNotifications = upcomingTasks.map(task => `Task "${task.title}" is due on ${task.dueDate}`);
    setNotifications(newNotifications);
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const dismissNotification = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  const addTask = (task) => {
    setTasks((prev) => [...prev, { ...task, id: Date.now() }]);
  };

  const updateTask = (updatedTask) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setEditingTask(null);
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTasks =
    tasks
      .filter((t) => (filterUser === 'all' ? true : t.assignedTo === filterUser))
      .filter((t) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const uniqueUsers = Array.from(new Set(tasks.map((t) => t.assignedTo)));

  // Handler for adding task from calendar with pre-filled date
  const handleAddTaskFromCalendar = (dateStr) => {
    setPreFillDate(dateStr);
    setEditingTask(null);
    setView('create');
  };

  return (
    <>
      <header style={{ backgroundColor: '#07162F', padding: '10px 20px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontWeight: '800', fontSize: '22px', margin: 0 }}>Task Management Tracker</h1>
        <nav>
          <ul style={{ listStyle: 'none', display: 'flex', gap: '20px', margin: 0, padding: 0, alignItems: 'center' }}>
            <li>
              <button
                onClick={() => setView('list')}
                style={{
                  backgroundColor: view === 'list' ? '#E94E4E' : 'transparent',
                  color: view === 'list' ? '#fff' : '#808191',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '16px',
                }}
              >
                My tasks
              </button>
            </li>
            <li>
              <button
                onClick={() => setView('calendar')}
                style={{
                  backgroundColor: view === 'calendar' ? '#E94E4E' : 'transparent',
                  color: view === 'calendar' ? '#fff' : '#808191',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '16px',
                }}
              >
                Calendar
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setView('create');
                  setEditingTask(null);
                  setPreFillDate(null);
                }}
                style={{
                  backgroundColor: view === 'create' ? '#E94E4E' : 'transparent',
                  color: view === 'create' ? '#fff' : '#808191',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '16px',
                }}
              >
                Create Task
              </button>
            </li>
            <li>
              <button
                onClick={() => setView('settings')}
                style={{
                  backgroundColor: view === 'settings' ? '#E94E4E' : 'transparent',
                  color: view === 'settings' ? '#fff' : '#808191',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '16px',
                }}
              >
                Settings
              </button>
            </li>
            <li style={{ marginLeft: 'auto', fontWeight: '600' }}>{user.email}</li>
            <li>
              <button
                onClick={onLogout}
                style={{
                  backgroundColor: '#E94E4E',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '16px',
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main style={{ padding: '20px' }}>
        {view === 'list' && (
          <>
            <section className="tasks">
              <h2>My Tasks</h2>
              <TaskList
                tasks={filteredTasks}
                updateTask={updateTask}
                deleteTask={deleteTask}
                currentUser={user.email}
                setEditingTask={setEditingTask}
                addComment={addCommentToTask}
              />
            </section>
            <section className="add-task">
              <TaskForm
                addTask={addTask}
                currentUser={user.email}
                editingTask={editingTask}