import React, { useState, useEffect, useRef } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import CalendarView from './CalendarView';
import Settings from './Settings';
import capacitizaLogo from './capacitiza_logo.jpg';

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

  // Ref for header element
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

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

  // New state for dropdown visibility
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Toggle dropdown
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown') && !event.target.closest('.profile-avatar') && !event.target.closest('.notification-bell')) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Get first letter of user email for avatar
  const avatarLetter = user.email ? user.email.charAt(0).toUpperCase() : 'U';

  return (
    <>
      <header
        ref={headerRef}
        style={{
          backgroundColor: '#07162F',
          padding: '10px 20px',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 1000,
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <h1 style={{ fontWeight: '800', fontSize: '22px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={capacitizaLogo} alt="Taskomatic Logo" style={{ height: '35px', width: '35px' }} />
          Taskomatic
        </h1>
        <nav style={{ flexGrow: 1 }}>
          <ul
            style={{
              listStyle: 'none',
              display: 'flex',
              gap: '20px',
              margin: 0,
              padding: 0,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
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
            <li
              style={{ marginLeft: 'auto', position: 'relative', display: 'flex', alignItems: 'center', gap: '15px' }}
            >
              {/* Notification Bell */}
              <div
                className="notification-bell"
                style={{
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: '24px',
                  position: 'relative',
                }}
                title="Notifications"
                onClick={() => alert('Notifications clicked')} // Placeholder for notification click handler
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  width="28"
                  height="28"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {notifications.length > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      backgroundColor: '#E94E4E',
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      color: '#fff',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                    }}
                  >
                    {notifications.length}
                  </span>
                )}
              </div>
              {/* Profile Avatar */}
              <div
                className="profile-avatar"
                onClick={toggleProfileDropdown}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  color: '#07162F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '18px',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                title={user.email}
              >
                {avatarLetter}
              </div>
              {profileDropdownOpen && (
                <div
                  className="profile-dropdown"
                  style={{
                    position: 'absolute',
                    top: '50px',
                    right: 0,
                    backgroundColor: '#fff',
                    color: '#000',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    width: '200px',
                    zIndex: 1000,
                    padding: '10px',
                  }}
                >
                  <div style={{ padding: '10px 0', borderBottom: '1px solid #ddd', fontWeight: '600' }}>
                    {user.email}
                  </div>
                  <button
                    onClick={() => setView('settings')}
                    style={{
                      marginTop: '10px',
                      width: '100%',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#07162F',
                      fontWeight: '700',
                      fontSize: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      textAlign: 'left',
                      padding: '8px 0',
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      width="20"
                      height="20"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"
                      />
                    </svg>
                    Settings
                  </button>
                  <button
                    onClick={onLogout}
                    style={{
                      marginTop: '10px',
                      width: '100%',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#E94E4E',
                      fontWeight: '700',
                      fontSize: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      width="20"
                      height="20"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                      />
                    </svg>
                    Log Out
                  </button>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </header>

      <main style={{ paddingTop: headerHeight, padding: '20px' }}>
        {view === 'list' && (
          <>
            <section className="tasks">
              <h2>My Tasks</h2>
              <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

                  <label htmlFor="filterDueDate" style={{ marginLeft: '20px', marginRight: '10px' }}>Filter by Due Date:</label>
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
                <button
                  onClick={() => {
                    setView('create');
                    setEditingTask(null);
                    setPreFillDate(null);
                  }}
                  title="Add Task"
                  style={{
                    backgroundColor: '#E94E4E',
                    border: 'none',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
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
