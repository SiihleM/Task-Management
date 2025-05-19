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
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDueDate, setFilterDueDate] = useState('all');
  const [sortOption, setSortOption] = useState('dueDateAsc');
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

  const filterByStatus = (task) => {
    if (filterStatus === 'all') return true;
    return task.status === filterStatus;
  };

  const filterByDueDate = (task) => {
    if (filterDueDate === 'all') return true;
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    if (filterDueDate === 'overdue') {
      return dueDate < now;
    }
    if (filterDueDate === 'today') {
      return dueDate.toDateString() === now.toDateString();
    }
    if (filterDueDate === 'week') {
      const weekFromNow = new Date();
      weekFromNow.setDate(now.getDate() + 7);
      return dueDate >= now && dueDate <= weekFromNow;
    }
    return true;
  };

  const sortTasks = (a, b) => {
    if (sortOption === 'dueDateAsc') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortOption === 'dueDateDesc') {
      return new Date(b.dueDate) - new Date(a.dueDate);
    }
    if (sortOption === 'priorityAsc') {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.urgency] - priorityOrder[b.urgency];
    }
    if (sortOption === 'priorityDesc') {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[b.urgency] - priorityOrder[a.urgency];
    }
    return 0;
  };

  const filteredTasks =
    tasks
      .filter((t) => (filterUser === 'all' ? true : t.assignedTo === filterUser))
      .filter(filterByStatus)
      .filter(filterByDueDate)
      .filter((t) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort(sortTasks);

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
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="filterStatus" style={{ marginRight: '10px' }}>Filter by Status:</label>
                <select
                  id="filterStatus"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{ marginRight: '20px' }}
                >
                  <option value="all">All</option>
                  <option value="incomplete">Incomplete</option>
                  <option value="in progress">In Progress</option>
                  <option value="complete">Complete</option>
                </select>

                <label htmlFor="filterDueDate" style={{ marginRight: '10px' }}>Filter by Due Date:</label>
                <select
                  id="filterDueDate"
                  value={filterDueDate}
                  onChange={(e) => setFilterDueDate(e.target.value)}
                  style={{ marginRight: '20px' }}
                >
                  <option value="all">All</option>
                  <option value="overdue">Overdue</option>
                  <option value="today">Today</option>
                  <option value="week">Next 7 Days</option>
                </select>

                <label htmlFor="sortOption" style={{ marginRight: '10px' }}>Sort by:</label>
                <select
                  id="sortOption"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="dueDateAsc">Due Date Ascending</option>
                  <option value="dueDateDesc">Due Date Descending</option>
                  <option value="priorityAsc">Priority Ascending</option>
                  <option value="priorityDesc">Priority Descending</option>
                </select>
              </div>
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
                updateTask={updateTask}
                cancelEdit={() => setEditingTask(null)}
                preFillDate={null}
              />
            </section>
          </>
        )}
        {view === 'calendar' && <CalendarView tasks={filteredTasks} onAddTask={handleAddTaskFromCalendar} />}
        {view === 'create' && (
          <section className="add-task">
            <TaskForm
              addTask={addTask}
              currentUser={user.email}
              editingTask={editingTask}
              updateTask={updateTask}
              cancelEdit={() => setEditingTask(null)}
              preFillDate={preFillDate}
            />
          </section>
        )}
        {view === 'settings' && <Settings />}
      </main>
    </>
  );
}

export default TaskDashboard;
