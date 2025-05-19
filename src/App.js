import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import TaskDashboard from './components/TaskDashboard';
import CuteNotifications from './components/CuteNotifications';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [notifications, setNotifications] = useState([
    'Welcome to the Task Management App!',
    'You have 3 tasks due today.',
  ]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Persist user to localStorage
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    // Redirect to login if no user and not on login or signup page
    if (!user && location.pathname !== '/login' && location.pathname !== '/signup') {
      navigate('/login');
    }
  }, [user, navigate, location]);

  const handleLogin = (email) => {
    setUser({ email });
    navigate('/');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const handleNotificationClose = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <CuteNotifications notifications={notifications} onClose={handleNotificationClose} />
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
        <Route
          path="/signup"
          element={<SignUp onLogin={handleLogin} />}
        />
        <Route
          path="/notifications"
          element={
            user ? (
              <CuteNotifications notifications={notifications} onClose={handleNotificationClose} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/"
          element={
            user ? (
              <TaskDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
